import type { H3Event } from 'h3'
import nodemailer from 'nodemailer'
import { sqlQuery } from '../../utils/db'

interface ContactRequestBody {
  nombre?: string
  correo?: string
  asunto?: string
  mensaje?: string
}

interface ContactEmailData {
  nombre: string
  correo: string
  asunto: string
  mensaje: string
  enviado_en: string
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const cleanText = (value: unknown) => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

const parseContactPayload = (body: ContactRequestBody) => {
  const nombre = cleanText(body?.nombre)
  const correo = cleanText(body?.correo).toLowerCase()
  const asunto = cleanText(body?.asunto)
  const mensaje = cleanText(body?.mensaje)

  if (nombre.length < 2 || nombre.length > 150) {
    throw createError({ statusCode: 400, statusMessage: 'El nombre debe tener entre 2 y 150 caracteres.' })
  }

  if (!isValidEmail(correo) || correo.length > 255) {
    throw createError({ statusCode: 400, statusMessage: 'El correo no es valido.' })
  }

  if (asunto.length < 3 || asunto.length > 255) {
    throw createError({ statusCode: 400, statusMessage: 'El asunto debe tener entre 3 y 255 caracteres.' })
  }

  if (mensaje.length < 10 || mensaje.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'El mensaje debe tener entre 10 y 5000 caracteres.' })
  }

  return {
    nombre,
    correo,
    asunto,
    mensaje
  }
}

const sendContactEmail = async (event: H3Event, data: ContactEmailData) => {
  const config = useRuntimeConfig(event)

  const missingVars: string[] = []

  if (!config.smtpUrl) {
    missingVars.push('SMTP_URL')
  }

  if (!config.contactRecipientEmail) {
    missingVars.push('CONTACT_RECIPIENT_EMAIL')
  }

  if (missingVars.length > 0) {
    throw createError({
      statusCode: 500,
      statusMessage: `Variables no configuradas: ${missingVars.join(', ')}`
    })
  }

  const transporter = nodemailer.createTransport(config.smtpUrl)

  const textBody = [
    'Nuevo mensaje de contacto',
    `Nombre: ${data.nombre}`,
    `Correo: ${data.correo}`,
    `Asunto: ${data.asunto}`,
    `Enviado en: ${data.enviado_en}`,
    '',
    data.mensaje
  ].join('\n')

  await transporter.sendMail({
    from: config.contactSenderEmail || config.contactRecipientEmail,
    to: config.contactRecipientEmail,
    replyTo: data.correo,
    subject: `[Contacto] ${data.asunto}`,
    text: textBody
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactRequestBody>(event)
  const payload = parseContactPayload(body)
  const sentAt = new Date().toISOString()
  const emailData: ContactEmailData = {
    ...payload,
    enviado_en: sentAt
  }

  let insertedId: number | null = null

  try {
    const insertResult = await sqlQuery<{ id: number }>(
      `
        INSERT INTO mensajes_contacto (nombre, correo, asunto, mensaje)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
      [payload.nombre, payload.correo, payload.asunto, payload.mensaje]
    )

    insertedId = insertResult.rows[0]?.id ?? null

    if (!insertedId) {
      throw createError({ statusCode: 500, statusMessage: 'No se pudo guardar el mensaje de contacto.' })
    }

    let emailSent = true
    let emailStatus: string | null = null

    try {
      await sendContactEmail(event, emailData)
    } catch (error) {
      emailSent = false
      emailStatus = error instanceof Error && error.message
        ? error.message
        : 'Error SMTP desconocido.'
    }

    return {
      ok: true,
      data: {
        estado: 'nuevo',
        enviadoEn: sentAt,
        emailSent,
        emailStatus,
        id: insertedId
      }
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const dbReason = error instanceof Error && error.message
      ? error.message
      : 'Error de base de datos desconocido.'

    throw createError({
      statusCode: 500,
      statusMessage: `No se pudo guardar el formulario de contacto: ${dbReason}`
    })
  }
})
