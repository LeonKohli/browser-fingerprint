<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
defineOgImageComponent('NuxtSeo', {
  title: 'Browser Fingerprint',
  description: 'Generate and analyze your unique browser fingerprint. Understand how websites can track you.',
  siteLogo: '/fingerprint.png',
  siteName: 'Browser Fingerprint',
  icon: 'mdi-fingerprint',
  colorMode: 'dark',
})
</script>