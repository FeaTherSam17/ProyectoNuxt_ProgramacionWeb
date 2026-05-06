<script setup lang="ts">
import { marked } from 'marked'

type PublicPost = {
  id: number
  titulo: string
  slug: string
  resumen: string | null
  contenido: string
  imagen_portada: string | null
  estado: string
  publicado_en: string | null
  creado_en: string
  etiquetas: string[]
}

type AdjacentPost = {
  title: string
  slug: string
  resumen: string | null
  image?: string
  date: string
}

type PublicationPayload = {
  post: PublicPost | null
  prev: AdjacentPost | null
  next: AdjacentPost | null
}

marked.setOptions({
  gfm: true,
  breaks: true
})

const route = useRoute()

const slug = computed(() => {
  const value = route.params.slug
  if (Array.isArray(value)) {
    return value[value.length - 1] || ''
  }
  return String(value || '')
})

const errorMessage = ref('')

const isValidImageUrl = (value: string | null) => {
  if (!value) {
    return false
  }
  return /^https?:\/\//i.test(value)
}

const estimateReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return minutes
}

const toSafeImage = (value: string | null): string | undefined => {
  if (!value) {
    return undefined
  }
  return isValidImageUrl(value) ? value : undefined
}

const { data: publication } = await useAsyncData<PublicationPayload>(`publication-${slug.value}`, async () => {
  if (!slug.value) {
    throw createError({ statusCode: 400, statusMessage: 'Slug invalido' })
  }

  try {
    return await $fetch<PublicationPayload>(`/api/publicaciones/${slug.value}`)
  } catch (error) {
    console.error('Error cargando publicacion publica:', error)
    errorMessage.value = 'No se pudo cargar la publicación.'
    throw createError({ statusCode: 404, statusMessage: 'Publicacion no encontrada' })
  }
})

const publicationPost = computed(() => publication.value?.post || null)
const renderedContent = computed(() => {
  if (!publicationPost.value?.contenido) {
    return ''
  }
  return marked(publicationPost.value.contenido)
})

const displayPost = computed(() => {
  if (!publicationPost.value) {
    return null
  }

  const image = toSafeImage(publicationPost.value.imagen_portada)
  return {
    title: publicationPost.value.titulo,
    description: publicationPost.value.resumen || '',
    image,
    date: publicationPost.value.publicado_en || publicationPost.value.creado_en,
    content: publicationPost.value.contenido || '',
    etiquetas: publicationPost.value.etiquetas || [],
    minRead: estimateReadTime(publicationPost.value.contenido || '')
  }
})

const adjacentPosts = computed(() => {
  return {
    prev: publication.value?.prev || null,
    next: publication.value?.next || null
  }
})

const title = computed(() => displayPost.value?.title)
const description = computed(() => displayPost.value?.description)

useSeoMeta({
  title: title.value,
  description: description.value,
  ogDescription: description.value,
  ogTitle: title.value
})

