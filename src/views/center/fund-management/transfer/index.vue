<template>
  <div class="transfer-wrap">
    <div v-loading="user.walletLoading">
      <div class="transfer-wrap-qs" v-show="user?.walletInfo?.open_mode == 1">
        <el-tooltip :content="$t('开启后，进入游戏时系统会自动将主账户余额充进游戏平台')" effect="dark" placement="bottom">
          <i class="el-icon-question" />
        </el-tooltip>
        <span>{{ $t('自动免转钱包') }}</span>
        <el-switch :loading="autoTransferLoading || user.walletLoading" v-model="isAutoTransfer" :active-value="1"
          :inactive-value="2" @click="changeTransfer" />
      </div>
      <div v-show="isAutoTransfer === 2" class="transfer-wrap-content">
        <Form :columns="columns" ref="formRef" label-position="top" class="transfer-wrap-account">
          <template #symbolL>
            <span class="transfer-symbol">{{ user.currencySymbol }}</span>
          </template>
          <template #arrow>
            <div class="transfer-wrap-content-arrow" @click="handleArrowFlip">
              <!-- <img :src="$getSrc('/src/assets/images/center/transfer/exchange@2x.png')" /> -->
              <svg-icon name="exchange" />
            </div>
          </template>
          <template #symbolR>
            <span class="transfer-symbol">{{ user.currencySymbol }}</span>
          </template>
        </Form>
        <el-button type="primary" block style="width: 480px" :loading="transLoading" @click="handleSubmit">{{ $t('确认转账')
        }}</el-button>
      </div>
    </div>
  </div>
  <GameList v-loading="dicts?.platformgameidsv2Loading" :list="dicts?.platformgameidsv2 ?? []"
    :canRefresh="canRefresh" />
</template>

<script setup>
import {
  ref, inject, reactive, watch, onMounted, h, withDirectives, resolveDirective, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { autotrans, trans } from '@/api/center';
import Form from '@/components/Form/index.vue';
import GameList from './components/GameList.vue';
import { priceUnitTransform } from '@/utils/index';

const global = inject('global');
const $store = inject('store');

// $store.dispatch('user/getUserInfo');
$store.dispatch('app/getDict', 'platformgameidsv2');

const { dicts } = $store.state.app;
const { user } = $store.state;

const formRef = ref(null);
const firstOption = { name: global.$t('中心钱包'), game_cate_id: 0 };

const defaultKeys = {
  value: 'id',
  label: 'game_platform_name',
  children: 'platform_list',
  expandTrigger: 'hover',
};

const moneyDirective = resolveDirective('money');
const columns = reactive([
  [
    {
      label: global.$t('中心钱包'),
      type: 'cascader',
      prop: 'from_platform_id',
      props: defaultKeys,
      defaultValue: [firstOption.game_cate_id],
      list: [],
      width: '200px',
      placeholder: 'label',
      slot: 'symbolL',
      'show-all-levels': false,
      renderOption: (item) => `${item.data.name}(${item.data.game_platform_name})`,
      rule: [{
        validator: (rule, value, callback) => {
          const from = value[value.length - 1];
          const toValue = formRef.value.data.to_platform_id;
          const to = toValue[toValue.length - 1];
          if (from === to) {
            if (from === 0) {
              callback(new Error(global.$t('中心钱包之间不能进行转账!')));
            }
            callback(new Error(global.$t('游戏平台间不能进行转账!')));
          } else {
            callback();
          }
        },
        trigger: 'change',
      }],
    },
    { slot: 'arrow' },
    {
      label: '',
      type: 'cascader',
      prop: 'to_platform_id',
      props: defaultKeys,
      list: [],
      width: '200px',
      placeholder: global.$t('账户选择'),
      slot: 'symbolR',
      'show-all-levels': false,
      renderOption: (item) => `${item.data.name}(${item.data.game_platform_name})`,
      rule: [{
        validator: (rule, value, callback) => {
          const to = value[value.length - 1];
          const fromValue = formRef.value.data.from_platform_id;
          const from = fromValue[fromValue.length - 1];
          if (to === from) {
            if (to === 0) {
              callback(new Error(global.$t('中心钱包之间不能进行转账!')));
            }
            callback(new Error(global.$t('游戏平台间不能进行转账!')));
          } else {
            callback();
          }
        },
        trigger: 'change',
      }],
    },
  ],
  {
    label: global.$t('转入金额'),
    type: 'input',
    input: 'number',
    prop: 'money',
    defaultValue: '',
    size: 'big',
    children_prefix: () => h('span', user.currencySymbol),
    placeholder: global.$t('转入金额'),
    rule: [{
      required: true,
      message: global.$t('请输入转入金额'),
      trigger: 'blur',
    }],
  },
]);

function formatList(list) {
  list = JSON.parse(JSON.stringify(list));
  const firstMoney = priceUnitTransform(user.walletInfo.money ?? '0');
  firstOption.game_platform_name = `${firstMoney.money + firstMoney.unit}`;
  // firstOption.game_platform_name = `${firstOption.name}(${firstMoney.money + firstMoney.unit})`;
  list.forEach((item) => {
    item.platform_list.forEach((p) => {
      if (p.game_platform_name === global.$t('全部')) {
        item.platform_list.splice(0, 1);
      }
    });
  });
  list.forEach((item) => {
    const money01 = priceUnitTransform(user.walletInfo[`cate_${item.game_cate_id}_money`] ?? '0');
    item.game_platform_name = `${money01.money + money01.unit}`;
    // item.game_platform_name = `${item.name}(${money01.money + money01.unit})`;
    item.game_platform_id = item.game_cate_id;
    item.platform_list.forEach((child) => {
      const money02 = priceUnitTransform(user.walletInfo[child.money_code] ?? '0');
      child.game_platform_name = `${money02.money + money02.unit}`;
      // child.game_platform_name = `${child.name}(${money02.money + money02.unit})`;
    });
  });

  return [firstOption, ...list].map((item) => ({ id: item.game_cate_id, ...item }));
}

watch(() => dicts?.platformgameidsv2, () => {
  let list = dicts?.platformgameidsv2 ?? [];
  list = formatList(list);
  columns[0][0].list = list;
  columns[0][2].list = list;
}, { immediate: true });

const arrowflip = ref('0deg');

let isFilp = false;
function handleArrowFlip() {
  arrowflip.value = arrowflip.value === '0deg' ? '180deg' : '0deg';
  isFilp = arrowflip.value === '180deg';
}

const isAutoTransfer = ref(0);
watch(() => user.walletInfo, () => {
  isAutoTransfer.value = user.walletInfo.is_auto_trans;
}, { immediate: true });

watch(() => formRef.value?.data?.from_platform_id, (res) => {
  if (formRef.value?.data?.from_platform_id?.[0]) {
    const obj = dicts?.platformgameidsv2?.find((item) => item.game_cate_id === res[0]);
    const pName = obj?.name;
    const cName = obj?.list_data?.find((child) => child.id === res[1])?.name;
    columns[0][0].label = `${pName}/${cName}`;
  } else {
    columns[0][0].label = global.$t('中心钱包');
  }
});
let game_cate_id = 0;
watch(() => formRef.value?.data?.to_platform_id, (res) => {
  if (formRef.value?.data?.to_platform_id?.[0]) {
    game_cate_id = res[0];
    const obj = dicts?.platformgameidsv2?.find((item) => item.game_cate_id === res[0]);
    const pName = obj?.name;
    const cName = obj?.list_data?.find((child) => child.id === res[1])?.name;
    columns[0][2].label = `${pName}/${cName}`;
  } else {
    columns[0][2].label = global.$t('中心钱包');
  }
});

const { run: autoTransferRun, dara: autoData, loading: autoTransferLoading } = useRequest(autotrans, {
  manual: true,
  onError(error) {
    isAutoTransfer.value = 2;
  },
  onSuccess() {
    // 更新store
    global.$store.dispatch('user/getWalletInfo');
  },
});
function changeTransfer() {
  autoTransferRun({
    is_auto_trans: isAutoTransfer.value,
  });
}

const canRefresh = ref(false);
const { run: transRun, loading: transLoading } = useRequest(trans, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('操作成功'));
    canRefresh.value = true;
    formRef.value.data.money = '';
    $store.dispatch('app/getDict', 'platformgameidsv2');
  },
});

