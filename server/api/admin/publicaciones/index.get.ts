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

  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()
  const estado = String(query.estado || '').trim().toLowerCase()

  const params: unknown[] = []
  const conditions: string[] = []

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(LOWER(p.titulo) LIKE $${params.length} OR LOWER(p.slug) LIKE $${params.length})`)
  }

  if (estado) {
    params.push(estado)
    conditions.push(`p.estado = $${params.length}`)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

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
      ${where}
      GROUP BY p.id
      ORDER BY p.id DESC
    `,
    params
  )

  return {
    ok: true,
    data: result.rows
  }
})
