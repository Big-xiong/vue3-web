<template>
  <div class="transfer-wrap">
    <div class="transfer-wrap-content">
      <Form :columns="columns" ref="formRef" label-position="top">
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
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, reactive, watch, h, resolveDirective, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { trans } from '@/api/center';
import Form from '@/components/Form/index.vue';
import { priceUnitTransform } from '@/utils/index';

const global = inject('global');
const $store = inject('store');

// $store.dispatch('user/getUserInfo');
$store.dispatch('app/getDict', 'platformgameidsv2');

const { dicts } = $store.state.app;
const { user } = $store.state;

const formRef = ref(null);
const firstOption = { name: global.$t('中心钱包'), game_cate_id: 0 };
const moneyDirective = resolveDirective('money');

const defaultKeys = {
  value: 'id',
  label: 'game_platform_name',
  children: 'platform_list',
  expandTrigger: 'hover',
};
let allMoney = 0;
const columns = reactive([
  [
    {
      label: global.$t('中心钱包'),
      type: 'cascader',
      prop: 'from_platform_id',
      props: defaultKeys,
      defaultValue: [firstOption.game_cate_id],
      list: [],
      width: '240px',
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
      label: global.$t('中心钱包'),
      type: 'cascader',
      prop: 'to_platform_id',
      props: defaultKeys,
      defaultValue: [firstOption.game_cate_id],
      list: [],
      width: '240px',
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
    children_prefix: () => h('span', { class: 'symbol' }, user.currencySymbol),
    children_suffix: () => h('span', { class: 'all-money', onclick: setAllMoney }, global.$t('全部')),
    placeholder: global.$t('转入金额'),
    rule: [{
      required: true,
      message: global.$t('请输入转入金额'),
      trigger: 'blur',
    }],
  },
]);

function formatList(list) {
  let maxMoney = 0;
  let maxMoneyId = '';
  let maxCateId = '';
  list = JSON.parse(JSON.stringify(list));
  const firstMoney = priceUnitTransform(user.walletInfo.money ?? '0');
  firstOption.game_platform_name = `${firstMoney.money + firstMoney.unit}`;

  // firstOption.game_platform_name = `${user.walletInfo.money}`;
  list.forEach((item) => {
    item.platform_list.forEach((p) => {
      if (p.game_platform_name === global.$t('全部')) {
        item.platform_list.splice(0, 1);
      }
    });
  });
  list.forEach((item) => {
    const money01 = priceUnitTransform(user.walletInfo[`cate_${item.game_cate_id}_money`] ?? '0.00');
    item.game_platform_name = `${money01.money + money01.unit}`;

    // item.game_platform_name = `${}`;
    item.game_platform_id = item.game_cate_id;
    item.platform_list.forEach((child) => {
      const money02 = priceUnitTransform(user.walletInfo[child.money_code] ?? '0');
      child.game_platform_name = `${money02.money + money02.unit}`;

      // child.game_platform_name = `${}`;
      if (user.walletInfo[child.money_code] > maxMoney) {
        maxMoneyId = child.id;
        maxCateId = item.game_cate_id;
        maxMoney = user.walletInfo[child.money_code];
        allMoney = maxMoney;
      }
    });
  });

  return [[firstOption, ...list].map((item) => ({ id: item.game_cate_id, ...item })), maxMoneyId, maxCateId];
}

watch(() => [dicts?.platformgameidsv2, user?.walletInfo], () => {
  const _list = dicts?.platformgameidsv2 ?? [];
  const [list, maxMoneyId = 0, maxCateId = 0] = formatList(_list);
  columns[0][0].list = list;
  columns[0][2].list = list;
  if (formRef?.value?.data?.from_platform_id) {
    formRef.value.data.from_platform_id = [maxCateId, maxMoneyId];
  }
}, { immediate: false });

onMounted(() => {
  watch(() => formRef.value?.data?.from_platform_id, (res) => {
    if (formRef.value?.data?.from_platform_id[0]) {
      const obj = dicts?.platformgameidsv2?.find((item) => item.game_cate_id === res[0]);
      const pName = obj?.name;
      const cName = obj?.list_data?.find((child) => child.id === res[1])?.name;
      columns[0][0].label = `${pName}/${cName}`;
    } else {
      columns[0][0].label = global.$t('中心钱包');
    }
  });
  watch(() => formRef.value?.data?.to_platform_id, (res) => {
    if (formRef.value?.data?.to_platform_id[0]) {
      const obj = dicts?.platformgameidsv2?.find((item) => item.game_cate_id === res[0]);
      const pName = obj?.name;
      const cName = obj?.list_data?.find((child) => child.id === res[1])?.name;
      columns[0][2].label = `${pName}/${cName}`;
    } else {
      columns[0][2].label = global.$t('中心钱包');
    }
  });
});

const arrowflip = ref('0deg');

let isFilp = false;
function handleArrowFlip() {
  arrowflip.value = arrowflip.value === '0deg' ? '180deg' : '0deg';
  isFilp = arrowflip.value === '180deg';
}

const { run: transRun, loading: transLoading } = useRequest(trans, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('操作成功'));
    formRef.value.data.money = '';
  },
});

function handleSubmit(cb) {
  formRef.value.form.validate((valid) => {
    if (valid) {
      const { to_platform_id, from_platform_id, money } = formRef.value.data;
      const fromValue = from_platform_id[from_platform_id.length - 1];
      const toValue = to_platform_id[to_platform_id.length - 1];
      transRun({
        money,
        from_platform_id: isFilp ? toValue : fromValue,
        to_platform_id: isFilp ? fromValue : toValue,
      }).then(() => {
        cb?.();
      });
    } else {
      return false;
    }
  });
}

function setAllMoney() {
  formRef.value.data.money = Math.floor(allMoney);
}

defineExpose({
  handleSubmit,
});
</script>

<style lang="scss" scoped>
.transfer-wrap {
  position: relative;
  font-size: 14px;
  // border-radius: 0 0 10px 10px;
  // padding: 30px 28px;
  // border: 1px solid var(--border-color-e2e2e2);
  // border-top: 0;
  box-sizing: border-box;

  &-qs {
    display: flex;
    align-items: center;

    .el-icon-question {
      color: var(--theme-color);
      margin-right: 10px;
    }

    >span {
      margin-right: 10px;
    }
  }

  &-content {
    // width: 480px;
    padding-top: 20px;

    .el-form-item {
      &:first-child {
        max-width: 550px;
      }
    }

    &-arrow {
      margin: 0 28px 30px 7px;
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
    line-height: 45px;
  }
}
</style>

<style>
.all-money {
  position: relative;
  left: -8px;
  top: 3px;
  color: var(--theme-color);
  cursor: pointer;
}

.symbol {
  position: relative;
  left: 8px;
  top: 3px;
  color: var(--font-color-000);
}
</style>