function handleSubmit() {
  canRefresh.value = false;
  formRef.value.form.validate((valid) => {
    if (valid) {
      const { to_platform_id, from_platform_id, money } = formRef.value.data;
      const fromValue = from_platform_id[from_platform_id.length - 1];
      const toValue = to_platform_id[to_platform_id.length - 1];
      transRun({
        money,
        game_cate_id,
        from_platform_id: isFilp ? toValue : fromValue,
        to_platform_id: isFilp ? fromValue : toValue,
      });
    } else {
      return false;
    }
  });
}

</script>

<style lang="scss" scoped>
.transfer-wrap {
  position: relative;
  font-size: 14px;
  border-radius: 0 0 10px 10px;
  padding: 30px 28px;
  border: 1px solid var(--border-color-e2e2e2);
  border-top: 0;
  box-sizing: border-box;
  background-color: var(--block-bg-color);

  &-account {
    :deep(.el-input) {
      .el-input__inner {
        height: 60px !important;

        &:hover,
        &:focus {
          border-color: var(--theme-color);
        }
      }

      .el-input__icon {
        height: 60px;
      }
    }
  }

  &-qs {
    display: flex;
    align-items: center;

    .el-icon-question {
      color: var(--theme-color);
      margin-right: 10px;
    }

    >span {
      margin-right: 10px;
      color: var(--font-color-000);
    }
  }

  &-content {
    width: 480px;
    padding-top: 20px;

    .el-form-item {
      &:first-child {
        max-width: 500px;
      }
    }

    &-arrow {
      margin: 0 28px 40px 7px;
      display: flex;
      align-items: center;
      transition: all 0.5s;
      transform: rotate(v-bind(arrowflip));
      cursor: pointer;

      .svg-icon {
        width: 22px;
        height: 22px;
      }
    }
  }

  :deep(.el-cascader) {
    .el-input__inner {
      padding-left: 25px;
    }
  }

  .transfer-symbol {
    position: absolute;
    left: 10px;
    top: 0;
    font-size: 16px;
    color: var(--font-color-000);
    line-height: 60px;
  }
}
</style>
