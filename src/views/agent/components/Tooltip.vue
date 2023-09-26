<template>
  <div class="tooltip-wrap">
    <span class="name">{{ content }}</span>
    <el-tooltip :append-to-body='false' :content="tip" :placement="placement" v-if="tip">
      <span class="tip-action">
        <i class="el-icon-question" />
      </span>
    </el-tooltip>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');

defineProps({
  tip: {
    type: String,
    required: true,
    default: '',
  },
  content: {
    type: String,
    required: true,
    default: '',
  },
  placement: {
    type: String,
    default: 'bottom',
  },
});
</script>

<style lang="scss" scoped>
.tooltip-wrap {
  display: flex;
  align-items: center;
  height: 14px;
  color: var(--font-color-999);
}

.name {
  line-height: 14px;
  margin-right: 4px;
  font-size: 14px;
}

.tip-action {
  height: 14px;
  line-height: 14px;

  .el-icon-question {
    font-size: 14px;
  }
}
</style>
