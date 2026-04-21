<script setup lang="ts">
import type { SpotifyMusicPayload } from '../interfaces/api.interface'

type MusicApiResponse = {
  ok: boolean
  data?: SpotifyMusicPayload
}

const { data, pending, error, refresh } = await useAsyncData('spotify-music', () => {
  return $fetch<MusicApiResponse>('/api/music/spotify')
})

const spotifyData = computed(() => {
  if (!data.value || !data.value.ok) {
    return null
  }

  return data.value.data
})

useSeoMeta({
  title: 'Music | Spotify',
  ogTitle: 'Music | Spotify',
  description: 'Top tracks, lanzamientos y playlists conectadas desde Spotify.',
  ogDescription: 'Top tracks, lanzamientos y playlists conectadas desde Spotify.'
})
</script>

<template>
  <UContainer class="py-14">
    <p class="section-label">
      Music
    </p>
    <h1 class="hero-title mt-2">
      Tu universo musical conectado con Spotify
    </h1>
    <p class="hero-description mt-4 max-w-2xl">
      Esta seccion consume un endpoint interno para mostrar top tracks, lanzamientos y playlists publicas.
    </p>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      class="mt-6"
      title="No se pudo cargar Spotify"
      description="Revisa las variables de entorno y vuelve a intentar."
    >
      <template #actions>
        <UButton
          color="error"
          variant="outline"
          label="Reintentar"
          @click="refresh"
        />
      </template>
    </UAlert>

    <UAlert
      v-else-if="spotifyData && !spotifyData.configured"
      color="warning"
      variant="soft"
      class="mt-6"
      title="Falta configurar Spotify"
      description="Define SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET y SPOTIFY_ARTIST_ID para activar esta seccion."
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
      v-if="spotifyData && spotifyData.configured"
      class="mt-10 space-y-12"
    >
      <section>
        <div class="section-heading">
          <p class="section-label">
            Top Tracks
          </p>
          <h2>
            Lo mas escuchado
          </h2>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <UCard
            v-for="track in spotifyData.tracks"
            :key="track.id"
            :ui="{ body: 'p-4', root: 'border border-(--ui-border)' }"
          >
            <div class="flex gap-4">
              <img
                v-if="track.imageUrl"
                :src="track.imageUrl"
                :alt="track.name"
                class="h-16 w-16 rounded-lg object-cover"
              >
              <div class="min-w-0 flex-1">
                <p class="font-semibold truncate">
                  {{ track.name }}
                </p>
                <p class="text-sm text-muted truncate">
                  {{ track.artists.join(', ') }}
                </p>
                <p class="text-xs text-muted mt-1 truncate">
                  {{ track.album }}
                </p>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <UButton
                size="sm"
                color="neutral"
                variant="soft"
                :to="track.externalUrl"
                target="_blank"
                label="Abrir en Spotify"
              />
              <UButton
                v-if="track.previewUrl"
                size="sm"
                color="neutral"
                variant="ghost"
                :to="track.previewUrl"
                target="_blank"
                label="Preview"
              />
            </div>
          </UCard>
        </div>
      </section>

      <section>
        <div class="section-heading">
          <p class="section-label">
            Albums
          </p>
          <h2>
            Nuevos lanzamientos
          </h2>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-3">
          <UCard
            v-for="album in spotifyData.albums"
            :key="album.id"
            :ui="{ body: 'p-4', root: 'border border-(--ui-border)' }"
          >
            <img
              v-if="album.imageUrl"
              :src="album.imageUrl"
              :alt="album.name"
              class="h-40 w-full rounded-lg object-cover"
            >
            <p class="mt-3 font-semibold line-clamp-1">
              {{ album.name }}
            </p>
            <p class="text-sm text-muted line-clamp-1">
              {{ album.artists.join(', ') }}
            </p>
            <p class="text-xs text-muted mt-1">
              {{ album.releaseDate }} · {{ album.totalTracks }} tracks
            </p>
            <UButton
              class="mt-4"
              size="sm"
              color="neutral"
              variant="soft"
              :to="album.externalUrl"
              target="_blank"
              label="Escuchar"
            />
          </UCard>
        </div>
      </section>

      <section>
        <div class="section-heading">
          <p class="section-label">
            Playlists
          </p>
          <h2>
            Selecciones curadas
          </h2>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="playlist in spotifyData.playlists"
            :key="playlist.id"
            :ui="{ body: 'p-4', root: 'border border-(--ui-border)' }"
          >
            <img
              v-if="playlist.imageUrl"
              :src="playlist.imageUrl"
              :alt="playlist.name"
              class="h-36 w-full rounded-lg object-cover"
            >
            <p class="mt-3 font-semibold line-clamp-1">
              {{ playlist.name }}
            </p>
            <p class="text-sm text-muted mt-1 line-clamp-2">
              {{ playlist.description || 'Playlist publica de Spotify.' }}
            </p>
            <UButton
              class="mt-4"
              size="sm"
              color="neutral"
              variant="soft"
              :to="playlist.externalUrl"
              target="_blank"
              label="Abrir playlist"
            />
          </UCard>
        </div>
      </section>
    </div>
  </UContainer>
</template>
