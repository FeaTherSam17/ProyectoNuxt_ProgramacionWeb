import { requireAdminSession } from '../../utils/auth'
import { sqlQuery } from '../../utils/db'

type MensajeContactoRow = {
  id: number
  nombre: string
  correo: string
  asunto: string
  mensaje: string
  creado_en: string
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const result = await sqlQuery<MensajeContactoRow>(
    `
      SELECT
        id,
        nombre,
        correo,
        asunto,
        mensaje,
        creado_en
      FROM mensajes_contacto
      ORDER BY creado_en DESC, id DESC
    `
  )

  return {
    ok: true,
    data: result.rows
  }
})