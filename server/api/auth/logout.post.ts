import { clearAdminSession } from '../../utils/auth-session'

export default defineEventHandler(async (event) => {
  clearAdminSession(event)

  return {
    ok: true
  }
})
