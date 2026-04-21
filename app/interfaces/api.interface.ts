export interface ApiSuccess<T> {
  ok: true
  data: T
}

export interface ApiError {
  ok: false
  message: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface SpotifyTrack {
  id: string
  name: string
  artists: string[]
  album: string
  imageUrl: string | null
  previewUrl: string | null
  externalUrl: string
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: string[]
  imageUrl: string | null
  releaseDate: string
  totalTracks: number
  externalUrl: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  imageUrl: string | null
  externalUrl: string
}

export interface SpotifyMusicPayload {
  configured: boolean
  tracks: SpotifyTrack[]
  albums: SpotifyAlbum[]
  playlists: SpotifyPlaylist[]
}

export interface YoutubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  videoUrl: string
  embedUrl: string
  durationSeconds: number
  durationLabel: string
}

export interface YoutubePayload {
  configured: boolean
  channelTitle: string | null
  featuredVideo: YoutubeVideo | null
  videos: YoutubeVideo[]
}
