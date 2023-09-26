<template>
  <Dialog
    v-model="modelValue"
    center
    cancelType="default"
    :cancelText="$t('确定')"
    @onClose="close => close()"
    customeClass="tips-wrap"
    v-bind="$attrs"
    :showConfirmBtn="false"
    footerBtnWidth="200px"
    contentPadding="40px 40px 0"
  >
    <img
      src="@/assets/images/center/tipsIcon/error.png"
      alt
      class="tips-img"
    />
    <h2 class="tips-title">{{ $t('温馨提示') }}</h2>
    <!-- <img
          :src="$getSrc(`/src/assets/images/center/tipsIcon/${icon}.png`)"
          class="tips-img"
          alt=""
    >-->
    <p class="dialog-tips">{{ tips }}</p>
  </Dialog>
</template>

<script setup>
import { inject } from 'vue';
import Dialog from './index.vue';

const global = inject('global');

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  tips: {
    type: String,
    default: 'error',
  },
});
</script>

<style lang="scss" scoped>
.tips-img {
  display: block;
  width: 70px;
  margin: 0 auto;
}
.dialog-tips {
  padding: 0;
}
.tips-title {
  text-align: center;
  font-size: 20px;
  margin: 40px 0 10px;
  font-weight: 600;
  color: var(--font-color-f66);
}
</style>

<style lang="scss">
.tips-wrap {
  .el-dialog__footer {
    .dialog-footer-inline-btn {
      flex-direction: column;
      .el-button {
        margin-top: 20px;

        &--default {
          color: var(--font-color-8B98A9, var(--font-color-999));
          border-color: var(--dialog-footer-btn-border, var(--font-color-999));
        }
      }
    }
  }
}
</style>
