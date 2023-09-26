<template>
  <div v-if="show">
    <el-dialog v-model="show" :width="width" :center="center" @close="$attrs.close || handleCancel" destroy-on-close
      :custom-class="`${customeClass} ${showBtn || ctx.slots.footer ? '' : 'no-footer'}`" v-bind="$attrs">
      <template #title>
        <slot name="title">
          <span :class="{ 'el-dialog-title': true, 'left-bor': titleLeftBorder, 'bottom-bor': titleBottomBorder }"
            :style="{ padding: titlePadding }" v-if="title">{{ title }}</span>
        </slot>
      </template>
      <div class="el-dialog__body-wrap" :style="{ padding: contentPadding }">
        <div class="tipsDia-con" v-if="tipsInfo?.icon">
          <div class="icon">
            <i :class="tipsInfo?.icon"></i>
          </div>
          <h2 :class="['title', { red: tipsInfo.isError }]">{{ $t(tipsInfo?.title) }}</h2>
          <div class="tips" v-html="tipsInfo?.tips" />
        </div>
        <slot />
      </div>
      <template #footer>
        <slot name="footer">
          <div v-if="showBtn" :class="[
            blockBtn ? 'dialog-footer-block-btn' : 'dialog-footer-inline-btn',
          ]">
            <el-button v-if="showConfirmBtn" :type="confirmType" :loading="confirmLoading" @click="handleConfirm"
              :style="{ 'min-width': footerBtnWidth }">{{ confirmText }}</el-button>
            <el-button v-if="showCancelBtn" :type="cancelType" @click="handleClose"
              :style="{ 'min-width': footerBtnWidth }">{{ cancelText }}</el-button>
          </div>
        </slot>
        <slot name="footerTips" />
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const global = inject('global');

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String],
    default: '500px',
  },
  title: {
    type: String,
    default: '',
  },
  confirmType: {
    type: String,
    default: 'primary',
  },
  cancelType: {
    type: String,
    default: 'grey',
  },
  titleLeftBorder: {
    type: Boolean,
    default: false,
  },
  titleBottomBorder: {
    type: Boolean,
    default: false,
  },
  titlePadding: {
    type: String,
    default: '20px 40px',
  },
  contentPadding: {
    type: String,
    default: '20px 40px',
  },
  footerPadding: {
    type: String,
    default: '0 40px 40px',
  },
  cancelText: {
    type: String,
    default: () => inject('$t')('取消'),
  },
  showBtn: {
    type: Boolean,
    default: true,
  },
  showConfirmBtn: {
    type: Boolean,
    default: true,
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: () => inject('$t')('取消'),
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  // 块级btn
  blockBtn: {
    type: Boolean,
    default: false,
  },
  // 是否居中
  center: {
    type: Boolean,
    default: false,
  },
  // 底部按钮长度
  footerBtnWidth: {
    type: String,
    default: '195px',
  },
  // 自定义类名
  customeClass: {
    type: String,
    default: '',
  },
  tipsInfo: {
    type: Object,
    default: () => ({}),
  },
  serviceType: {
    type: Number,
    default: 0,
  },
});

const show = ref(false);
watch(() => props.modelValue, () => {
  show.value = props.modelValue;
}, { immediate: true });

const emit = defineEmits(['update:modelValue', 'onCancel', 'onClose', 'onConfirm']);
const attrs = useAttrs();
const ctx = getCurrentInstance();

function closeDialog() {
  if (attrs?.modelValue) emit('update:modelValue', false);
  show.value = false;
  attrs?.unmount?.();
}

function handleCancel() {
  closeDialog();
  if (!attrs?.unmount) emit('onClose', () => { });
}

function handleConfirm() {
  emit('onConfirm', closeDialog);
}

function handleClose() {
  emit('onClose', closeDialog);
}

defineExpose({
  handleCancel,
  closeDialog,
});
</script>

<style lang="scss" scoped>
.el-dialog {
  text-align: left;

  &-title {
    height: 24px;
    background-color: var(--dialog-title-bg);
    border-radius: var(--dialog-title-border-radius);

    &.bottom-bor {
      border-bottom: solid 1px var(--border-color-e2e2e2);
    }

    &.left-bor::before {
      content: '';
      position: absolute;
      left: 0;
      width: 2px;
      height: 24px;
      background: var(--theme-color);
    }
  }

  .tipsDia-con {
    .icon {
      color: var(--font-color-f66);
      font-size: 70px;
      text-align: center;
      margin-top: 30px;
    }

    .title {
      color: var(--theme-color);
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin: 30px 0 20px;

      &.red {
        color: var(--font-color-f66);
      }
    }

    .tips {
      text-align: center;
      font-size: 16px;
      color: var(--font-color-000);
      margin: 0;
    }
  }

  &__footer {

    .el-button {
      padding-left: 10px;
      padding-right: 10px;
      white-space: normal;
    }
  }

}

:deep(.el-dialog__footer) {
  padding: v-bind(footerPadding) !important;
}
</style>

<style lang="scss">
.no-footer {
  .el-dialog__footer {
    display: none !important;
  }
}
</style>
