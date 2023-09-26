<template>
  <div v-for="item in list" :key="item" :class="`chip-wrap ${active === item ? 'active' : ''}`"
    @click="onSelected(item)">
    <img :src="$getSrc(`/src/assets/images/deposit/${getChipClassName(item)}@2x.png`)" />
    <span>{{ item }}</span>
  </div>
</template>

<script setup>
import {
  ref, defineExpose,
} from 'vue';

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const active = ref(null);

const emit = defineEmits(['selected']);

function reset() {
  active.value = null;
}

function onSelected(amount) {
  active.value = amount;
  emit('selected', amount);
}

function getChipClassName(amount) {
  if (amount <= 500) {
    return 'chip1';
  }
  if (amount > 500 && amount <= 2000) {
    return 'chip2';
  }
  if (amount > 2000 && amount <= 4000) {
    return 'chip3';
  }
  if (amount > 4000 && amount <= 6000) {
    return 'chip4';
  }
  return 'chip5';
}

defineExpose({
  reset,
});

</script>

<style lang="scss" scoped>
.chip-wrap {
  position: relative;
  width: 70px;
  height: 70px;
  cursor: pointer;
  transition: all 0.45s ease-out;

  &.active {
    // font-weight: 500;
    transform: scale(1.2);
    // transform-origin: 50% 100%;
  }

  img {
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  >span {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--font-color-fff);
    user-select: none;
    z-index: 1;
    padding-bottom: 10px;
  }
}
</style>
