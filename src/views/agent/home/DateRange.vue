<template>
  <div class="date-range-wrap">
    <div class="date-wrap layout-flex-between">
      <el-date-picker v-model="data.startTime" class="start-date" format="YYYY-MM-DD" :placeholder="$t('开始时间')" />
      <div class="line" />
      <el-date-picker v-model="data.endTime" class="end-date" format="YYYY-MM-DD" :placeholder="$t('截止时间')" />
    </div>
    <el-button :loading="loading" type="primary" @click="emitQuery">{{ $t('搜索') }}</el-button>
  </div>
</template>

<script setup>
import {
  inject, reactive,
} from 'vue';
import dayjs from 'dayjs';

const global = inject('global');

const data = reactive({
  startTime: new Date(), // dayjs(new Date()).subtract(7, 'day').toDate(),
  endTime: new Date(),
});

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['query']);

function emitQuery() {
  emit('query', {
    startTime: data.startTime ? dayjs(data.startTime).format('YYYY-MM-DD') : '',
    endTime: data.endTime ? dayjs(data.endTime).format('YYYY-MM-DD') : '',
  });
}

</script>

<style lang="scss" scoped>
.date-range-wrap {
  margin-top: 20px;
  display: flex;
  border-radius: 6px;
  padding: 20px 30px;
  border: solid 1px var(--block-border-color);
  box-sizing: border-box;
  background-color: var(--block-bg-color);
}

.date-wrap {
  width: 420px;
  margin-right: 20px;
  height: 45px;
  border: 1px solid var(--border-color-e2e2e2);
  box-sizing: border-box;
  border-radius: 6px;
  flex: none;

  :deep(.el-input__inner) {
    border-color: transparent !important;
    background-color: transparent !important;
    text-align: center;
  }

  :deep(.start-date) {
    .el-input__prefix {
      width: 40px;
    }
  }

  :deep(.end-date) {
    .el-input__prefix {
      .el-input__icon {
        display: none;
      }
    }
  }

  .line {
    width: 10px;
    height: 1px;
    background-color: var(--border-color);
  }
}

.el-button {
  height: 42px;
  width: 180px;
}
</style>
