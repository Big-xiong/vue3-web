<template>
  <div class="commission-rate-wrap">
    <div class="input-wrapper">
      <el-input
        v-model="rate"
        type="number"
        :placeholder="$t('下级代理佣金比例')"
      >
        <template #prefix>
          <span class="required-prefix">*</span>
        </template>
      </el-input>
      <div class="layout-flex-start foot-note">
        <i class="el-icon-warning-outline"></i>
        <span>{{$t('不得高于自身佣金比例')}}</span>
      </div>
    </div>
    <el-button
      class="edit-btn"
      :loading="setRateLoading"
      @click="setRate"
      type="primary"
      style="width: 180px;"
    >{{$t('确定设置')}}</el-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, ref, watch, computed,
} from 'vue';
import { setchildrate } from '@/api/agent';

const global = inject('global');

const $store = inject('store');
const { agent } = $store.state;
const rate = ref(null);

watch(() => agent.userInfo, (userInfo) => {
  console.log(userInfo);
  const { child_rate } = userInfo;
  if (child_rate) {
    rate.value = Number(child_rate) * 100;
  }
}, { immediate: true });

const { run: setRate, loading: setRateLoading } = useRequest(
  () => setchildrate({
    child_rate: rate.value,
  }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('设置成功！'));
      $store.dispatch('agent/getUserInfo');
    },
  },
);
</script>

<style lang="scss" scoped>
.commission-rate-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 34px;

  .input-wrapper {
    position: relative;
    height: 45px;
    margin-right: 20px;
    width: 500px;
  }

  .foot-note {
    white-space: nowrap;
    font-size: 14px;
    color: var(--font-color-999);
    margin: 10px 0 7px;
  }
}
</style>
