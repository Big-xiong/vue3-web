<template>
  <div class="widthdraw-bank-wrap">
    <h2 class="widthdraw-bank-wrap-title">{{ $t("取款卡") }}</h2>
    <BankCardList :max="4" :isList="true" :list="myBankCards" @activeBank="activeBank" />
    <h2 class="widthdraw-bank-wrap-title">{{ $t("提款金额") }}</h2>
    <div class="widthdraw-bank-wrap-money">
      <el-input v-model="form.withdraw_money" size="big" style="width: 500px;"
        :placeholder="`${$t(`可取`)}${_priceFormat(user?.walletInfo?.money)}`" @blur="checkNum"
        @input="computeCostManage">
        <template v-slot:prefix>{{ user?.userInfo?.currency_detail?.symbol }}</template>
        <template v-slot:suffix>
          <span @click="clickAllHandle">{{ $t('全部') }}</span>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, computed, ref, watch,
} from 'vue';
import BankCardList from '@/components/BankCardList/index.vue';
import { priceFormat } from '@/utils/index';

const global = inject('global');

const props = defineProps({
  siteinfo: {
    type: Object,
    default: null,
  },
  activeId: {
    type: Number,
    default: null,
  },
  withDrawLimitInfo: {
    type: Object,
    default: null,
  },
});
const costManage = ref([0, 0, 0, 0]);
const emit = defineEmits(['update:activeId', 'feeList', 'checkWithdraw']);
const $store = inject('store');
const { user, agent } = $store.state;
const myBankCards = computed(() => user?.userInfo?.user_bank ?? []);
// const userBankId = computed(() => user?.userInfo?.user_bank[0]?.id ?? '');
emit('update:activeId', myBankCards.value[0]?.id);

const form = reactive({
  withdraw_money: '',
});

watch(form, () => {
  emit('checkWithdraw', myBankCards.value.length && form.withdraw_money);
}, { deep: true });

function activeBank(item) {
  emit('update:activeId', item.id);
}
function checkNum() {
  const reg = /.*\..*/;
  if (reg.test(form.withdraw_money)) {
    global.$message.error(global.$t('取款金额只能为正整数，不能带小数点'));
  }
}

function judgeCostMethod() { // 判断是否需要手续费 true 需要 false 不需要
  const costManage02 = props.siteinfo?.cost_manage;
  if (!costManage02.bank_limit_open) {
    return false;
  }
  if (costManage02.level_limit.indexOf(user?.userInfo?.level) !== -1) {
    return false;
  }
  if (costManage02.white_list.split(',').indexOf(user?.userInfo?.username) !== -1) {
    return false;
  }
  return true;
}
function computeCostManage(money) {
  // 手续费：根据用户输入的取款金额判断后台返回扣除费用
  // 行政费：存款金额（未达到流水部分）*后台配置百分比
  // 扣除优惠：后台返回字段数据
  // 计算出最后可取金额，自动填充到输入取款金额输入框
  // 数字货币手续费
  const { administrative_rate, withdraw_fees, dig_fee } = props.siteinfo?.cost_manage;
  // [取款手续费, 行政费, 扣除优惠, 可取金额]
  const costs = [0, 0, 0, 0];

  // 手续费
  if (money && judgeCostMethod()) {
    let fee = 0;
    withdraw_fees.some((item, index, _ary) => {
      if (item.withdraw_fee_type === 1) {
        fee = item.withdraw_fee;
      } else if (item.withdraw_fee_type === 2) {
        fee = (money * (item.withdraw_fee / 100)).toFixed(2);
      } else {
        fee = item.withdraw_fee;
      }
      return money * 1 <= item.withdraw_fee_max * 1;
    });
    costs[0] = props.siteinfo?.cost_manage?.fees_type && props.siteinfo?.cost_manage?.fees_type === 2 ? (money * (fee / 100)).toFixed(2) : fee;

    // costs[0] = costs[0].toFixed(2)
  }

  // 行政费
  if (props.withDrawLimitInfo?.draw_limit_amount) {
    costs[1] = (Math.min(props.withDrawLimitInfo?.draw_limit_amount, money)
      * administrative_rate).toFixed(2);
  }
  // 扣除优惠
  costs[2] = props.withDrawLimitInfo?.deduction_money;
  // 可取金额（避免为负
  costs[3] = Math.max(money - costs[0] - costs[1] - costs[2], 0).toFixed(2);
  costManage.value = costs;

  emit('feeList', costs);
}

const clickAllHandle = () => {
  form.withdraw_money = parseInt(user?.walletInfo?.money, 10);
  computeCostManage(parseInt(user?.walletInfo?.money), 10);
}

function _priceFormat(price = 0) {
  if (Number.isNaN(price)) price = 0;
  return (agent.currencySymbol || user.currencySymbol) + priceFormat(price);
}

defineExpose({
  form,
});

</script>

<style lang="scss" scoped>
.widthdraw-bank-wrap {
  &-money {
    margin-top: 15px;
  }

  .el-input--big {
    margin: 0;
  }

  &-title {
    font-size: 16px;
    color: var(--font-color-000);
    font-weight: 500;
    line-height: 30px;
    margin: 20px 0 10px;
  }

  .bank-card-list-wrap {
    flex-direction: column;

    :deep(.ank-card-list-wrap-item) {
      width: 505px;
      background-color: transparent;
      border: 1px solid var(--border-color-000-2);
      flex-direction: row;
      justify-content: space-between;
      padding: 0 20px;
      height: 60px;
      align-items: center;
      color: var(--font-color-000);
      margin-bottom: 15px;
      cursor: pointer;

      &:hover,
      &.active {
        border-color: var(--theme-color);
        color: var(--font-color-000);
      }

      p {
        margin: 0;
        font-size: 14px;
      }

      .select-bank {
        >div {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
    }

    :deep(.add-btn) {
      width: 505px;
      font-size: 16px;
      padding: 0;
      height: 60px;
      margin-bottom: 0;
      background-color: var(--dark-bg-color-232323, #ececec);

      &:hover {
        border-color: var(--theme-color);
        color: var(--font-color-ccc);
      }
    }
  }
}
</style>
