import { sqlQuery } from '../../utils/db'

export default defineEventHandler(async () => {
  try {
    const result = await sqlQuery<{ ok: number }>('SELECT 1 AS ok')

    return {
      ok: true,
      data: {
        connected: true,
        ping: result.rows[0]?.ok === 1
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database health check failed',
      data: error
    })
  }
})
