<template>
  <div class="bank-select-wrap">
    <el-select v-model="bankSelected" :placeholder="$t('选择银行')">
      <el-select-option v-for="item in bankList" :key="item.id">
        <template>
          <div class="bank-item">
            <BankIcon :bank-code="item.icon_code?.toLowerCase()" />
            <span>{{ item.name }}</span>
            <i class="el-icon-check" />
          </div>
        </template>
      </el-select-option>
    </el-select>
  </div>
</template>

<script setup>
import {
  inject, ref, watch,
} from 'vue';
import BankIcon from './BankIcon.vue';

const global = inject('global');

const bankSelected = ref(null);
const props = defineProps({
  methodId: String,
  payType: Number,
});

const $store = inject('store');
const { agent } = $store.state;
if (props.methodId && !agent.bankList?.length) {
  $store.dispatch('agent/setBankList', props);
}

watch(() => props.methodId, () => {
  if (props.methodId && !agent.bankList?.length) {
    $store.dispatch('agent/setBankList', props);
  }
});

const bankList = ref([]);
watch(() => agent.bankList, (val) => {
  bankList.value = val;
});
</script>

<style lang="scss" scoped>
.bank-select-wrap {
  margin-top: 20px;

  :deep(.el-input__inner) {
    width: 505px;
  }
}

.bank-item {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.45s ease-out;

  .el-image,
  >img {
    width: 26px;
    height: 26px;
    z-index: 1;
  }

  >span {
    width: 70%;
    font-size: 14px;
    color: var(--font-color-ccc);
    user-select: none;
    z-index: 1;
    padding-left: 10px;
  }

  [class*='el-icon'] {
    display: none;
  }

  &.selected {
    [class*='el-icon'] {
      display: block;
    }
  }
}
</style>
