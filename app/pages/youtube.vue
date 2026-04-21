<script setup lang="ts">
import type { YoutubePayload } from '../interfaces/api.interface'

type YoutubeApiResponse = {
  ok: boolean
  data?: YoutubePayload
}

const { data, pending, error, refresh } = await useAsyncData('youtube-videos', () => {
  return $fetch<YoutubeApiResponse>('/api/youtube/videos')
})

const retryFetch = () => {
  return refresh()
}

const formatPublishedDate = (value: string) => {
  if (!value) {
    return 'Fecha no disponible'
  }

  return new Date(value).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const youtubeData = computed(() => {
  if (!data.value || !data.value.ok) {
    return null
  }

  return data.value.data
})

useSeoMeta({
  title: 'YouTube | Videos recientes',
  ogTitle: 'YouTube | Videos recientes',
  description: 'Video destacado y listado de contenido reciente sincronizado desde YouTube.',
  ogDescription: 'Video destacado y listado de contenido reciente sincronizado desde YouTube.'
})
</script>

<template>
  <UContainer class="py-14">
    <p class="section-label">
      YouTube
    </p>
    <h1 class="hero-title mt-2">
      Videos recientes y contenido destacado
    </h1>
    <p class="hero-description mt-4 max-w-2xl">
      Esta seccion consume YouTube Data API mediante un endpoint interno para mostrar contenido del canal oficial.
    </p>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      class="mt-6"
      title="No se pudo cargar YouTube"
      description="Revisa YOUTUBE_API_KEY y YOUTUBE_CHANNEL_ID en variables de entorno y vuelve a intentar."
    >
      <template #actions>
        <UButton
          color="error"
          variant="outline"
          label="Reintentar"
          @click="retryFetch"
        />
      </template>
    </UAlert>

    <UAlert
      v-else-if="youtubeData && !youtubeData.configured"
      color="warning"
      variant="soft"
      class="mt-6"
      title="Falta configurar YouTube"
      description="Define YOUTUBE_API_KEY y YOUTUBE_CHANNEL_ID para activar esta seccion."
    />

    <div
      v-else-if="pending"
      class="mt-8 grid gap-4 md:grid-cols-3"
    >
      <USkeleton
        v-for="item in 6"
        :key="item"
        class="h-32 rounded-xl"
      />
    </div>

    <div
      v-if="youtubeData && youtubeData.configured"
      class="mt-10 space-y-12"
    >
      <section v-if="youtubeData.featuredVideo">
        <div class="section-heading">
          <p class="section-label">
            Destacado
          </p>
          <h2>
            {{ youtubeData.channelTitle || 'Ultimo video publicado' }}
          </h2>
        </div>

        <UCard
          class="mt-5"
          :ui="{ body: 'p-4 md:p-6', root: 'border border-(--ui-border)' }"
        >
          <div class="grid gap-6 lg:grid-cols-2">
            <div class="aspect-video overflow-hidden rounded-xl bg-black/5">
              <iframe
                class="h-full w-full"
                :src="youtubeData.featuredVideo.embedUrl"
                :title="youtubeData.featuredVideo.title"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>

            <div class="space-y-3">
              <p class="text-sm text-muted">
                {{ formatPublishedDate(youtubeData.featuredVideo.publishedAt) }}
              </p>
              <h3 class="text-xl font-semibold leading-tight">
                {{ youtubeData.featuredVideo.title }}
              </h3>
              <p class="text-sm text-muted line-clamp-5">
                {{ youtubeData.featuredVideo.description || 'Sin descripcion disponible.' }}
              </p>
              <UButton
                color="neutral"
                variant="soft"
                :to="youtubeData.featuredVideo.videoUrl"
                target="_blank"
                label="Ver en YouTube"
              />
            </div>
          </div>
        </UCard>
      </section>

      <section v-if="youtubeData.videos.length">
        <div class="section-heading">
          <p class="section-label">
            Recientes
          </p>
          <h2>
            Mas videos del canal
          </h2>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="video in youtubeData.videos"
            :key="video.id"
            :ui="{ body: 'p-0', root: 'group overflow-hidden border border-(--ui-border) bg-elevated/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl' }"
          >
            <a
              :href="video.videoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block"
            >
              <div class="relative aspect-video overflow-hidden bg-black/5">
                <img
                  v-if="video.thumbnailUrl"
                  :src="video.thumbnailUrl"
                  :alt="video.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                >
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
                  <div class="flex items-center justify-between">
                    <span class="rounded-md bg-black/75 px-2 py-1 text-xs font-medium text-white">
                      {{ video.durationLabel }}
                    </span>
                    <span class="rounded-md bg-red-600/90 px-2 py-1 text-xs font-semibold text-white">
                      YouTube
                    </span>
                  </div>
                </div>
              </div>

              <div class="space-y-2 p-4">
                <p class="text-xs uppercase tracking-wide text-muted">
                  {{ formatPublishedDate(video.publishedAt) }}
                </p>
                <p class="line-clamp-2 font-semibold leading-snug">
                  {{ video.title }}
                </p>
                <p class="line-clamp-3 text-sm text-muted">
                  {{ video.description || 'Sin descripcion disponible.' }}
                </p>
              </div>
            </a>
          </UCard>
        </div>
      </section>
    </div>
  </UContainer>
</template>