const articleLink = computed(() => useRequestURL().href)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <div v-if="displayPost">
        <ULink
          to="/blog"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Blog
        </ULink>
        <div
          v-if="errorMessage"
          class="mt-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300"
        >
          {{ errorMessage }}
        </div>
        <div class="flex flex-col gap-3 mt-8">
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="displayPost.date">
              {{ formatDate(displayPost.date) }}
            </span>
            <span v-if="displayPost.date && displayPost.minRead">
              -
            </span>
            <span v-if="displayPost.minRead">
              {{ displayPost.minRead }} MIN READ
            </span>
          </div>
          <img
            v-if="displayPost.image"
            :src="displayPost.image"
            :alt="displayPost.title"
            class="rounded-lg w-full h-[300px] object-cover object-center"
          >
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ displayPost.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ displayPost.description }}
          </p>
          <img
            src="/brand/logo_transparent.png"
            alt="Logo"
            class="mx-auto mt-2 h-10 w-10 opacity-60"
          >
          <div
            v-if="displayPost.etiquetas && displayPost.etiquetas.length"
            class="flex flex-wrap items-center justify-center gap-2 text-xs text-muted"
          >
            <span class="font-medium text-foreground">Etiquetas:</span>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in displayPost.etiquetas"
                :key="tag"
                color="neutral"
                variant="subtle"
                size="xs"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </div>
        <UPageBody class="max-w-3xl mx-auto">
          <div
            class="markdown-body"
            v-html="renderedContent"
          />

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copy link"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
          </div>
        </UPageBody>
        <div class="mt-10 border-t border-default pt-6 relative">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Seguir explorando</h3>
          </div>
          <UButton
            v-if="adjacentPosts?.prev"
            :to="`/blog/${adjacentPosts.prev.slug}`"
            icon="lucide:chevron-left"
            size="sm"
            color="neutral"
            variant="outline"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
          />
          <UButton
            v-if="adjacentPosts?.next"
            :to="`/blog/${adjacentPosts.next.slug}`"
            icon="lucide:chevron-right"
            size="sm"
            color="neutral"
            variant="outline"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full"
          />
          <div class="grid gap-4 md:grid-cols-2">
            <ULink
              v-if="adjacentPosts?.prev"
              :to="`/blog/${adjacentPosts.prev.slug}`"
              class="block rounded-xl border border-default bg-white/70 dark:bg-black/20 p-4 transition hover:shadow-md"
            >
              <p class="text-xs text-muted">Anterior</p>
              <img
                v-if="adjacentPosts.prev.image"
                :src="adjacentPosts.prev.image"
                :alt="adjacentPosts.prev.title"
                class="mt-2 h-28 w-full rounded-lg object-cover"
              >
              <div class="mt-2 text-base font-medium">
                {{ adjacentPosts.prev.title }}
              </div>
              <p class="text-sm text-muted mt-1">{{ adjacentPosts.prev.resumen }}</p>
            </ULink>
            <ULink
              v-if="adjacentPosts?.next"
              :to="`/blog/${adjacentPosts.next.slug}`"
              class="block rounded-xl border border-default bg-white/70 dark:bg-black/20 p-4 transition hover:shadow-md"
            >
              <p class="text-xs text-muted">Siguiente</p>
              <img
                v-if="adjacentPosts.next.image"
                :src="adjacentPosts.next.image"
                :alt="adjacentPosts.next.title"
                class="mt-2 h-28 w-full rounded-lg object-cover"
              >
              <div class="mt-2 text-base font-medium">
                {{ adjacentPosts.next.title }}
              </div>
              <p class="text-sm text-muted mt-1">{{ adjacentPosts.next.resumen }}</p>
            </ULink>
          </div>
        </div>
      </div>
    </UContainer>
  </UMain>
</template>

<style>
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
}
.markdown-body th,
.markdown-body td {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}
.markdown-body img {
  max-width: 100%;
  height: auto;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 1.2em;
  margin-bottom: 0.6em;
}
.markdown-body p {
  margin: 0.6em 0;
}

/* Enhanced markdown styling for readability on dark background */
.markdown-body {
  color: #e6e6e6;
  font-size: 15px;
  line-height: 1.7;
}
.markdown-body h1 { font-size: 2rem; font-weight: 700; margin: 0.6em 0; }
.markdown-body h2 { font-size: 1.6rem; font-weight: 700; margin: 0.5em 0; }
.markdown-body h3 { font-size: 1.25rem; font-weight: 700; margin: 0.5em 0; }
.markdown-body h4 { font-size: 1.05rem; font-weight: 600; margin: 0.4em 0; }
.markdown-body h5 { font-size: 1rem; font-weight: 600; margin: 0.35em 0; }
.markdown-body h6 { font-size: 0.95rem; font-weight: 600; margin: 0.3em 0; }

.markdown-body a { color: #8ec4ff; text-decoration: underline; }
.markdown-body strong { font-weight: 700; }
.markdown-body em { font-style: italic; }

.markdown-body ul,
.markdown-body ol {
  margin: 0.6em 0 0.6em 1.25rem;
}
.markdown-body li { margin: 0.25em 0; }

.markdown-body pre,
.markdown-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
}
.markdown-body pre {
  background: rgba(0,0,0,0.25);
  padding: 12px;
  border-radius: 8px;
  overflow: auto;
  margin: 0.75em 0;
}
.markdown-body code {
  background: rgba(0,0,0,0.18);
  padding: 2px 6px;
  border-radius: 6px;
}

.markdown-body blockquote {
  border-left: 3px solid rgba(255,255,255,0.08);
  padding-left: 12px;
  margin: 0.6em 0;
  color: #cfcfcf;
}

.markdown-body table { background: transparent; }
.markdown-body th, .markdown-body td { border-color: rgba(255,255,255,0.12); }

.markdown-body img { display: block; margin: 0.6em auto; }

/* make sure headings are visually distinct from small caption text */
.markdown-body .caption,
.markdown-body .muted { font-size: 0.85rem; color: rgba(230,230,230,0.7); }
</style>