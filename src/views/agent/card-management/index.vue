<template>
  <div class="card-management-wrap">
    <header>{{$t('已绑定的银行卡')}}({{agent.userInfo?.agent_bank?.length??0}}/4)</header>

    <div class="card-list-wrap">
      <div
        class="card-item"
        v-for="(item, index) in agent.userInfo?.agent_bank ?? []"
        :key="index"
        :style="{'background-image': `url(${$getSrc(`/src/assets/images/bank-icon/bank_${item.icon_code?.toLowerCase()}_bg.png`, 'bank_ty_bg')})`}"
      >
        <div class="card-head">
          <BankIcon :bank-code="item.icon_code?.toLowerCase()" />
          {{ item.bank_name }}
        </div>
        <div class="card-body">{{ `**** **** **** ${item.card_no.slice(-4)}` }}</div>
        <div class="card-foot">{{ `**${item.name.slice(-1)}` }}</div>
      </div>
      <div
        class="add-card-wrap"
        @click="changeDialogVisible(true)"
        v-if="agent.userInfo?.agent_bank?.length < 4"
      >
        <i class="el-icon-plus" />
        <span>{{$t('添加银行卡')}}</span>
      </div>
    </div>
    <AddBankDialog
      :visible="addBankDialog"
      @close="changeDialogVisible(false)"
    />
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import BankIcon from '@/views/agent/components/BankIcon.vue';
import AddBankDialog from './AddBankDialog.vue';

const global = inject('global');

const $store = inject('store');
$store.dispatch('agent/getUserInfo');
const { agent } = $store.state;

const addBankDialog = ref(false);

function changeDialogVisible(value) {
  addBankDialog.value = value;
  if (!value) {
    $store.dispatch('agent/getUserInfo');
  }
}
</script>

<style lang="scss" scoped>
.card-management-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;

  header {
    text-align: left;
    color: var(--font-color-000);
    font-size: 16px;
    font-weight: bold;
  }
}

.card-list-wrap {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.card-item {
  background-color: var(--bg-color-ececec);
  border-radius: 6px;
  padding: 30px;
  width: 400px;
  height: 128px !important;
  margin-bottom: 15px;
  background-size: 100% 100%;
  box-sizing: border-box;
  margin-right: 30px;
  color: var(--font-color-fff);

  .card-body {
    text-align: left;
    margin: 19px 0 0;
  }

  .card-head,
  .card-foot {
    align-items: center;
    white-space: nowrap;
    display: flex;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }

  .card-head {
    font-weight: bold;
  }
}

.add-card-wrap {
  width: 400px;
  height: 128px !important;
  border-radius: 6px;
  background-color: var(--bg-color-ececec);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 20px;
  cursor: pointer;

  i {
    font-size: 12px;
  }
  span {
    margin-left: 5px;
  }
}

:deep(.el-button) {
  width: 100%;
}
</style>
