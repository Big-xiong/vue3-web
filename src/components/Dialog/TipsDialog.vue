<template>
  <Dialog v-model="modelValue" center confirmType="primary" :confirmText="$t('立即设置')" cancelType="grey"
    :cancelText="$t('暂不设置')" @onConfirm="handleConfirm" @onClose="handleClose" @close="$attrs.close ?? goCenterHome"
    v-bind="$attrs" customeClass="tips-wrap" footerBtnWidth="200px" contentPadding="40px 40px 0">
    <img v-if="icon" src="@/assets/images/center/tipsIcon/error.png" alt class="tips-img" />
    <h2 class="tips-title">{{ $attrs.tipsTitle || $t('安全提示') }}</h2>
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
  icon: {
    type: String,
    default: 'error',
  },
  tips: {
    type: String,
    default: 'error',
  },
  type: {
    type: Number,
    default: 0,
  },
});

const $attrs = useAttrs();

function handleConfirm(close) {
  if ($attrs.onConfirm) {
    $attrs.onConfirm(close);
    return;
  }
  close();
  if (props?.type === 1) {
    global.$router.push({ name: 'centerProfile', params: { title: global.$t('联系方式') } });
  } else {
    global.$dialog({ tpl: 'MoneyPasswordSet' });
  }
}

function goCenterHome() {
  global.$router.push({ name: 'centerHome' });
}

function handleClose(close) {
  if ($attrs.onClose) {
    $attrs.onClose(close);
    return;
  }
  close();
  goCenterHome();
}

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
          // color: var(--font-color-999);
          // border-color: var(--font-color-999);
        }
      }
    }
  }
}
</style>
