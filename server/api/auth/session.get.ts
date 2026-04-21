import { getAdminSession } from '../../utils/auth-session'

export default defineEventHandler(async (event) => {
  const session = getAdminSession(event)

  if (!session) {
    return {
      ok: false,
      data: null
    }
  }

  return {
    ok: true,
    data: session
  }
})
