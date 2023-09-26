<template>
  <div>
    <p class="layout-flex-center tips-text pointer" v-if="type === 1" @click="$openKefu">
      <svg-icon name="service"></svg-icon>
      <span>{{ $t('专属客服') }}</span>
    </p>
    <p class="layout-flex-center tips-text-nosvg" v-if="type === 2">{{ $t('遇到问题，联系') }}<span
        @click="$openKefu">{{ $t('专属客服') }}</span>
    </p>
    <div class="layout-flex-center login-dialog-footerTips" v-if="type === 3">
      <div class="layout-flex-center" @click="() => { $router.push('/'); $emit('unmount'); }">
        <svg-icon name="come" />
        <span>{{ $t('再逛逛吧') }}</span>
      </div>
      <div class="layout-flex-center" @click="$openKefu">
        <svg-icon name="customer" />
        <span>{{ $t('专属客服') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');

defineProps({
  type: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
.tips-text {
  font-size: 14px;
  color: var(--font-color-ccc);
  height: 66px;
  margin: 0;

  .svg-icon {
    color: var(--theme-color);
    width: 30px;
    height: 24px;
    margin-right: 10px;
  }
}
</style>
