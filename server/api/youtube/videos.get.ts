import { getYoutubeContent } from '../../utils/youtube'

type YoutubeApiResponse = {
  ok: true
  data: Awaited<ReturnType<typeof getYoutubeContent>>
}

export default defineEventHandler(async (): Promise<YoutubeApiResponse> => {
  try {
    const content = await getYoutubeContent()

    return {
      ok: true,
      data: content
    }
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'YouTube integration failed',
      data: error
    })
  }
})
