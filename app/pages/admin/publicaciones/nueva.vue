<script setup lang="ts">
import type { PostEditorData } from '../../../components/admin/PostEditorForm.vue'

definePageMeta({ middleware: ['admin'] })

const form = ref<PostEditorData>({
  titulo: '',
  slug: '',
  resumen: '',
  contenido: '',
  imagenPortada: '',
  estado: 'borrador',
  etiquetasInput: ''
})

const saving = ref(false)
const errorMessage = ref('')

const toPayload = () => ({
  titulo: form.value.titulo,
  slug: form.value.slug,
  resumen: form.value.resumen,
  contenido: form.value.contenido,
  imagenPortada: form.value.imagenPortada,
  estado: form.value.estado,
  etiquetas: form.value.etiquetasInput.split(',').map(tag => tag.trim()).filter(Boolean)
})

const onSave = async () => {
  saving.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<{ ok: boolean, data: { id: number } }>('/api/admin/publicaciones', {
      method: 'POST',
      body: toPayload()
    })

    await navigateTo(`/admin/publicaciones/${response.data.id}`)
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'No se pudo guardar la publicacion.'
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: 'Nueva Publicacion',
  description: 'Crea una nueva publicacion del blog.'
})
</script>

<template>
  <UContainer class="pt-24 pb-14 max-w-4xl">
    <div class="flex items-center justify-between gap-2">
      <h1 class="text-3xl font-semibold">Nueva publicacion</h1>
      <UButton to="/admin/publicaciones" color="neutral" variant="outline">Volver</UButton>
    </div>

    <div class="mt-6 rounded-xl border border-default bg-white/75 dark:bg-black/20 p-5">
      <div v-if="errorMessage" class="mb-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
        {{ errorMessage }}
      </div>

      <AdminPostEditorForm
        v-model="form"
        submit-label="Crear publicacion"
        :loading="saving"
        @submit="onSave"
      />
    </div>
  </UContainer>
</template>
