<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter
    class="z-10 bg-transparent border-t border-[rgba(96,35,122,0.2)] mt-10"
    :ui="{ left: 'text-[rgba(81,13,99,0.85)] dark:text-[rgba(228,216,255,0.95)] text-xs font-medium' }"
  >
    <template #left>
      <div class="brand-footer-left">
        <NuxtImg
          src="/brand/vf-logo.png"
          alt="VF Logo"
          width="28"
          height="28"
          class="brand-logo brand-logo--footer"
        />
        <span>{{ footer.credits }}</span>
      </div>
    </template>

    <template #right>
      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
