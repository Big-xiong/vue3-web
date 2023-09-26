
<template>
  <div class="fast-money-wrap">
    <header class="fast-money-header">{{ $t('快捷金额:') }}</header>
    <div class="money-list">
      <Chip @selected="handleSelect($event)" :list="moneyData"></Chip>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import Chip from '@/components/Chip/index.vue';

const global = inject('global');

defineProps({
  moneyData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select']);
function handleSelect(event) {
  emit('select', event);
}
</script>

<style lang="scss" scoped>
.fast-money-wrap {
  margin-top: 20px;

  .money-list {
    display: flex;
  }
}

.fast-money-header {
  font-size: 16px;
  color: var(--font-color-fff);
  font-weight: 500;
  line-height: 30px;
  margin-bottom: 10px;
}
</style>
