<template>
  <el-image :src="$getSrc(`/src/assets/images/bank-icon/${code}.png`)" />
</template>

<script setup>
import { inject, computed } from 'vue';

const global = inject('global');

const bankCodes = [
  'ABC',
  'BCCB',
  'BOC',
  'BOCOM',
  'BOS',
  'CCB',
  'CEB',
  'CGB',
  'CIB',
  'CMB',
  'CMBC',
  'ECITIC',
  'HXB',
  'HZCBC',
  'ICBC',
  'NBCBC',
  'PAB',
  'PSBC',
  'SPDB',
];

const props = defineProps({
  bankCode: String,
});

const code = computed(() => {
  if (bankCodes.indexOf(props.bankCode) !== -1) {
    return props.bankCode;
  }

  return 'Default';
});
</script>

<style lang="scss" scoped>
.el-image {
  height: 100%;
  background-color: var(--bg-color-fff);
  padding: 2px;
  border-radius: 50%;
}
</style>
