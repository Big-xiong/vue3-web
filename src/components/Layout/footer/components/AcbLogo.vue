<template>
  <p class="acb-logo"><a href="https://acb.bet" target="_blank"><img
        :src="$getSrc(`/src/assets/images/footer/acb-logo${$attrs.dark !== undefined ? '-dark' : ''}.png`)" /></a>
  </p>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.acb-logo {
  margin: 0;
  padding: 0 0 20px;
  display: var(--footer-acb-logo-display);

  img {
    height: 30px;
  }
}
</style>
