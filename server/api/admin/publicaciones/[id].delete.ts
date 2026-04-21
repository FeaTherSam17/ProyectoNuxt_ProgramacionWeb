import { requireAdminSession } from '../../../utils/auth'
import { sqlQuery } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID invalido.' })
  }

  const result = await sqlQuery('DELETE FROM publicaciones_blog WHERE id = $1', [id])

  if (result.rowCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Publicacion no encontrada.' })
  }

  return {
    ok: true,
    data: {
      id
    }
  }
})
