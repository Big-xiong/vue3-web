<template>
  <teleport :to="props.to" v-if='show'>
    <slot />
  </teleport>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    default: 'body'
  }
})

const show = computed(() => document.querySelector(props.to))
</script>
