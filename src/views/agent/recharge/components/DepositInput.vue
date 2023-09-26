<template>
  <div class="deposit-input-wrap">
    <header class="deposit-input-header">{{ $t('存款金额') }}</header>
    <div class="input-wrapper">
      <el-input :model-value="props.modelValue" @change="updateValue($event)"
        :placeholder="$t('最低存款,最高存款', [min, max])">
        <template v-slot:prefix>
          <span>{{ user?.currency_detail?.symbol }}</span>
        </template>
      </el-input>
      <div class="tips-ticker" v-if="tickerText">
        <svg-icon name="info" />{{ $t('参考汇率') }}：{{ tickerText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, withCtx,
} from 'vue';

const global = inject('global');

const props = defineProps({
  tickerText: {
    type: String,
    default: '',
  },
  min: Number,
  max: Number,
  modelValue: {
    type: Number,
    default: 0,
  },
});

const $store = inject('store');
const { user } = $store.state;

const emit = defineEmits(['update:modelValue']);
function updateValue(value) {
  emit('update:modelValue', value);
}
</script>

<style lang="scss" scoped>
.deposit-input-wrap {
  margin-top: 20px;

  .input-wrapper {
    display: flex;
    align-items: center;
  }

  .tips-ticker {
    margin-left: 30px;
    font-size: 16px;
    color: var(--font-color-999);
  }

  :deep(.el-input__prefix) {
    font-size: 20px;
    color: var(--font-color-fff);
    line-height: 60px;
    margin-left: 10px;
  }

  :deep(.el-input) {
    width: auto;
  }

  :deep(.el-input__inner) {
    height: 60px;
    line-height: 40px;
    width: 505px;
    font-size: 16px;
    padding-left: 40px;
    color: var(--font-color-fff);
  }
}

.deposit-input-header {
  font-size: 16px;
  color: var(--font-color-fff);
  font-weight: 500;
  line-height: 30px;
  margin-bottom: 10px;
}
</style>
