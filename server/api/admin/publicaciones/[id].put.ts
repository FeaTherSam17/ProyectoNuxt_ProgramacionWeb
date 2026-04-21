import { requireAdminSession } from '../../../utils/auth'
import { parseBlogPayload } from '../../../utils/blog'
import { sqlQuery } from '../../../utils/db'

const syncTags = async (postId: number, tags: string[]) => {
  await sqlQuery('DELETE FROM publicaciones_etiquetas WHERE publicacion_id = $1', [postId])

  for (const tag of tags) {
    const tagResult = await sqlQuery<{ id: number }>(
      `
        INSERT INTO etiquetas (nombre)
        VALUES ($1)
        ON CONFLICT (nombre)
        DO UPDATE SET nombre = EXCLUDED.nombre
        RETURNING id
      `,
      [tag]
    )

    const tagId = tagResult.rows[0]?.id

    if (!tagId) {
      throw createError({ statusCode: 500, statusMessage: 'No se pudo resolver la etiqueta.' })
    }

    await sqlQuery(
      `
        INSERT INTO publicaciones_etiquetas (publicacion_id, etiqueta_id)
        VALUES ($1, $2)
        ON CONFLICT (publicacion_id, etiqueta_id)
        DO NOTHING
      `,
      [postId, tagId]
    )
  }
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID invalido.' })
  }

  const body = await readBody(event)
  const payload = parseBlogPayload(body)

  const result = await sqlQuery(
    `
      UPDATE publicaciones_blog
      SET
        titulo = $1,
        slug = $2,
        resumen = $3,
        contenido = $4,
        imagen_portada = $5,
        estado = $6,
        publicado_en = CASE
          WHEN $6 = 'publicado' AND publicado_en IS NULL THEN CURRENT_TIMESTAMP
          WHEN $6 <> 'publicado' THEN NULL
          ELSE publicado_en
        END
      WHERE id = $7
    `,
    [
      payload.titulo,
      payload.slug,
      payload.resumen,
      payload.contenido,
      payload.imagenPortada,
      payload.estado,
      id
    ]
  )

  if (result.rowCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Publicacion no encontrada.' })
  }

  await syncTags(id, payload.etiquetas)

  return {
    ok: true,
    data: {
      id
    }
  }
})
