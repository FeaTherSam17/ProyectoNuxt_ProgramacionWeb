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

export interface YoutubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  videoUrl: string
}
