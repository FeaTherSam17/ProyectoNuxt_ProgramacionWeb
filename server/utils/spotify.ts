type SpotifyTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

type SpotifyImage = {
  url: string
}

type SpotifyArtist = {
  name: string
}

type SpotifyTrackApi = {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: {
    name: string
    images: SpotifyImage[]
  }
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

type SpotifyAlbumTrackApi = {
  id: string
  name: string
  artists: SpotifyArtist[]
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

type SpotifyTracksByIdsApi = {
  tracks: SpotifyTrackApiWithPopularity[]
}

type SpotifyTrackApiWithPopularity = SpotifyTrackApi & {
  popularity: number
}

type SpotifyAlbumApi = {
  id: string
  name: string
  artists: SpotifyArtist[]
  images: SpotifyImage[]
  release_date: string
  total_tracks: number
  external_urls: {
    spotify: string
  }
}

type SpotifyPlaylistApi = {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  external_urls: {
    spotify: string
  }
}

let cachedToken: { value: string, expiresAt: number } | null = null

const SPOTIFY_TOP_TRACKS_LIMIT = 8
const SPOTIFY_ALBUM_SCAN_LIMIT = 5

const normalizeCsv = (value: string) => {
  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
}

const getSpotifyToken = async () => {
  const config = useRuntimeConfig()
  const clientId = config.spotifyClientId
  const clientSecret = config.spotifyClientSecret

  if (!clientId || !clientSecret) {
    return null
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 15_000) {
    return cachedToken.value
  }

  const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const body = new URLSearchParams({ grant_type: 'client_credentials' }).toString()

  const tokenResponse = await $fetch<SpotifyTokenResponse>('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  cachedToken = {
    value: tokenResponse.access_token,
    expiresAt: Date.now() + tokenResponse.expires_in * 1000
  }

  return cachedToken.value
}

const spotifyFetch = async <T>(path: string, token: string, query: Record<string, string | number> = {}) => {
  try {
    return await $fetch<T>(`https://api.spotify.com/v1${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      query
    })
  } catch (err: any) {
    // enrich and rethrow for upstream handler
    const status = err?.status || err?.response?.status || 'unknown'
    const data = err?.data ? JSON.stringify(err.data) : 'no-response-body'
    const msg = `Spotify API request failed for ${path}: status=${status} message=${err?.message || String(err)} body=${data}`
    console.error(msg, err)
    throw new Error(msg)
  }
}

const chunk = <T>(items: T[], size: number) => {
  const result: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }

  return result
}

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>()

  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item)
    }
  }

  return [...map.values()]
}

const getTracksFromAlbums = async (token: string, market: string, albums: SpotifyAlbumApi[]) => {
  const scopedAlbums = uniqueById(albums).slice(0, SPOTIFY_ALBUM_SCAN_LIMIT)

  const albumTracksSettled = await Promise.allSettled(
    scopedAlbums.map((album) => {
      return spotifyFetch<{ items: SpotifyAlbumTrackApi[] }>(`/albums/${album.id}/tracks`, token, {
        market,
        limit: 50
      }).then(result => {
        return {
          album,
          tracks: result.items
        }
      })
    })
  )

  const rawCandidates = albumTracksSettled
    .filter(result => result.status === 'fulfilled')
    .flatMap((result) => {
      const value = result.status === 'fulfilled' ? result.value : null

      if (!value) {
        return []
      }

      return value.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        albumName: value.album.name,
        albumImage: value.album.images[0]?.url || null
      }))
    })
    .filter(track => Boolean(track.id))

  const candidatesById = new Map<string, (typeof rawCandidates)[number]>()

  for (const track of rawCandidates) {
    if (!candidatesById.has(track.id)) {
      candidatesById.set(track.id, track)
    }
  }

  const trackIds = [...candidatesById.keys()]
  if (trackIds.length === 0) {
    return []
  }

  const detailChunks = chunk(trackIds, 50)
  const detailedTracks: SpotifyTrackApiWithPopularity[] = []

  for (const ids of detailChunks) {
    try {
      const detailResponse = await spotifyFetch<SpotifyTracksByIdsApi>('/tracks', token, {
        market,
        ids: ids.join(',')
      })

      detailedTracks.push(...(detailResponse.tracks || []).filter(Boolean))
    } catch (error) {
      console.error('Spotify tracks detail chunk failed:', error)
    }
  }

  const detailsById = new Map(detailedTracks.map(track => [track.id, track]))

  return [...candidatesById.values()]
    .map((candidate) => {
      const details = detailsById.get(candidate.id)

      return {
        id: candidate.id,
        name: details?.name || candidate.name,
        artists: (details?.artists || candidate.artists).map(artist => artist.name),
        album: details?.album?.name || candidate.albumName,
        imageUrl: details?.album?.images?.[0]?.url || candidate.albumImage,
        previewUrl: details?.preview_url ?? candidate.preview_url,
        externalUrl: details?.external_urls?.spotify || candidate.external_urls.spotify,
        popularity: details?.popularity ?? -1
      }
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, SPOTIFY_TOP_TRACKS_LIMIT)
    .map(({ popularity: _popularity, ...track }) => track)
}

const getArtistAlbums = async (token: string, artistId: string, market: string) => {
  try {
    const response = await spotifyFetch<{ items: SpotifyAlbumApi[] }>(`/artists/${artistId}/albums`, token, {
      market,
      limit: SPOTIFY_ALBUM_SCAN_LIMIT
    })

    return response.items || []
  } catch (error) {
    console.error('Spotify artist albums primary query failed, retrying without market:', error)

    const retryResponse = await spotifyFetch<{ items: SpotifyAlbumApi[] }>(`/artists/${artistId}/albums`, token, {
      limit: SPOTIFY_ALBUM_SCAN_LIMIT
    })

    return retryResponse.items || []
  }
}

export const getSpotifyContent = async () => {
  const config = useRuntimeConfig()
  const artistId = config.spotifyArtistId
  const market = config.spotifyMarket || 'US'
  const playlistIds = normalizeCsv(config.spotifyPlaylistIds || '')

  let token: string | null = null
  try {
    token = await getSpotifyToken()
  } catch (err: any) {
    console.error('Failed to obtain Spotify token:', err)
    throw new Error(`Failed to obtain Spotify token: ${err?.message || String(err)}`)
  }

  if (!token || !artistId) {
    return {
      configured: false,
      tracks: [],
      albums: [],
      playlists: []
    }
  }

  const [albumsResult, playlistsResult] = await Promise.allSettled([
    getArtistAlbums(token, artistId, market),
    Promise.all(
      playlistIds.slice(0, 6).map((playlistId) => {
        return spotifyFetch<SpotifyPlaylistApi>(`/playlists/${playlistId}`, token, { market })
      })
    )
  ])

  const albums = albumsResult.status === 'fulfilled' ? albumsResult.value : []
  const playlists = playlistsResult.status === 'fulfilled' ? playlistsResult.value : []

  if (albumsResult.status === 'rejected') {
    console.error('Spotify albums request failed:', albumsResult.reason)
  }

  if (playlistsResult.status === 'rejected') {
    console.error('Spotify playlists request failed:', playlistsResult.reason)
  }

  let tracks: Array<{
    id: string
    name: string
    artists: string[]
    album: string
    imageUrl: string | null
    previewUrl: string | null
    externalUrl: string
  }> = []

  try {
    tracks = await getTracksFromAlbums(token, market, albums)
  } catch (error) {
    console.error('Spotify derived tracks pipeline failed:', error)
  }

  return {
    configured: true,
    tracks,
    albums: albums.map(album => ({
      id: album.id,
      name: album.name,
      artists: album.artists.map(artist => artist.name),
      imageUrl: album.images[0]?.url || null,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      externalUrl: album.external_urls.spotify
    })),
    playlists: playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images[0]?.url || null,
      externalUrl: playlist.external_urls.spotify
    }))
  }
}
