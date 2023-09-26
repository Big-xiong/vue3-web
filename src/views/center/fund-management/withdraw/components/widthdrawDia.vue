<template>
  <Dialog :title="$t('流水稽核')" v-model="modelValue" center width="640px" :confirmLoading="saveLoading"
    customeClass="widthdrawDia-wrap" footerBtnWidth="270px" contentPadding="0 40px">
    <ConfigTable :data="recordList" :columns="flowTableColumns" v-loading="recordLoading" stripe />
    <Transfer ref="transferRef" v-show="isTransfer && user.walletInfo.is_auto_trans !== 1" />
    <template #footerTips>
      <p class="footerTips">{{ `${$t(errorText)}，${$t('强制提款将扣除一定行政费用！')}` }}</p>
    </template>
    <template #footer>
      <template v-if="!isTransfer">
        <el-button type="primary" style="width: 275px;" @click="onConfirm">{{ $t('继续取款') }}</el-button>
        <el-button type="grey" style="width: 275px;" @click="onCancel">{{ $t('暂不取款') }}</el-button>
      </template>
      <template v-else>
        <el-button type="grey" style="width: 275px;" @click="onTransfer">{{ $t('确定转账') }}</el-button>
        <el-button type="primary" style="width: 275px;" @click="onConfirm">{{ $t('继续取款') }}</el-button>
      </template>
    </template>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive, ref, watch, withDirectives, resolveDirective, h, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Transfer from './Transfer.vue';
import { rechargeflow } from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import ConfigTable from '@/components/Table/index.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const transferRef = ref(null);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  errorText: {
    type: String,
    default: '',
  },
});
const moneyDirective = resolveDirective('money');
// {
//       render(){
//         return withDirectives(h('span'), [[moneyDirective, row.money]])
//       }
//     }
const flowTableColumns = reactive([
  {
    prop: 'created_at',
    width: 200,
    label: global.$t('时间'),
  },
  {
    prop: 'money',
    label: global.$t('存款/红利金额'),
    cellType: 'slots',
    formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.money]]),
  },
  {
    prop: 'finish_flow_require',
    label: global.$t('已达到流水'),
    cellType: 'slots',
    formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.finish_flow_require]]),
  },
  {
    prop: 'unfinish_flow_require',
    label: global.$t('需完成流水'),
    cellType: 'slots',
    formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.unfinish_flow_require]]),
  },
]);

const { run, data: recordList, loading: recordLoading } = useRequest(rechargeflow, {
  formatResult: (res) => res.data,
  onSuccess(res) { },
});

const isTransfer = computed(() => user.walletInfo.all_platform_money > 10);

const emit = defineEmits(['closeWidthdrawDia']);

function onCancel() {
  global.$router.push({ name: 'centerHome' });
}
function onConfirm() {
  emit('closeWidthdrawDia', false);
}
function onTransfer() {
  transferRef.value.handleSubmit(() => {
    global.$store.dispatch('user/getWalletInfo');
    emit('closeWidthdrawDia', false);
  });
}

</script>

<style lang="scss" scoped>
.widthdrawDia-wrap {
  text-align: center;

  .icon {
    color: var(--font-color-f66);
    font-size: 70px;
    text-align: center;
    margin-top: 30px;
  }

  .title {
    color: var(--font-color-f66);
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin: 30px 0 20px;
  }

  .tips {
    text-align: center;
    font-size: 16px;
    color: var(--font-color-ccc);
    margin: 0;
  }

  .footerTips {
    line-height: 30px;
    font-size: 16px;
    margin: 20px 0 0;
    color: var(--font-color-606266);
  }

  .config-table-wrap {
    position: relative;

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: -40px;
      right: -40px;
      height: 1px;
      background-color: var(--border-color-000-1);
      top: 0;
      z-index: 5;
    }

    &::after {
      top: auto;
      bottom: 0;
    }

    :deep(.el-table) {
      max-height: 250px;
      overflow: auto;
    }

    :deep(tr:last-child td) {
      border-bottom: 0;
      color: var(--font-color-fff-6) !important;
    }
  }
}
</style>
