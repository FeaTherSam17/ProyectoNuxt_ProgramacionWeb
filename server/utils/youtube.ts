type YoutubeThumbnail = {
  url?: string
}

type YoutubeSearchItem = {
  id?: {
    videoId?: string
  }
  snippet?: {
    title?: string
    description?: string
    publishedAt?: string
    channelTitle?: string
    thumbnails?: {
      maxres?: YoutubeThumbnail
      high?: YoutubeThumbnail
      medium?: YoutubeThumbnail
      default?: YoutubeThumbnail
    }
  }
}

type YoutubeSearchResponse = {
  items?: YoutubeSearchItem[]
}

type YoutubeDetailsItem = {
  id?: string
  contentDetails?: {
    duration?: string
  }
}

type YoutubeDetailsResponse = {
  items?: YoutubeDetailsItem[]
}

type YoutubeVideoPayload = {
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

type YoutubeContentPayload = {
  configured: boolean
  channelTitle: string | null
  featuredVideo: YoutubeVideoPayload | null
  videos: YoutubeVideoPayload[]
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3'
const YOUTUBE_MAX_RESULTS = 18
const YOUTUBE_RENDER_LIMIT = 9
const YOUTUBE_SHORTS_MAX_SECONDS = 90
const YOUTUBE_CACHE_TTL_MS = 10 * 60 * 1000

let cachedYoutubeContent: { value: YoutubeContentPayload, expiresAt: number } | null = null

const pickThumbnail = (item: YoutubeSearchItem) => {
  const thumbnails = item.snippet?.thumbnails

  return (
    thumbnails?.maxres?.url
    || thumbnails?.high?.url
    || thumbnails?.medium?.url
    || thumbnails?.default?.url
    || null
  )
}

const youtubeFetch = async <T>(path: string, query: Record<string, string | number>): Promise<T> => {
  try {
    return await $fetch<T>(`${YOUTUBE_BASE_URL}${path}`, {
      method: 'GET',
      query
    })
  } catch (err: any) {
    const status = err?.status || err?.response?.status || 'unknown'
    const data = err?.data ? JSON.stringify(err.data) : 'no-response-body'
    const msg = `YouTube API request failed for ${path}: status=${status} message=${err?.message || String(err)} body=${data}`
    console.error(msg, err)
    throw new Error(msg)
  }
}

const parseIsoDurationToSeconds = (value: string) => {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value)

  if (!match) {
    return 0
  }

  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)

  return (hours * 3600) + (minutes * 60) + seconds
}

const formatDuration = (totalSeconds: number) => {
  const seconds = Math.max(0, totalSeconds)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

const mapVideoItem = (item: YoutubeSearchItem, durationSeconds: number): YoutubeVideoPayload | null => {
  const videoId = item.id?.videoId
  const title = item.snippet?.title

  if (!videoId || !title) {
    return null
  }

  return {
    id: videoId,
    title,
    description: item.snippet?.description || '',
    thumbnailUrl: pickThumbnail(item) || '',
    publishedAt: item.snippet?.publishedAt || '',
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    durationSeconds,
    durationLabel: formatDuration(durationSeconds)
  }
}

export const getYoutubeContent = async (): Promise<YoutubeContentPayload> => {
  const config = useRuntimeConfig()
  const youtubeApiKey = config.youtubeApiKey
  const youtubeChannelId = config.youtubeChannelId

  if (!youtubeApiKey || !youtubeChannelId) {
    return {
      configured: false,
      channelTitle: null,
      featuredVideo: null,
      videos: []
    }
  }

  if (cachedYoutubeContent && cachedYoutubeContent.expiresAt > Date.now()) {
    return cachedYoutubeContent.value
  }

  const response = await youtubeFetch<YoutubeSearchResponse>('/search', {
    key: youtubeApiKey,
    part: 'snippet',
    channelId: youtubeChannelId,
    order: 'date',
    type: 'video',
    maxResults: YOUTUBE_MAX_RESULTS
  })

  const searchItems = response.items || []
  const videoIds = searchItems
    .map(item => item.id?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId))

  let durationByVideoId = new Map<string, number>()

  if (videoIds.length > 0) {
    const detailsResponse = await youtubeFetch<YoutubeDetailsResponse>('/videos', {
      key: youtubeApiKey,
      part: 'contentDetails',
      id: videoIds.join(',')
    })

    durationByVideoId = new Map(
      (detailsResponse.items || [])
        .filter((item): item is YoutubeDetailsItem & { id: string } => Boolean(item.id))
        .map(item => {
          const duration = parseIsoDurationToSeconds(item.contentDetails?.duration || '')
          return [item.id, duration]
        })
    )
  }

  const videos = searchItems
    .map((item) => {
      const videoId = item.id?.videoId || ''
      const durationSeconds = durationByVideoId.get(videoId) || 0
      return mapVideoItem(item, durationSeconds)
    })
    .filter((item): item is YoutubeVideoPayload => Boolean(item))
    .filter(video => video.durationSeconds > YOUTUBE_SHORTS_MAX_SECONDS)
    .slice(0, YOUTUBE_RENDER_LIMIT)

  const content: YoutubeContentPayload = {
    configured: true,
    channelTitle: response.items?.[0]?.snippet?.channelTitle || null,
    featuredVideo: videos[0] || null,
    videos: videos.slice(1)
  }

  cachedYoutubeContent = {
    value: content,
    expiresAt: Date.now() + YOUTUBE_CACHE_TTL_MS
  }

  return content
}
