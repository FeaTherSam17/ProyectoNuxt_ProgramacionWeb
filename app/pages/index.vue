<script setup lang="ts">
useSeoMeta({
  title: 'Inicio',
  ogTitle: 'Inicio',
  description: 'Plataforma oficial de ViFeather. Música, historias y frecuencias profundas.',
  ogDescription: 'Plataforma oficial de ViFeather. Música, historias y frecuencias profundas.'
})

const lore = [
  {
    title: 'La Esencia',
    description: 'ViFeather habita en el espectro entre lo etéreo y lo industrial. Un ente que se manifiesta en la colisión de texturas melódicas y sombras profundas, definiendo un espacio donde la melancolía encuentra su propia frecuencia.'
  },
  {
    title: 'Arquitectura Compartida',
    description: 'Este sonido se construyó sobre cimientos que nacieron en la infancia. Es el resultado de un diálogo creativo de años; una estructura técnica y emocional que hoy se sostiene sobre el eco de lo que alguna vez fue un camino de dos.'
  },
  {
    title: 'Legado en la Sombra',
    description: 'Inspirado por la influencia de ERAVFT, el proyecto rescata visiones que quedaron suspendidas en el tiempo. Es la continuación de una narrativa que se niega a desaparecer, transformando el silencio de otros en nuevas formas de energía.'
  }
]
</script>

<template>
  <div class="home-page px-4 md:px-8">
    
    <section class="hero-shell">
      <div class="hero-bg-glow" />

      <UContainer class="hero-grid items-center">
        <Motion
          class="hero-copy"
          :initial="{ opacity: 0, y: 28 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.55 }"
        >
          <NuxtImg
            src="/brand/vf-logo.png"
            alt="VF Logo"
            width="120"
            height="120"
            class="brand-logo brand-logo--hero"
          />

          <p class="hero-kicker">
            Music | Blog | YouTube | Contacto
          </p>
          
          <h1 class="hero-title">
            Frecuencias nacidas en la penumbra: donde el ruido se transforma en nostalgia.
          </h1>
          
          <p class="hero-description">
            Casi cinco años de evolución sonora atrapados entre la euforia del colour bass y el frío del dark ambient. Este espacio resguarda las historias y los ecos de un trayecto creativo que se niega a desvanecerse en el silencio.
          </p>

          <div class="hero-actions">
            <UButton
              size="xl"
              to="/music"
              label="Explorar Music"
              class="hero-primary-btn"
            />
            <UButton
              size="xl"
              variant="outline"
              to="/youtube"
              label="Ver YouTube"
              class="hero-secondary-btn"
            />
          </div>
        </Motion>

        <Motion
          class="hero-panel"
          :initial="{ opacity: 0, y: 30, scale: 0.98 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: 0.55, delay: 0.12 }"
        >
          <p class="panel-overline">
            Experiencia Pública
          </p>
          <h2 class="panel-title">
            Navegación clara, contenido conectado
          </h2>

          <ul class="panel-list">
            <li>
              <span class="panel-dot" />
              Rutas principales para fans: Home, Music, Blog, YouTube y Contacto
            </li>
            <li>
              <span class="panel-dot" />
              Contenido organizado por módulos para crecer sin desorden
            </li>
            <li>
              <span class="panel-dot" />
              Base lista para habilitar panel admin de publicaciones
            </li>
          </ul>
        </Motion>
      </UContainer>
    </section>

    <section class="py-12 border-t border-white/5">
      <UContainer class="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        
        <div class="space-y-2">
          <p class="section-label">El Universo</p>
          <h2 class="text-3xl md:text-4xl font-serif tracking-tight uppercase">Más allá de la superficie</h2>
        </div>

        <div class="md:col-span-2 space-y-8">
          <div 
            v-for="(item, index) in lore" 
            :key="item.title"
            class="space-y-2"
          >
            <Motion
              :initial="{ opacity: 0, x: 25 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.45, delay: 0.08 * index }"
            >
              <h3 class="text-xl font-serif text-purple-400 font-semibold">{{ item.title }}</h3>
              <p class="text-white/80 leading-relaxed text-base md:text-lg">{{ item.description }}</p>
            </Motion>
          </div>
        </div>

      </UContainer>
    </section>

    <section class="py-12 border-t border-white/5">
      <UContainer class="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        
        <div class="md:col-span-2 space-y-6">
          <div>
            <p class="section-label">Identidad Visual</p>
            <h2 class="text-3xl font-serif uppercase tracking-tight">Elementos de la marca</h2>
          </div>
          
          <div class="space-y-4">
            <article class="flex gap-4 items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <NuxtImg src="/brand/vf-logo.png" alt="VF Logo" width="48" height="48" class="brand-logo shrink-0" />
              <div>
                <h3 class="font-serif text-lg font-medium">Sello Principal</h3>
                <p class="text-sm text-white/70">Reconocimiento visual aplicado en portadas y puntos clave.</p>
              </div>
            </article>

            <article class="flex gap-4 items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <NuxtImg src="/brand/vf-logo.png" alt="VF Logo" width="48" height="48" class="brand-logo shrink-0" />
              <div>
                <h3>Firma de Sección</h3>
                <p class="text-sm text-white/70">Acento visual e iconografía integrado en el ecosistema.</p>
              </div>
            </article>
          </div>
        </div>

        <div class="md:col-span-3 w-full">
          <Motion
            :initial="{ opacity: 0, scale: 0.98 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.6 }"
            class="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/30 shadow-2xl border border-white/10"
          >
            <NuxtImg 
              src="/brand/character-visual.png" 
              alt="Visual Aesthetic Display" 
              class="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </Motion>
        </div>

      </UContainer>
    </section>

  </div>
</template>

<style scoped>
/* Completamente limpio para heredar tus fuentes Cinzel/Playfair y colores de Kigen */
</style>