<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

type Publicacion = {
  id: number
  titulo: string
  slug: string
  resumen: string | null
  estado: 'borrador' | 'publicado' | 'archivado'
  publicado_en: string | null
  etiquetas: string[]
}

const search = ref('')
const estado = ref('')

const { data, status, refresh } = await useFetch<{ ok: boolean, data: Publicacion[] }>('/api/admin/publicaciones', {
  query: computed(() => ({
    search: search.value || undefined,
    estado: estado.value || undefined
  }))
})

const deletingId = ref<number | null>(null)

const removePost = async (id: number) => {
  if (!confirm('Quieres eliminar esta publicacion?')) {
    return
  }

  deletingId.value = id

  try {
    await $fetch(`/api/admin/publicaciones/${id}`, {
      method: 'DELETE'
    })

    await refresh()
  } finally {
    deletingId.value = null
  }
}

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

useSeoMeta({
  title: 'Admin Publicaciones',
  description: 'Gestion administrativa de publicaciones del blog.'
})
</script>

<template>
  <UContainer class="pt-24 pb-14">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.18em] text-[var(--brand-700)] font-semibold">Panel Admin</p>
        <h1 class="mt-2 text-3xl font-semibold">Publicaciones</h1>
      </div>

      <div class="flex gap-2">
        <UButton to="/admin/publicaciones/nueva" icon="i-lucide-plus">Nueva</UButton>
        <UButton color="neutral" variant="outline" icon="i-lucide-log-out" @click="logout">Cerrar sesion</UButton>
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-default bg-white/75 dark:bg-black/20 p-4 grid gap-3 md:grid-cols-3">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por titulo o slug"
        class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
      >
      <select
        v-model="estado"
        class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
      >
        <option value="">Todos los estados</option>
        <option value="borrador">Borrador</option>
        <option value="publicado">Publicado</option>
        <option value="archivado">Archivado</option>
      </select>
      <UButton color="neutral" variant="outline" @click="() => refresh()">Actualizar</UButton>
    </div>

    <div class="mt-5 rounded-xl border border-default overflow-hidden bg-white/70 dark:bg-black/20">
      <table class="w-full text-sm">
        <thead class="bg-black/5 dark:bg-white/5 text-left">
          <tr>
            <th class="px-3 py-2">Titulo</th>
            <th class="px-3 py-2">Estado</th>
            <th class="px-3 py-2">Etiquetas</th>
            <th class="px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="status !== 'pending'">
          <tr v-for="post in data?.data || []" :key="post.id" class="border-t border-default/50">
            <td class="px-3 py-3">
              <p class="font-medium">{{ post.titulo }}</p>
              <p class="text-xs text-muted">/{{ post.slug }}</p>
            </td>
            <td class="px-3 py-3">
              <span class="px-2 py-1 rounded-full border border-default text-xs uppercase">{{ post.estado }}</span>
            </td>
            <td class="px-3 py-3">
              <span class="text-xs text-muted">{{ post.etiquetas.join(', ') || 'Sin etiquetas' }}</span>
            </td>
            <td class="px-3 py-3">
              <div class="flex flex-wrap gap-2">
                <UButton :to="`/admin/publicaciones/${post.id}`" size="xs" variant="outline">Editar</UButton>
                <UButton
                  size="xs"
                  color="error"
                  variant="outline"
                  :loading="deletingId === post.id"
                  @click="removePost(post.id)"
                >
                  Eliminar
                </UButton>
              </div>
            </td>
          </tr>

          <tr v-if="(data?.data || []).length === 0">
            <td colspan="4" class="px-3 py-5 text-center text-muted">No hay publicaciones para mostrar.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UContainer>
</template>
