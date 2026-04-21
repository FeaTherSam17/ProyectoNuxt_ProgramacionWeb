import type { H3Event } from 'h3'
import { getAdminSession } from './auth-session'

export const getAllowedEmails = () => {
  const config = useRuntimeConfig()

  return String(config.authAllowedEmails || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
}

export const isEmailAllowed = (email: string) => {
  const allowed = getAllowedEmails()

  if (allowed.length === 0) {
    return false
  }

  return allowed.includes(email.trim().toLowerCase())
}

export const requireAdminSession = (event: H3Event) => {
  const session = getAdminSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  if (session.rol !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  return session
}
