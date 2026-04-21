import type { H3Event } from 'h3'
import nodemailer from 'nodemailer'

type ContactStatus = 'nuevo' | 'leido' | 'respondido'

interface ContactRequestBody {
  nombre?: string
  correo?: string
  asunto?: string
  mensaje?: string
  estado?: ContactStatus
}

interface ContactEmailData {
  nombre: string
  correo: string
  asunto: string
  mensaje: string
  estado: ContactStatus
  enviado_en: string
}

const allowedStates: ContactStatus[] = ['nuevo', 'leido', 'respondido']

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
  const estado = body?.estado && allowedStates.includes(body.estado) ? body.estado : 'nuevo'

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
    mensaje,
    estado
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
    `Estado: ${data.estado}`,
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

  try {
    await sendContactEmail(event, emailData)

    return {
      ok: true,
      data: {
        estado: payload.estado,
        enviadoEn: sentAt,
        emailSent: true,
        emailStatus: null
      }
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const smtpReason = error instanceof Error && error.message
      ? error.message
      : 'Error SMTP desconocido.'

    throw createError({
      statusCode: 500,
      statusMessage: `No se pudo enviar el formulario por SMTP: ${smtpReason}`
    })
  }
})
