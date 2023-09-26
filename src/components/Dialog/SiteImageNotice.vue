<template>
  <div class="site-image-notice-wrap">
    <Dialog ref="dialogRef" title="" v-model="modelValue" width="570px" titlePadding="0" :showBtn="false"
      contentPadding="0">
      <div class="dialog-content-wrap">
        <img :src="imageUrl" @click="go" v-if="imageUrl" alt="">
        <i class="el-icon-circle-close" @click="handleClose"></i>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from './index.vue';

const global = inject('global');
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  notice: {
    default: () => ({}),
    type: Object,
  },
  callback: Function,
  unmount: Function,
});
const link = computed(() => {
  try {
    const content = JSON.parse(props.notice.content);
    return content.pic_url;
  } catch (e) {
    return '';
  }
});
const imageUrl = computed(() => {
  try {
    const content = JSON.parse(props.notice.content);
    return content.pic;
  } catch (e) {
    return '';
  }
});

const isShowPopup = ref(true);
const $router = useRouter();
const emit = defineEmits(['update:modelValue', 'onClose']);
function handleClose() {
  // emit('onClose');
  // emit('update:modelValue', false);
  // isShowPopup.value = false;
  props.callback?.();
  props.unmount?.();
  // dialogRef.value.handleCancel();
}
function go() {
  const content = props.notice;
  if (content && content.pic_url) {
    if (content.pic_url_type === 1) {
      $router.push({
        path: content.pic_url,
      });
    } else if (content.pic_url_type === 2) {
      window.open(content.pic_url, '_blank');
    }
  }
  // $router.push({ path: props.link });
  props.callback?.();
  props.unmount();
}
</script>
<style lang="scss">
.site-image-notice-wrap {
  .el-dialog {
    background: none;
    box-shadow: none;

    .el-dialog__close {
      display: none;
    }

    img {
      width: 100%;
      cursor: pointer;
    }

    .el-dialog__footer {
      display: none;
    }

    i {
      color: var(--font-color-fff);
      font-size: 60px;
      font-weight: normal;
      margin: 30px auto 0;
      display: block;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
