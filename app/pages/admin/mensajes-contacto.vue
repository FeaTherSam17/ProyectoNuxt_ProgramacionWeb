<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

type MensajeContacto = {
  id: number
  nombre: string
  correo: string
  asunto: string
  mensaje: string
  creado_en: string
}

const { data, status, refresh } = await useFetch<{ ok: boolean, data: MensajeContacto[] }>('/api/admin/mensajes-contacto')

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

const formatDate = (value: string) => {
  return new Date(value).toLocaleString('es-MX')
}

const previewMessage = (value: string) => {
  return value.length > 140 ? `${value.slice(0, 140)}...` : value
}

useSeoMeta({
  title: 'Admin Mensajes de Contacto',
  description: 'Listado de mensajes enviados desde el formulario de contacto.'
})
</script>

<template>
  <UContainer class="pt-24 pb-14">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-[var(--brand-700)] font-semibold">Panel Admin</p>
        <h1 class="mt-2 text-3xl font-semibold">Mensajes de contacto</h1>
        <p class="mt-2 text-sm text-muted">Revisa los envíos guardados desde el formulario público.</p>
      </div>

      <div class="flex gap-2">
        <UButton to="/admin/publicaciones" color="neutral" variant="outline" icon="i-lucide-file-text">Publicaciones</UButton>
        <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" @click="refresh">Actualizar</UButton>
        <UButton color="neutral" variant="outline" icon="i-lucide-log-out" @click="logout">Cerrar sesion</UButton>
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-default overflow-hidden bg-white/70 dark:bg-black/20">
      <table class="w-full text-sm">
        <thead class="bg-black/5 dark:bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Nombre</th>
            <th class="px-3 py-2">Correo</th>
            <th class="px-3 py-2">Asunto</th>
            <th class="px-3 py-2">Mensaje</th>
            <th class="px-3 py-2">Creado</th>
          </tr>
        </thead>
        <tbody v-if="status !== 'pending'">
          <tr v-for="message in data?.data || []" :key="message.id" class="border-t border-default/50 align-top">
            <td class="px-3 py-3 font-medium">{{ message.nombre }}</td>
            <td class="px-3 py-3">
              <a class="text-[var(--brand-700)] hover:underline" :href="`mailto:${message.correo}`">{{ message.correo }}</a>
            </td>
            <td class="px-3 py-3">{{ message.asunto }}</td>
            <td class="px-3 py-3 max-w-[28rem]">
              <p class="whitespace-pre-wrap text-muted">{{ previewMessage(message.mensaje) }}</p>
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-muted">{{ formatDate(message.creado_en) }}</td>
          </tr>

          <tr v-if="(data?.data || []).length === 0">
            <td colspan="5" class="px-3 py-5 text-center text-muted">No hay mensajes guardados todavía.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UContainer>
</template>