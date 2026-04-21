const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

const buildCallbackUrl = (event: Parameters<typeof defineEventHandler>[0] extends never ? never : any) => {
  const config = useRuntimeConfig()

  if (config.googleCallbackUrl) {
    return config.googleCallbackUrl
  }

  const protocol = getRequestProtocol(event)
  const host = getRequestHost(event)
  return `${protocol}://${host}/api/auth/google/callback`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.googleClientId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing GOOGLE_CLIENT_ID.'
    })
  }

  const callbackUrl = buildCallbackUrl(event)
  const state = crypto.randomUUID()

  setCookie(event, 'oauth_google_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10
  })

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state
  })

  return sendRedirect(event, `${GOOGLE_AUTH_URL}?${params.toString()}`)
})
