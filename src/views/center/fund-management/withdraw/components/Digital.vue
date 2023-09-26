<template>
  <div class="widthdraw-digital-wrap">
    <h2 class="widthdraw-digital-wrap-title">{{ $t('提款币种') }}</h2>
    <el-select v-model="form.dig_mode_type" :placeholder="$t('请选择货币类型')">
      <el-option v-for="item in protocalList" :key="item.type" :label="item.type_name" :value="item.type" />
    </el-select>
    <h2 class="widthdraw-digital-wrap-title">{{ $t('协议') }}</h2>
    <div class="layout-flex-center widthdraw-digital-wrap-protocal">
      <span v-for="(item, index) in protocalList?.filter(m => m.type === form.dig_mode_type)[0]?.protocol ?? []"
        :key="index" :class="{ 'active': form.protocol === item.value }" @click="handleProtocol(item.value)">{{
          item.name
        }}</span>
    </div>
    <h2 class="widthdraw-digital-wrap-title">{{ $t('提币地址') }}</h2>
    <el-input v-model="form.address" class="widthdraw-digital-wrap-address" :placeholder="$t('请粘贴地址')"
      @blur="handleAddress">
      <template v-slot:suffix>
        <!-- <img
          class="address"
          src="/src/assets/images/center/widthdraw/address@2x.png"
          alt
          @click="handleShow"
        /> -->
        <svg-icon name="usdt-btn" class="address" @click="handleShow" />
      </template>
    </el-input>
    <h2 class="widthdraw-digital-wrap-title">{{ $t('提币金额') }}</h2>
    <div class="layout-flex-center widthdraw-digital-wrap-money">
      <el-input v-model="form.withdraw_money" size="big" style="width: 500px;"
        :placeholder="`${$t(`可取`)}${_priceFormat(user?.walletInfo?.money)}`" @blur="checkNum"
        @input="computeCostManage">
        <template v-slot:prefix>{{ user?.userInfo?.currency_detail?.symbol }}</template>
        <template v-slot:suffix>
          <span
            @click="form.withdraw_money = parseInt(user?.walletInfo?.money); computeCostManage(form.withdraw_money)">{{
              $t('全部')
            }}</span>
        </template>
      </el-input>
      <div class="layout-flex-center tips-ticker">
        <i class="el-icon-info" />
        <span>{{ $t('参考汇率') }}：1{{ form.dig_mode_type.toUpperCase() }}={{ tickerList?.upCoin ?? '0.00' }}CNY</span>
      </div>
    </div>
    <p class="widthdraw-digital-wrap-get">
      {{ $t('预计到账') }}
      <span>{{ costManage[3] && tickerList?.upCoin ? (costManage[3] / tickerList?.upCoin).toFixed(2) : 0 }}</span>
      {{ form.dig_mode_type.toUpperCase() }}{{ $t('（实际到账以实时汇率为准）') }}
    </p>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import {
  staticprotocol, getticker, adddigwallet, digwalletlist,
} from '@/api/center';
import { priceFormat, dateFormat } from '@/utils';

const global = inject('global');

const $store = inject('store');

const { user } = $store.state;
const props = defineProps({
  siteinfo: {
    type: Object,
    default: null,
  },
  withDrawLimitInfo: {
    type: Object,
    default: null,
  },
});
const costManage = ref([0, 0, 0, 0]);
const form = reactive({
  withdraw_money: '',
  dig_mode_type: '',
  protocol: '',
  address: '',
  currency_type: 2,
  user_dig_wallet_id: '',
});

// 汇率
const { run: tickerRun, data: tickerList } = useRequest(getticker, {
  manual: true,
});

// 提款币种
const { run: protocalRun, data: protocalList } = useRequest(staticprotocol, {
  onSuccess(res) {
    form.dig_mode_type = res[0].type;
    form.protocol = res[0].protocol[0].value;
    tickerRun({ digital_mode_type: res[0].protocol[0].value });
  },
});

function checkNum() {
  const reg = /.*\..*/;
  if (reg.test(form.withdraw_money)) {
    global.$message.warning(global.$t('取款金额只能为正整数，不能带小数点'));
  }
}

