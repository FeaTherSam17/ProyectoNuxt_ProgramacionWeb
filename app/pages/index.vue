<script setup lang="ts">
useSeoMeta({
  title: 'Inicio',
  ogTitle: 'Inicio',
  description: 'Plataforma para fans con musica, blog, contenido en YouTube y contacto directo.',
  ogDescription: 'Plataforma para fans con musica, blog, contenido en YouTube y contacto directo.'
})

const highlights = [
  {
    title: 'Music',
    description: 'Top tracks, albums y playlists en una sola vista para descubrir y compartir.'
  },
  {
    title: 'Blog',
    description: 'Feed de publicaciones con formato editorial y lectura optimizada.'
  },
  {
    title: 'YouTube',
    description: 'Video destacado y lista de contenido reciente para mantener activa la comunidad.'
  }
]

const process = [
  {
    step: '01',
    title: 'Home como Hub Central',
    text: 'La pagina principal conecta en un solo flujo los modulos de Music, Blog, YouTube y Contacto.'
  },
  {
    step: '02',
    title: 'Experiencia Fan-First',
    text: 'La arquitectura prioriza descubrimiento de contenido, consumo rapido y navegacion clara desde cualquier dispositivo.'
  },
  {
    step: '03',
    title: 'Escalable a Admin',
    text: 'La base publica queda preparada para integrar panel administrativo y gestion de publicaciones sin romper UX.'
  }
]
</script>

<template>
  <div class="home-page">
    <section class="hero-shell">
      <div class="hero-bg-glow" />

      <UContainer class="hero-grid">
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
            Un espacio digital para fans: musica, historias, videos y contacto en una sola experiencia.
          </h1>
          <p class="hero-description">
            Esta homepage funciona como punto de entrada al ecosistema del proyecto,
            organizando el contenido por modulos para facilitar descubrimiento y retencion.
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
            Experiencia Publica
          </p>
          <h2 class="panel-title">
            Navegacion clara, contenido conectado
          </h2>

          <ul class="panel-list">
            <li>
              <span class="panel-dot" />
              Rutas principales para fans: Home, Music, Blog, YouTube y Contacto
            </li>
            <li>
              <span class="panel-dot" />
              Contenido organizado por modulos para crecer sin desorden
            </li>
            <li>
              <span class="panel-dot" />
              Base lista para habilitar panel admin de publicaciones
            </li>
          </ul>
        </Motion>
      </UContainer>
    </section>

    <section class="section-brand-elements">
      <UContainer>
        <div class="brand-elements-shell">
          <div class="brand-elements-header">
            <p class="section-label">
              Identidad Visual
            </p>
            <h2>
              Elementos representativos de la marca
            </h2>
          </div>

          <div class="brand-elements-grid">
            <article class="brand-element-card">
              <NuxtImg
                src="/brand/vf-logo.png"
                alt="VF Logo Icon"
                width="52"
                height="52"
                class="brand-logo"
              />
              <h3>Sello Principal</h3>
              <p>Aplicado en encabezado, portada y puntos clave para reforzar reconocimiento visual.</p>
            </article>

            <article class="brand-element-card">
              <NuxtImg
                src="/brand/vf-logo.png"
                alt="VF Logo Signature"
                width="52"
                height="52"
                class="brand-logo"
              />
              <h3>Firma de Seccion</h3>
              <p>Usado como acento en tarjetas y bloques destacados dentro de la experiencia publica.</p>
            </article>

            <article class="brand-element-card">
              <NuxtImg
                src="/brand/vf-logo.png"
                alt="VF Logo Footer"
                width="52"
                height="52"
                class="brand-logo"
              />
              <h3>Presencia Persistente</h3>
              <p>Integrado en footer para mantener continuidad de marca a lo largo de toda la navegacion.</p>
            </article>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="section-highlights">
      <UContainer>
        <div class="section-heading">
          <p class="section-label">
            Modulos del Sitio
          </p>
          <h2>
            Pilares de la experiencia publica
          </h2>
        </div>

        <div class="highlight-grid">
          <Motion
            v-for="(item, index) in highlights"
            :key="item.title"
            :initial="{ opacity: 0, y: 25 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.45, delay: 0.08 * index }"
            class="highlight-card"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </Motion>
        </div>
      </UContainer>
    </section>

    <section class="section-process">
      <UContainer>
        <div class="section-heading">
          <p class="section-label">
            Enfoque Funcional
          </p>
          <h2>
            Arquitectura pensada para escalar
          </h2>
        </div>

        <div class="process-stack">
          <Motion
            v-for="(item, index) in process"
            :key="item.step"
            class="process-item"
            :initial="{ opacity: 0, x: -22 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.45, delay: 0.07 * index }"
          >
            <span class="process-step">{{ item.step }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </Motion>
        </div>
      </UContainer>
    </section>
  </div>
</template>
