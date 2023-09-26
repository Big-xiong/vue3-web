<template>
  <div class="layout-flex-center benefit-list">
    <div
      class="layout-flex-center benefit-list-item"
      v-for="(item,index) in list"
      :key="index"
    >
      <div class="layout-flex-center benefit-cover">
        <i :class="item.icon"></i>
      </div>
      <p>{{ $t(item.title) }}</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
const list = [
  {
    icon: 'el-icon-s-custom',
    title: global.$t('专属客户经理'),
  },
  {
    icon: 'el-icon-s-flag',
    title: global.$t('晋级礼金'),
  },
  {
    icon: 'el-icon-s-finance',
    title: global.$t('存取款优先'),
  },
  {
    icon: 'el-icon-s-cooperation',
    title: global.$t('专属定制福利'),
  },
];
</script>

<style lang="scss" scoped>
.benefit-list {
  margin-bottom: 30px;

  &-item {
    width: 180px;
    height: 192px;
    background: var(--area-color);
    border-radius: 6px;
    flex-direction: column;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    margin: 20px;

    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 1px;
      opacity: 1;
      background: var(--theme-color);
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .benefit-cover {
      width: 70px;
      height: 70px;
      opacity: 1;
      background: var(--theme-color);
      border-radius: 50%;

      i {
        font-size: 36px;
        color: var(--font-color-fff);
      }
    }

    > p {
      margin: 20px 0 0;
      font-size: 16px;
      color: var(--font-color-ccc);
    }
  }
}
</style>
