import { getSpotifyContent } from '../../utils/spotify'

export default defineEventHandler(async () => {
  try {
    const content = await getSpotifyContent()

    return {
      ok: true,
      data: content
    }
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Spotify integration failed',
      data: error
    })
  }
})
