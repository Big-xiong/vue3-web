<template>
  <div
    v-loading="user.loginLoading"
    class="bank-card-list-wrap"
    :class="isCenter ? 'isCenter' : ''"
  >
    <div
      class="ank-card-list-wrap-item"
      v-for="(item, index) in list"
      :key="item.id"
      :class="activeBank === index ? 'active' : ''"
      @click="chooseBank(item, index)"
      :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/bank-icon/bank_${item.icon_code?.toLowerCase()}_bg.png`, `bank_ty_bg`)})` }"
    >
      <div class="select-bank">
        <div>
          <img
            :src="$getSrc(`/src/assets/images/bank-icon/bank_${item.icon_code?.toLowerCase()}_logo.png`, `Default`)"
          />
        </div>
        <span>{{ $t(item.bank_name) }}</span>
      </div>
      <template v-if="!isList">
        <p>{{ `**** **** **** ${item.card_no.substr(-4)}` }}</p>
        <p>{{ `**${item.name.substr(1)}` }}</p>
      </template>
      <p v-else>{{ $t('尾号') }}{{ item.card_no.substr(-4) }}</p>
    </div>
    <div v-if="addBankCardBtnVisible" class="add-btn" @click="addBankCardVisible = true">
      <i class="el-icon-plus" />
      {{ $t('添加银行卡') }}
    </div>
    <Dialog
      blockBtn
      titleBottomBorder
      v-model="addBankCardVisible"
      @close="addBankCardVisible = false"
      width="600px"
      :title="$t('绑定新卡')"
      :showCancelBtn="false"
      :confirmText="$t('确认提交')"
      :confirmLoading="addBankCardLoading"
      @onConfirm="handleSubmitAddCard"
      footerBtnWidth="100%"
      contentPadding="20px 40px 0"
    >
      <div class="bank-card-list-wrap-form">
        <Form ref="addBankCardRef" label-position="top" :columns="addBankCardColumns" />
      </div>
      <template #footerTips>
        <p class="tips-text">{{ $t('温馨提示：您最多可绑定4张银行卡，如需修改绑定信息请联系在线客服') }}</p>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {
  ref, inject, watch, reactive, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import cityCode from '/src/assets/json/city_code.json';
import { addbankcard } from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';

const activeBank = ref(0);

const global = inject('global');
const $store = inject('store');

const { user } = $store.state;

$store.dispatch('app/getDict', ['allbanklist']);

const props = defineProps({
  max: {
    type: Number,
    default: 4,
  },
  list: {
    type: Array,
    default: () => [],
  },
  isList: {
    type: Boolean,
    default: false,
  },
  isCenter: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['activeBank']);
const addBankCardBtnVisible = computed(() => !user.loginLoading && props.max > props.list.length);
const isRealname = computed(() => user.userInfo.realname);

const addBankCardColumns = reactive([
  {
    label: global.$t('持卡人姓名'),
    type: 'input',
    prop: 'name',
    maxlength: '20',
    defaultValue: isRealname,
    placeholder: global.$t('请输入持卡人姓名'),
    disabled: isRealname,
    rule: [{
      required: true,
      message: global.$t('请输入持卡人姓名'),
      trigger: 'blur',
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
    optionLabel: 'name',
    renderOption: (item, h) => {
      const path = '/src/assets/images/bank-icon/';
      return h('div', {
        class: 'select-bank',
      }, [
        h('div', null, h('img', {
          src: global.$getSrc(`${path}bank_${item.icon_code?.toLowerCase()}_logo.png`, `Default`),
          onError: (e) => {
            e.target.src = global.$getSrc(`${path}Default.png`);
            e.onerror = null;
          },
        })),
        h('span', {
          style: {
            paddingLeft: '5px',
            fontWeight: 'bold',
          },
        }, item.label),
      ]);
    },
    placeholder: global.$t('请选择银行'),
    rule: [{
      required: true,
      message: global.$t('请选择银行'),
      trigger: 'change',
    }],
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

const { dicts } = $store.state.app;

watch(() => dicts.allbanklist, () => {
  addBankCardColumns[2].list = dicts?.allbanklist?.map((item) => ({
    ...item, key: item.id, label: item.name, value: item.id, disabled: item.disabled,
  }));
}, { immediate: true });

watch(() => user.userInfo, () => {
  const target = addBankCardColumns[0];
  const name = user.userInfo.realname;
  target.disabled = !!name;
  target.defaultValue = name;
});

const addBankCardRef = ref(null);
const addBankCardVisible = ref(false);

const { run: addBankCardRun, loading: addBankCardLoading } = useRequest(addbankcard, {
  manual: true,
  onSuccess() {
    addBankCardVisible.value = false;
    global.$message.success(global.$t('添加成功'));
    $store.dispatch('user/updateUserInfo');
  },
});

function handleSubmitAddCard(close) {
  addBankCardRef.value.form.validate((valid) => {
    if (valid) {
      const {
        name, bank_id, bank_sub_name, card_no, province, city,
      } = addBankCardRef.value.data;
      addBankCardRun({
        name,
        bank_id,
        card_no,
        bank_of_deposit: `${province}-${city}-${bank_sub_name}`,
      });
    } else {
      return false;
    }
  });
}

function cityChange(name) {
  addBankCardRef.value.data.city = '';
  const targetCity = cityCode.find((item) => item.name === name)?.city ?? [];
  addBankCardColumns[3][1].list = targetCity;
}

function chooseBank(item, index) {
  if (props.isList) activeBank.value = index; emit('activeBank', item);
}
</script>

<style lang="scss">
.select-bank {
  display: flex;
  align-items: center;

  > div {
    background: var(--cur-bg-color-fff, var(--bg-color-fff));
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;

    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
.bank-card-list-wrap {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  color: var(--font-color-fff);

  > div {
    display: flex;
    flex-direction: column;
    width: 400px;
    background: var(--bg-color-ececec);
    padding: 15px 30px 10px;
    margin-bottom: 20px;
    border-radius: 6px;
    box-sizing: border-box;
    background-size: 100% 100%;
    margin-right: 22px;
  }

  .add-btn {
    font-size: 18px;
    font-weight: normal;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    box-sizing: content-box;
    cursor: pointer;
    color: var(--font-color-000);
    background-color: var(--dark-bg-color-232323, #ececec);

    &:hover {
      color: var(--theme-color);
    }

    i {
      font-size: 14px;
      margin-right: 5px;
    }
  }

  p {
    margin: 10px 0;
  }

  .tips-text {
    font-size: 12px;
    color: var(--font-color-606266);
    text-align: left;
    height: auto;
    margin-top: 20px;
  }

  &.isCenter .el-form {
    :deep() {
      .el-input__inner {
        background-color: transparent;
        border-color: var(--border-color-000-1);
      }
    }
  }
}

.select-bank {
  span {
    font-weight: bold;
  }
}
</style>
