import { requireAdminSession } from '../../../utils/auth'
import { sqlQuery } from '../../../utils/db'
import type { EstadoPublicacion } from '../../../utils/blog'

type Row = {
  id: number
  titulo: string
  slug: string
  resumen: string | null
  contenido: string
  imagen_portada: string | null
  estado: EstadoPublicacion
  publicado_en: string | null
  etiquetas: string[]
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID invalido.' })
  }

  const result = await sqlQuery<Row>(
    `
      SELECT
        p.id,
        p.titulo,
        p.slug,
        p.resumen,
        p.contenido,
        p.imagen_portada,
        p.estado,
        p.publicado_en,
        COALESCE(array_remove(array_agg(e.nombre), NULL), '{}') AS etiquetas
      FROM publicaciones_blog p
      LEFT JOIN publicaciones_etiquetas pe ON pe.publicacion_id = p.id
      LEFT JOIN etiquetas e ON e.id = pe.etiqueta_id
      WHERE p.id = $1
      GROUP BY p.id
      LIMIT 1
    `,
    [id]
  )

  const row = result.rows[0]

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Publicacion no encontrada.' })
  }

  return {
    ok: true,
    data: row
  }
})
