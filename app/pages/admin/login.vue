<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

const route = useRoute()

const errorsMap: Record<string, string> = {
  oauth_state: 'La validacion OAuth fallo. Intenta iniciar sesion de nuevo.',
  oauth_token: 'No se pudo completar el intercambio de token con Google.',
  oauth_author: 'No se pudo crear o actualizar el autor en base de datos.',
  not_allowed: 'Tu correo no esta autorizado para acceder al panel.'
}

const errorKey = computed(() => String(route.query.error || ''))
const errorMessage = computed(() => errorsMap[errorKey.value] || '')

useSeoMeta({
  title: 'Admin Login',
  description: 'Acceso administrativo con Google OAuth.'
})
</script>

<template>
  <UContainer class="pt-28 pb-16 min-h-[75vh]">
    <div class="max-w-xl mx-auto rounded-2xl border border-default bg-white/80 dark:bg-black/25 backdrop-blur-sm p-8">
      <p class="text-xs uppercase tracking-[0.18em] text-[var(--brand-700)] font-semibold">
        Acceso Privado
      </p>
      <h1 class="mt-3 text-3xl font-semibold">
        Iniciar sesion para gestionar publicaciones
      </h1>
      <p class="mt-3 text-sm text-muted">
        Este panel acepta unicamente cuentas Google en lista blanca.
      </p>

      <div v-if="errorMessage" class="mt-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
        {{ errorMessage }}
      </div>

      <div class="mt-6">
        <UButton
          to="/api/auth/google"
          external
          icon="i-simple-icons-google"
          size="xl"
          class="w-full justify-center"
        >
          Continuar con Google
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
