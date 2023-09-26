<template>
  <div class="add-bank-wrap">
    <Dialog blockBtn footerBtnWidth="100%" v-model="visible" width="600px" :title="$t('绑定新卡')" :confirmLoading="loading"
      :showCancelBtn="false" :confirmText="$t('确认提交')" :before-close="handleClose" @onConfirm="handleSubmitAddCard"
      contentPadding="0 40px">
      <div class="bank-card-list-wrap-form">
        <Form ref="addBankCardRef" label-position="top" :columns="addBankCardColumns"></Form>
      </div>
      <template #footerTips>
        <p class="tips-text">{{ $t('温馨提示：您最多可绑定4张银行卡，如需修改绑定信息请联系在线客服') }}</p>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  ref, inject, watch, reactive,
} from 'vue';
import Dialog from '@/components/Dialog/index.vue';
import { useInterval } from '@/utils/hooks';
import Form from '@/components/Form/index.vue';
import cityCode from '/src/assets/json/city_code.json';
import BankIcon from '@/views/agent/components/BankIcon.vue';
import { addbankcard } from '@/api/agent';

const global = inject('global');
const $store = inject('store');

defineProps({
  visible: Boolean,
  list: {
    type: Array,
    default: () => [],
  },
});

const { agent } = $store.state;
const addBankCardRef = ref(null);
$store.dispatch('agent/getBankList');

const emit = defineEmits(['close']);
function handleClose() {
  emit('close');
}

const addBankCardColumns = reactive([
  {
    label: global.$t('持卡人姓名'),
    type: 'input',
    prop: 'name',
    maxlength: '20',
    placeholder: global.$t('请输入持卡人姓名'),
    rule: [{
      message: global.$t('请输入持卡人姓名'),
      trigger: 'blur',
      validator(value) {
        if (agent.userInfo?.realname) {
          return true;
        }

        return !!addBankCardRef.value?.data.name;
      },
    }],
  },
  {
    label: global.$t('银行账户'),
    type: 'input',
    prop: 'card_no',
    placeholder: global.$t('请输入银行账户'),
    rule: [{
      required: true,
      message: global.$t('请输入银行账户'),
      trigger: 'blur',
    }, {
      trigger: 'blur',
      type: 'number',
      validator: (rule, value, callback) => {
        // 兼容后端验证 请输入正确的银行卡号长度为10-12位
        const reg = /^(\d{16,19}|\d{10,13}|\d{6,14})$/g;
        if (!reg.test(value)) {
          callback(new Error(global.$t('银行卡号格式不正确！')));
        }
        callback();
      },
    }],
  },
  {
    label: global.$t('选择银行'),
    type: 'select',
    list: [],
    prop: 'bank_id',
    width: '100%',
    value: 'id',
    renderOption: (item, h) => h(
      'div',
      { style: 'display: flex; align-items: center; height: 34px' },
      [
        h(BankIcon, { bankCode: item.icon_code?.toLowerCase() }),
        h('span', { style: { paddingLeft: '5px' } }, item.label),
      ],
    ),
    placeholder: global.$t('请选择银行'),
  },

  {
    label: global.$t('开户分行'),
    type: 'input',
    prop: 'bank_sub_name',
    width: '100%',
    block: true,
    placeholder: global.$t('请输入开户分行'),
    rule: [{
      required: true,
      message: global.$t('请输入开户分行'),
      trigger: 'blur',
    }],
  },
]);

const subConfig = inject('subConfig');
if (subConfig.isBankAreaSelect) {
  addBankCardColumns.splice(3, 0, [
    {
      label: global.$t('开户分行'),
      type: 'select',
      list: cityCode,
      prop: 'province',
      value: 'name',
      width: '100%',
      optionLabel: 'name',
      onChange: cityChange,
      placeholder: global.$t('请选择省份'),
      rule: [{
        required: true,
        message: global.$t('请选择省份'),
        trigger: 'change',
      }],
    },
    {
      type: 'select',
      list: [],
      prop: 'city',
      value: 'name',
      width: '100%',
      optionLabel: 'name',
      placeholder: global.$t('请选择城市'),
      rule: [{
        required: true,
        message: global.$t('请选择城市'),
        trigger: 'change',
      }],
    },
  ]);
} else {
  addBankCardColumns.splice(3, 0, {
    label: global.$t('省份/地区'),
    type: 'input',
    prop: 'province',
    width: '100%',
    block: true,
    placeholder: global.$t('请输入省份/地区'),
    rule: [{
      required: true,
      message: global.$t('请输入省份/地区'),
      trigger: 'blur',
    }],
  });
}

watch(() => agent.userInfo, () => {
  if (agent.userInfo?.realname) {
    addBankCardColumns[0].disabled = true;
    addBankCardColumns[0].defaultValue = agent.userInfo?.realname;
    console.log('addBankCardColumns[0]', addBankCardColumns[0]);
  }
});
watch(() => agent.bankList, () => {
  addBankCardColumns[2].list = agent.bankList.map((item) => ({
    ...item, key: item.id, label: item.name, value: item.id, disabled: item.disabled,
  }));
});

const { run: postAddBankCard, loading } = useRequest(
  (params) => addbankcard(params),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('添加成功！'));
      emit('close');
    },
  },
);

function handleSubmitAddCard(close) {
  addBankCardRef.value.form.validate((valid) => {
    if (valid) {
      const { data } = addBankCardRef.value;
      const name = agent.userInfo?.realname || data.name;
      const params = {
        bank_id: data.bank_id,
        card_no: data.card_no,
        name,
        bank_of_deposit: `${data.province}-${data.city}-${data.bank_sub_name}`,
      };
      postAddBankCard(params);
    } else {
      return false;
    }
  });
}

const num = ref(10);
const { run: runInterval, stop: stopInterval } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });
function getCode() {
  runInterval();
}

function cityChange(name) {
  addBankCardRef.value.data.city = '';
  const targetCity = cityCode.find((item) => item.name === name)?.city ?? [];
  addBankCardColumns[3][1].list = targetCity;
}

</script>

<style lang="scss" scoped>
.add-bank-wrap {
  display: flex;
  flex-wrap: wrap;
  color: var(--font-color-ccc);

  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--border-color-000-1);
  }

  >div {
    display: flex;
    width: calc(50% - 15px);
    background: var(--bg-color-353435);
    padding: 30px;
    border-radius: 6px;
  }

  &-form {
    padding-top: 30px;
  }

  .add-btn {
    font-size: 20px;
    font-weight: normal;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    cursor: pointer;
  }

  .tips-text {
    margin-top: 16px;
    font-size: 12px;
    color: var(--font-color-606266);
    text-align: left;
    height: auto;
  }
}

.bank-card-list-wrap-form {
  margin-top: 20px;
}
</style>
