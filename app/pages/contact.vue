<script setup lang="ts">
interface ContactForm {
  nombre: string
  correo: string
  asunto: string
  mensaje: string
}

interface ContactApiResponse {
  ok: boolean
  message?: string
  statusMessage?: string
  data?: {
    estado: string
    enviadoEn: string
    emailSent: boolean
    emailStatus: string | null
  }
}

const form = reactive<ContactForm>({
  nombre: '',
  correo: '',
  asunto: '',
  mensaje: ''
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref<null | ContactApiResponse['data']>(null)

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const validateForm = () => {
  errors.nombre = ''
  errors.correo = ''
  errors.asunto = ''
  errors.mensaje = ''

  if (form.nombre.trim().length < 2 || form.nombre.trim().length > 150) {
    errors.nombre = 'El nombre debe tener entre 2 y 150 caracteres.'
  }

  if (!isValidEmail(form.correo.trim()) || form.correo.trim().length > 255) {
    errors.correo = 'Escribe un correo valido.'
  }

  if (form.asunto.trim().length < 3 || form.asunto.trim().length > 255) {
    errors.asunto = 'El asunto debe tener entre 3 y 255 caracteres.'
  }

  if (form.mensaje.trim().length < 10 || form.mensaje.trim().length > 5000) {
    errors.mensaje = 'El mensaje debe tener entre 10 y 5000 caracteres.'
  }

  return !errors.nombre && !errors.correo && !errors.asunto && !errors.mensaje
}

const resetForm = () => {
  form.nombre = ''
  form.correo = ''
  form.asunto = ''
  form.mensaje = ''
  submitError.value = ''
  submitSuccess.value = null
}

const submitContact = async () => {
  submitError.value = ''
  submitSuccess.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: form.nombre,
        correo: form.correo,
        asunto: form.asunto,
        mensaje: form.mensaje
      })
    })

    const payload = await response.json() as ContactApiResponse

    if (!response.ok || !payload.ok || !payload.data) {
      throw new Error(payload.statusMessage || payload.message || 'No se pudo enviar el formulario de contacto.')
    }

    submitSuccess.value = payload.data

    form.nombre = ''
    form.correo = ''
    form.asunto = ''
    form.mensaje = ''
  } catch (error) {
    submitError.value = error instanceof Error
      ? error.message
      : 'Error al enviar el formulario. Intenta nuevamente en unos segundos.'
  } finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: 'Contacto',
  ogTitle: 'Contacto',
  description: 'Canal directo para mensajes, propuestas y colaboraciones.',
  ogDescription: 'Canal directo para mensajes, propuestas y colaboraciones.'
})
</script>

<template>
  <UContainer class="contact-page py-14">
    <section class="contact-hero">
      <p class="section-label">
        Contacto
      </p>
      <h1 class="hero-title mt-2">
        Enviame un mensaje directo
      </h1>
      <p class="hero-description mt-4 max-w-2xl">
        Este formulario envia tu mensaje por correo en tiempo real.
      </p>
    </section>

    <section class="contact-shell mt-8">
      <form class="contact-form" @submit.prevent="submitContact">
        <div class="field-grid">
          <label class="field-label" for="nombre">Nombre</label>
          <input
            id="nombre"
            v-model="form.nombre"
            type="text"
            class="field-input"
            maxlength="150"
            placeholder="Tu nombre"
            required
          >
          <p v-if="errors.nombre" class="field-error">{{ errors.nombre }}</p>
        </div>

        <div class="field-grid">
          <label class="field-label" for="correo">Correo</label>
          <input
            id="correo"
            v-model="form.correo"
            type="email"
            class="field-input"
            maxlength="255"
            placeholder="tu@email.com"
            required
          >
          <p v-if="errors.correo" class="field-error">{{ errors.correo }}</p>
        </div>

        <div class="field-grid">
          <label class="field-label" for="asunto">Asunto</label>
          <input
            id="asunto"
            v-model="form.asunto"
            type="text"
            class="field-input"
            maxlength="255"
            placeholder="Tema del mensaje"
            required
          >
          <p v-if="errors.asunto" class="field-error">{{ errors.asunto }}</p>
        </div>

        <div class="field-grid">
          <label class="field-label" for="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            v-model="form.mensaje"
            class="field-input field-textarea"
            maxlength="5000"
            rows="6"
            placeholder="Escribe aqui tu mensaje..."
            required
          ></textarea>
          <p v-if="errors.mensaje" class="field-error">{{ errors.mensaje }}</p>
        </div>

        <!-- <p class="field-help">El mensaje se enviara a tu correo de destino configurado.</p> -->

        <div class="mt-6 flex flex-wrap gap-3">
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            :loading="isSubmitting"
          >
            Enviar mensaje
          </UButton>
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            :disabled="isSubmitting"
            @click="resetForm"
          >
            Limpiar
          </UButton>
        </div>

        <UAlert
          v-if="submitError"
          class="mt-5"
          color="error"
          variant="soft"
          :title="submitError"
        />

        <UAlert
          v-if="submitSuccess"
          class="mt-5"
          color="success"
          variant="soft"
          title="Mensaje enviado"
          :description="`Enviado correctamente el ${new Date(submitSuccess.enviadoEn).toLocaleString('es-MX')}.`"
        />

        <p v-if="submitSuccess && !submitSuccess.emailSent" class="field-help mt-3">
          No se pudo enviar correo. Revisa SMTP_URL y CONTACT_RECIPIENT_EMAIL.
        </p>
      </form>
    </section>
  </UContainer>
</template>

<style scoped>
.contact-page {
  position: relative;
}

.contact-hero {
  border: 1px solid rgba(96, 35, 122, 0.2);
  border-radius: 1.1rem;
  padding: 1.25rem;
  background: linear-gradient(145deg, rgba(251, 242, 255, 0.8), rgba(236, 218, 255, 0.92));
}

.contact-shell {
  border: 1px solid rgba(96, 35, 122, 0.18);
  border-radius: 1.1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
}

.contact-form {
  display: grid;
  gap: 0.95rem;
}

.field-grid {
  display: grid;
  gap: 0.45rem;
}

.field-label {
  font-size: 0.88rem;
  font-weight: 600;
}

.field-input {
  border: 1px solid rgba(96, 35, 122, 0.24);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.82);
  padding: 0.68rem 0.8rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus {
  border-color: var(--brand-700);
  box-shadow: 0 0 0 3px rgba(145, 1, 254, 0.15);
}

.field-textarea {
  resize: vertical;
}

.field-error {
  color: #b42318;
  font-size: 0.81rem;
}

.field-help {
  font-size: 0.78rem;
  opacity: 0.85;
}

.dark .contact-hero,
.dark .contact-shell {
  border-color: color-mix(in srgb, var(--electric-violet-400) 38%, transparent);
  background: color-mix(in srgb, var(--electric-violet-1800) 76%, transparent);
}

.dark .field-input {
  border-color: color-mix(in srgb, var(--electric-violet-300) 44%, transparent);
  background: color-mix(in srgb, var(--electric-violet-1900) 72%, transparent);
  color: var(--electric-violet-100);
}

@media (min-width: 768px) {
  .contact-shell {
    padding: 1.5rem;
  }
}
</style>