const emit = defineEmits(['feeList', 'chooseAddress', 'resetProtocolAddress', 'checkWithdraw']);

watch(form, () => {
  emit('checkWithdraw', form.user_dig_wallet_id && form.withdraw_money);
}, { deep: true });

function handleProtocol(val) {
  form.protocol = val;
  tickerRun({ digital_mode_type: val });
  emit('resetProtocolAddress');
}

function _priceFormat(price = 0) {
  price = +price ?? 0;
  return (user?.currencySymbol ?? 0) + priceFormat(price);
}

function judgeCostMethod() { // 判断是否需要手续费 true 需要 false 不需要
  const { cost_manage } = props.siteinfo;
  if (form.currency_type === 1 && cost_manage?.bank_limit_open) {
    return false;
  }
  if (cost_manage?.level_limit?.includes(user?.userinfo?.level)
    || cost_manage?.white_list?.split(',')?.includes(user?.userinfo?.username)) {
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
  const { administrative_rate, withdraw_fees, dig_fee } = props.siteinfo?.cost_manage ?? {};

  // [取款手续费, 行政费, 扣除优惠, 可取金额]
  const costs = [0, 0, 0, 0];
  // 手续费

  // 手续费
  if (money) {
    let fee = 0;
    if (judgeCostMethod()) {
      if (form.currency_type === 1) { // 1 银行卡取款 2 数字货币取款
        withdraw_fees.some((item, index, _ary) => {
          if (item.withdraw_fee_type === 1) {
            fee = item.withdraw_fee;
          } else if (item.withdraw_fee_type === 2) {
            fee = (money * (item.withdraw_fee / 100)).toFixed(2);
          } else {
            fee = item.withdraw_fee;
          }
          return money <= item.withdraw_fee_max * 1;
        });
      } else {
        fee = (money * dig_fee).toFixed(2);
      }
    }
    costs[0] = fee;
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

function handleShow() {
  emit('chooseAddress', true);
}

async function handleAddress() {
  const time = dateFormat('HH:MM', (new Date()).getTime());
  const param = {
    type: form.dig_mode_type,
    protocol: form.protocol,
    address: form.address,
    remark: `${form.protocol} ${time}`,
  };
  if (form.address) await adddigwallet(param);
  const res = await digwalletlist();
  form.user_dig_wallet_id = res[0].id;
}

defineExpose({
  form,
});

</script>

<style lang="scss" scoped>
.widthdraw-digital-wrap {
  font-size: 14px;
  color: var(--font-color-999);

  &-money {
    margin-top: 15px;
  }

  .el-input--big {
    margin: 0;

    :deep(.el-input__inner) {
      padding-left: 40px;
    }

    :deep(.el-input__prefix) {
      line-height: 60px;
      font-size: 16px;
      color: var(--font-color-000);
      font-weight: bold;
      padding-left: 15px;
    }
  }

  &-money {
    justify-content: flex-start;

    .tips-ticker {
      margin-left: 30px;

      i {
        font-size: 24px;
        margin-right: 5px;
      }
    }
  }

  &-title {
    font-size: 16px;
    color: var(--font-color-000);
    font-weight: 500;
    line-height: 30px;
    margin: 20px 0 10px;
  }

  .el-select {
    width: 505px;
  }

  &-protocal {
    justify-content: flex-start;

    span {
      height: 40px;
      border: 1px solid var(--border-color-000-2);
      line-height: 40px;
      font-size: 16px;
      min-width: 120px;
      border-radius: 6px;
      margin-right: 10px;
      text-align: center;
      cursor: pointer;
      color: var(--font-color-666);

      &.active {
        color: var(--theme-color);
        border-color: var(--theme-color);
      }
    }
  }

  &-address {
    width: 505px;

    :deep(.el-input__suffix) {
      width: 59px;
      line-height: 40px;
      border-left: 1px solid var(--border-color-525152);

      img {
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }

  &-get {
    margin: 20px 0;

    span {
      color: var(--theme-color);
    }
  }

  .address {
    width: 18px;
    height: 18px;
    fill: var(--font-color-000);
    cursor: pointer;
  }
}
</style>
