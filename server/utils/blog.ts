export type EstadoPublicacion = 'borrador' | 'publicado' | 'archivado'

export type BlogPayload = {
  titulo: string
  slug?: string
  resumen?: string | null
  contenido: string
  imagenPortada?: string | null
  estado?: EstadoPublicacion
  etiquetas?: string[]
}

const VALID_STATES: EstadoPublicacion[] = ['borrador', 'publicado', 'archivado']

export const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const normalizeTags = (tags: unknown) => {
  if (!Array.isArray(tags)) {
    return [] as string[]
  }

  const cleaned = tags
    .map(tag => String(tag).trim().toLowerCase())
    .filter(Boolean)

  return [...new Set(cleaned)]
}

export const parseBlogPayload = (body: unknown): Required<BlogPayload> => {
  const data = (body || {}) as BlogPayload
  const titulo = String(data.titulo || '').trim()
  const contenido = String(data.contenido || '').trim()
  const slug = slugify(data.slug?.trim() || titulo)
  const estado = (data.estado || 'borrador') as EstadoPublicacion

  if (!titulo) {
    throw createError({ statusCode: 400, statusMessage: 'El titulo es obligatorio.' })
  }

  if (!contenido) {
    throw createError({ statusCode: 400, statusMessage: 'El contenido es obligatorio.' })
  }

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'No se pudo generar un slug valido.' })
  }

  if (!VALID_STATES.includes(estado)) {
    throw createError({ statusCode: 400, statusMessage: 'Estado invalido.' })
  }

  return {
    titulo,
    slug,
    resumen: data.resumen?.trim() || null,
    contenido,
    imagenPortada: data.imagenPortada?.trim() || null,
    estado,
    etiquetas: normalizeTags(data.etiquetas)
  }
}
