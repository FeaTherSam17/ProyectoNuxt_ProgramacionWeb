<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <div class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10">
    <div class="brand-header-shell">
      <NuxtImg
        src="/brand/vf-logo.png"
        alt="VF Logo"
        width="44"
        height="44"
        class="brand-logo brand-logo--header"
      />

    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-white/70 dark:bg-[rgba(39,7,48,0.72)] backdrop-blur-md rounded-full px-2 sm:px-4 border border-[rgba(96,35,122,0.24)] dark:border-[rgba(228,95,255,0.35)] shadow-lg shadow-[rgba(81,13,99,0.14)] dark:shadow-[rgba(0,0,0,0.45)]"
      :ui="{
        link: 'px-2 py-1 text-[rgba(81,13,99,0.95)] dark:text-[rgba(246,217,255,0.96)] font-semibold hover:text-[rgba(96,35,122,1)] dark:hover:text-[rgba(228,95,255,1)]',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
    </div>
  </div>
</template>
