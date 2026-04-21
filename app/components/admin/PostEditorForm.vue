<script setup lang="ts">
export type PostEditorData = {
  titulo: string
  slug: string
  resumen: string
  contenido: string
  imagenPortada: string
  estado: 'borrador' | 'publicado' | 'archivado'
  etiquetasInput: string
}

const props = defineProps<{
  modelValue: PostEditorData
  submitLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PostEditorData]
  submit: []
}>()

const updateField = <K extends keyof PostEditorData>(key: K, value: PostEditorData[K]) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

const onSubmit = () => {
  emit('submit')
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div class="grid gap-4 md:grid-cols-2">
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">Titulo</span>
        <input
          :value="modelValue.titulo"
          class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
          required
          @input="updateField('titulo', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">Slug</span>
        <input
          :value="modelValue.slug"
          class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
          placeholder="se-genera-si-lo-dejas-vacio"
          @input="updateField('slug', ($event.target as HTMLInputElement).value)"
        >
      </label>
    </div>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Resumen</span>
      <textarea
        :value="modelValue.resumen"
        class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2 min-h-24"
        @input="updateField('resumen', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Contenido (Markdown)</span>
      <textarea
        :value="modelValue.contenido"
        class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2 min-h-72"
        required
        @input="updateField('contenido', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <div class="grid gap-4 md:grid-cols-3">
      <label class="flex flex-col gap-1 text-sm md:col-span-2">
        <span class="font-medium">Imagen portada (URL)</span>
        <input
          :value="modelValue.imagenPortada"
          class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
          @input="updateField('imagenPortada', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">Estado</span>
        <select
          :value="modelValue.estado"
          class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
          @change="updateField('estado', ($event.target as HTMLSelectElement).value as PostEditorData['estado'])"
        >
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
          <option value="archivado">Archivado</option>
        </select>
      </label>
    </div>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-medium">Etiquetas (separadas por coma)</span>
      <input
        :value="modelValue.etiquetasInput"
        class="rounded-lg border border-default bg-white/80 dark:bg-black/25 px-3 py-2"
        placeholder="musica, produccion, backstage"
        @input="updateField('etiquetasInput', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <div class="flex justify-end">
      <UButton type="submit" :loading="loading">
        {{ submitLabel || 'Guardar publicacion' }}
      </UButton>
    </div>
  </form>
</template>
