<template>
  <div class="preview-image-wrap">
    <Dialog v-model="modelValue" @close="$emit('update:modelValue', false)" :showConfirmBtn="false"
      :showCancelBtn="false">
      <div class="image-wrap">
        <img :src="imageUrl" alt="" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import Dialog from '@/components/Dialog/index.vue';

const global = inject('global');

defineProps({
  modelValue: Boolean,
  imageUrl: String,
});
</script>

<style lang="scss" scoped>
.image-wrap {
  img {
    width: 100%;
  }
}

:deep(.el-dialog__header) {
  padding-top: 20px;
  padding-bottom: 10px;
}

:deep(.el-dialog__body) {
  padding: 30px 20px !important;
}
</style>
