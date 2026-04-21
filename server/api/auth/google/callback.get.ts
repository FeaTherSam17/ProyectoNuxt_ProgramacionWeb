import { setAdminSession } from '../../../utils/auth-session'
import { isEmailAllowed } from '../../../utils/auth'

type GoogleTokenResponse = {
  access_token?: string
  id_token?: string
  error?: string
}

type GoogleUserInfo = {
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture?: string
}

const buildCallbackUrl = (event: any) => {
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
  const query = getQuery(event)

  if (query.error) {
    return sendRedirect(event, `/admin/login?error=${encodeURIComponent(String(query.error))}`)
  }

  const code = String(query.code || '')
  const state = String(query.state || '')
  const storedState = getCookie(event, 'oauth_google_state')

  if (!code || !state || !storedState || state !== storedState) {
    return sendRedirect(event, '/admin/login?error=oauth_state')
  }

  deleteCookie(event, 'oauth_google_state', { path: '/' })

  if (!config.googleClientId || !config.googleClientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.'
    })
  }

  const callbackUrl = buildCallbackUrl(event)
  const tokenResponse = await $fetch<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code'
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  if (!tokenResponse.access_token) {
    return sendRedirect(event, '/admin/login?error=oauth_token')
  }

  const user = await $fetch<GoogleUserInfo>('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`
    }
  })

  if (!user.email || !user.email_verified || !isEmailAllowed(user.email)) {
    return sendRedirect(event, '/admin/login?error=not_allowed')
  }

  setAdminSession(event, {
    email: user.email.toLowerCase(),
    nombre: user.name || user.email,
    avatar: user.picture || null,
    rol: 'admin'
  })

  return sendRedirect(event, '/admin/publicaciones')
})
