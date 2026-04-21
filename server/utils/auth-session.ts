import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const AUTH_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

type SessionPayload = {
  email: string
  nombre: string
  avatar: string | null
  rol: 'admin' | 'autor'
  exp: number
}

const toBase64Url = (value: string) => Buffer.from(value, 'utf8').toString('base64url')
const fromBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

const getAuthSecret = () => {
  const config = useRuntimeConfig()

  if (!config.authSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing AUTH_SECRET or SESSION_SECRET in environment variables.'
    })
  }

  return config.authSecret
}

const signPayload = (payloadBase64: string, secret: string) => {
  return createHmac('sha256', secret).update(payloadBase64).digest('base64url')
}

const createToken = (payload: SessionPayload) => {
  const secret = getAuthSecret()
  const payloadBase64 = toBase64Url(JSON.stringify(payload))
  const signature = signPayload(payloadBase64, secret)
  return `${payloadBase64}.${signature}`
}

const parseToken = (token: string): SessionPayload | null => {
  const secret = getAuthSecret()
  const [payloadBase64, signature] = token.split('.')

  if (!payloadBase64 || !signature) {
    return null
  }

  const expectedSignature = signPayload(payloadBase64, secret)

  try {
    const incoming = Buffer.from(signature)
    const expected = Buffer.from(expectedSignature)

    if (incoming.length !== expected.length || !timingSafeEqual(incoming, expected)) {
      return null
    }

    const payload = JSON.parse(fromBase64Url(payloadBase64)) as SessionPayload

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export const setAdminSession = (event: H3Event, session: Omit<SessionPayload, 'exp'>) => {
  const payload: SessionPayload = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS
  }

  const token = createToken(payload)

  setCookie(event, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS
  })
}

export const clearAdminSession = (event: H3Event) => {
  deleteCookie(event, AUTH_COOKIE_NAME, {
    path: '/'
  })
}

export const getAdminSession = (event: H3Event) => {
  const token = getCookie(event, AUTH_COOKIE_NAME)

  if (!token) {
    return null
  }

  return parseToken(token)
}
