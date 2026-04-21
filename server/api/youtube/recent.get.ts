interface YoutubeSearchResponse {
  items: Array<{
    id: {
      videoId: string
    }
  }>
}

interface YoutubeVideosResponse {
  items: Array<{
    id: string
    snippet: {
      title: string
      description: string
      channelTitle: string
      publishedAt: string
      thumbnails?: {
        maxres?: { url: string }
        high?: { url: string }
        medium?: { url: string }
        default?: { url: string }
      }
    }
    statistics?: {
      viewCount?: string
      likeCount?: string
      commentCount?: string
    }
    contentDetails?: {
      duration?: string
    }
  }>
}

function getPreferredThumbnail(thumbnails?: YoutubeVideosResponse['items'][number]['snippet']['thumbnails']) {
  return thumbnails?.maxres?.url
    || thumbnails?.high?.url
    || thumbnails?.medium?.url
    || thumbnails?.default?.url
    || ''
}

function toReadableDuration(isoDuration?: string) {
  if (!isoDuration) {
    return 'N/D'
  }

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)

  if (!match) {
    return 'N/D'
  }

  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.youtubeApiKey
  const channelId = config.youtubeChannelId

  if (!apiKey || !channelId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing YouTube API configuration (YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID).'
    })
  }

  const searchResponse = await $fetch<YoutubeSearchResponse>('https://www.googleapis.com/youtube/v3/search', {
    query: {
      part: 'snippet',
      channelId,
      order: 'date',
      type: 'video',
      maxResults: 5,
      key: apiKey
    }
  })

  const videoIds = searchResponse.items.map(item => item.id.videoId).filter(Boolean)

  if (!videoIds.length) {
    return {
      ok: true,
      count: 0,
      channelId,
      videos: []
    }
  }

  const videosResponse = await $fetch<YoutubeVideosResponse>('https://www.googleapis.com/youtube/v3/videos', {
    query: {
      part: 'snippet,contentDetails,statistics',
      id: videoIds.join(','),
      key: apiKey
    }
  })

  const orderMap = new Map(videoIds.map((id, index) => [id, index]))

  const videos = videosResponse.items
    .sort((a, b) => (orderMap.get(a.id) || 0) - (orderMap.get(b.id) || 0))
    .map((video) => {
      const views = Number(video.statistics?.viewCount || 0)
      const likes = Number(video.statistics?.likeCount || 0)
      const comments = Number(video.statistics?.commentCount || 0)

      return {
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        duration: toReadableDuration(video.contentDetails?.duration),
        thumbnail: getPreferredThumbnail(video.snippet.thumbnails),
        views,
        likes,
        comments,
        url: `https://www.youtube.com/watch?v=${video.id}`
      }
    })

  return {
    ok: true,
    count: videos.length,
    channelId,
    videos
  }
}, {
  maxAge: 60 * 10,
  swr: true
})
