<template>
  <div>
    <Dialog :title="$t('重要公告')" v-model="modelValue" width="600px" class="notice-wrap" titlePadding="0"
      customeClass="discount-detail-dialog" @onClose="close">
      <el-image :src="popData.pc_pop_pic" style="width: 100%;height: 400px" lazy fit="contain"
        @click="go(popData.url)" />
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from './index.vue';

const global = inject('global');
const $router = useRouter();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  popData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'onClose']);
function handleClose() {
  // emit('onClose');
  emit('update:modelValue', false);
}
function go(url) {
  handleClose();
  if (url.startsWith('http') || url.startsWith('//')) {
    window.open(url, 'thirdActivity');
  } else {
    $router.push({
      path: url,
    });
  }
}
function close() {
  handleClose();
  window.sessionStorage.setItem('pop_status', true);
}

onMounted(() => {

});

onUnmounted(() => {

});
</script>

<style lang="scss" scoped>
</style>
