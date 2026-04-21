<script setup lang="ts">
import type { PostEditorData } from '../../../components/admin/PostEditorForm.vue'

definePageMeta({ middleware: ['admin'] })

const route = useRoute()
const id = computed(() => Number(route.params.id))

type PublicacionDetalle = {
  id: number
  titulo: string
  slug: string
  resumen: string | null
  contenido: string
  imagen_portada: string | null
  estado: 'borrador' | 'publicado' | 'archivado'
  etiquetas: string[]
}

const { data, status } = await useFetch<{ ok: boolean, data: PublicacionDetalle }>(`/api/admin/publicaciones/${id.value}`)

const form = ref<PostEditorData>({
  titulo: '',
  slug: '',
  resumen: '',
  contenido: '',
  imagenPortada: '',
  estado: 'borrador',
  etiquetasInput: ''
})

watchEffect(() => {
  const post = data.value?.data

  if (!post) {
    return
  }

  form.value = {
    titulo: post.titulo || '',
    slug: post.slug || '',
    resumen: post.resumen || '',
    contenido: post.contenido || '',
    imagenPortada: post.imagen_portada || '',
    estado: post.estado || 'borrador',
    etiquetasInput: (post.etiquetas || []).join(', ')
  }
})

const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

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
  successMessage.value = ''

  try {
    await $fetch(`/api/admin/publicaciones/${id.value}`, {
      method: 'PUT',
      body: toPayload()
    })

    successMessage.value = 'Publicacion actualizada correctamente.'
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'No se pudo actualizar la publicacion.'
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: 'Editar Publicacion',
  description: 'Edita una publicacion del blog.'
})
</script>

<template>
  <UContainer class="pt-24 pb-14 max-w-4xl">
    <div class="flex items-center justify-between gap-2">
      <h1 class="text-3xl font-semibold">Editar publicacion</h1>
      <UButton to="/admin/publicaciones" color="neutral" variant="outline">Volver</UButton>
    </div>

    <div v-if="status === 'pending'" class="mt-6 text-sm text-muted">Cargando publicacion...</div>

    <div v-else class="mt-6 rounded-xl border border-default bg-white/75 dark:bg-black/20 p-5">
      <div v-if="errorMessage" class="mb-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
        {{ successMessage }}
      </div>

      <AdminPostEditorForm
        v-model="form"
        submit-label="Guardar cambios"
        :loading="saving"
        @submit="onSave"
      />
    </div>
  </UContainer>
</template>
