<template>
  <div class="lottery-info">
    <h1>{{ info.title }}
      <template v-if="isGray">
        ({{ $t('维护中') }})
      </template>
    </h1>
    <div class="lottery-info-content">
      <span>{{ info.subtitle }}</span>
      <span>{{ info.content }}</span>
    </div>
    <el-button type="primary" class="lottery-info-but">{{ $t('立即游戏') }}</el-button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
const props = defineProps({
  info: {
    type: Object,
    default: () => ({
      title: '',
      subtitle: '',
      content: '',
    }),
  },
  isGray: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.lottery-info {
  // border: 1px solid #fff;
  flex: 1;
  box-sizing: border-box;
  height: 364px;
  overflow: hidden;

  h1 {
    font-size: 37px;
    font-weight: 700;
    text-align: left;
    line-height: 56px;
    color: var(--font-color-fff);
  }

  &-content {
    margin-top: 24px;
    width: 530px;
    font-size: 11px;
    font-weight: 700;
    text-align: left;
    color: var(--font-color-fff);
    line-height: 19px;

    span {
      display: block;
    }
  }

  &-but {
    position: relative;
    bottom: -21px;
    float: right;
    min-width: 114px;
    height: 47px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
}
</style>
