<template>
  <div class="subordinate-charge-wrap">
    <header>{{ $t('下级代充') }}</header>

    <el-tabs v-model="userType">
      <el-tab-pane
        :label="$t('余额代充')"
        name="depositRecharge"
      />
      <el-tab-pane
        :label="$t('佣金代充')"
        name="commissionRecharge"
      />
    </el-tabs>

    <div class="card-wrap">
      <MoneyCard
        :money="money"
        :text="$t('可用额度')"
      />
    </div>

    <el-radio-group
      v-model="moneyType"
      class="radio-group"
    >
      <el-radio label="member">{{ $t('会员帐号') }}</el-radio>
      <el-radio label="agent">{{ $t('代理帐号') }}</el-radio>
    </el-radio-group>

    <div class="form-wrap">
      <Form
        ref="FormRef"
        :columns="formColumns"
      >
        <template #nameNote>
          <!-- #18927 大陆版不需要,根据子仓库config配置展示汇率 -->
          <p
            class="layout-flex-end form-note"
            v-show="subConfig.isCurrency && showRate"
          >
            <i class="el-icon-warning-outline"></i>
            <span class="note">{{ $t('默认地区：') }}{{ rateData?.region }}&nbsp;{{ $t('货币：') }}{{ rateData?.currency }}&nbsp;{{ $t('实时汇率：') }}{{ rateData?.rate }}</span>
          </p>
        </template>
        <template #moneyNote>
          <p class="layout-flex-end form-note">
            <i class="el-icon-warning-outline"></i>
            <span class="note">{{ $t('100≤单次代充值≤10000，单日限定20万') }}</span>
          </p>
        </template>
        <template #markNote>
          <p class="layout-flex-end form-note">
            <i class="el-icon-warning-outline"></i>
            <span class="note">{{ $t('备注可用通过系统信息发到会员端') }}</span>
          </p>
        </template>
        <template #hiddenInput>
          <input
            type="password"
            hidden
            autocomplete="new-password"
            style="opacity: 0"
          />
        </template>
      </Form>
      <div class="remark-wrap">
        <!--        <el-input type="textarea"-->
        <!--                  v-model="mark"-->
        <!--                  :placeholder="$t('请输入备注，一百字以内')" />-->
        <!--        <div class="max-length">{{mark.length}}/100</div>-->
      </div>
    </div>

    <el-button
      :loading="loading"
      size="large"
      type="primary"
      @click="doDeposit"
    >{{ $t(`提交申请`) }}</el-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  computed, inject, reactive, ref, watch, onMounted,
} from 'vue';
import { useRoute } from 'vue-router';
import Form from '@/components/Form/index.vue';
import { agentdeposite, subrechargerate } from '@/api/agent';
import MoneyCard from '@/views/agent/components/MoneyCard.vue';

const $route = useRoute();

const moneyType = ref('member');
const global = inject('global');
const subConfig = inject('subConfig');
const userType = ref('depositRecharge');
const FormRef = ref(null);
const baseColumns = [
  {
    type: 'input',
    prop: 'username',
    defaultValue: $route?.query?.membername ?? '',
    maxlength: '20',
    placeholder: global.$t('请输入下级账号'),
    slot: 'nameNote',
    rule: [{
      required: true,
      message: global.$t('请输入下级账号'),
      trigger: 'blur',
    }],
    children_prefix: (h) => h('span', { class: 'required-prefix' }, '*'),

  },
  {
    type: 'number',
    prop: 'money',
    maxlength: '20',
    placeholder: global.$t('请输入代充金额'),
    slot: 'moneyNote',
    rule: [{
      required: true,
      message: global.$t('请输入代充金额'),
      trigger: 'blur',
    }],
    children_prefix: (h) => h('span', { class: 'required-prefix' }, '*'),
  },
  {
    type: 'number',
    prop: 'flow',
    maxlength: '20',
    placeholder: global.$t('提款流水倍数'),
    autocomplete: 'off',
    rule: [{
      required: true,
      message: global.$t('请输入提款流水倍数'),
      trigger: 'blur',
    }],
    children_prefix: (h) => h('span', { class: 'required-prefix' }, '*'),
  },
  {
    type: 'password',
    prop: 'pay_password',
    maxlength: '20',
    autocomplete: 'off',
    placeholder: global.$t('支付密码'),
    rule: [{
      required: true,
      message: global.$t('请输入支付密码'),
      trigger: 'blur',
    }],
    children_prefix: (h) => h('span', { class: 'required-prefix' }, '*'),
  },
  {
    type: 'textarea',
    prop: 'mark',
    maxlength: '100',
    slot: 'markNote',
    showWordLimit: true,
    placeholder: global.$t('请输入备注，100字以内'),
    rule: [],
    // slot: 'hiddenInput',
  },
];

const formColumns = computed(() => {
  if (moneyType.value === 'member') {
    return baseColumns;
  }
  const memberForm = [...baseColumns];
  memberForm.splice(2, 1);
  return memberForm;
});
const showRate = ref(false);
watch(() => moneyType.value, (val) => {
  // 切换类型重置表单
  FormRef.value.form.resetFields();
  showRate.value = false;
});

const $store = inject('store');
const { agent } = $store.state;
const money = computed(() => {
  if (userType.value === 'depositRecharge') {
    return agent.userInfo?.money ?? 0;
  }
  return agent.userInfo?.commission_money ?? 0;
});

const { run: rateRun, loading: rateLoading, data: rateData } = useRequest(
  () => subrechargerate({ type: moneyType.value === 'member' ? 1 : 2, username: FormRef?.value?.data?.username }),
  {
    manual: true,
    onSuccess(result) {
      showRate.value = true;
    },
  },
);
// const showRate = computed(() => FormRef?.value?.data?.username);
onMounted(() => {
  watch(() => FormRef?.value?.data?.username, (curVal) => {
    if (curVal) {
      rateRun();
    }
  });
});

const { run: deposit, loading } = useRequest(
  (params) => agentdeposite(params),
  {
    manual: true,
    onSuccess(result) {
      global.$message.success(global.$t('充值成功'));
      global.$store.dispatch('agent/getUserInfo');
      FormRef.value.form.resetFields();
      // global.initForm()
    },
  },
);

const doDeposit = () => {
  // 流水倍数不能为负数
  if (FormRef.value.data.flow < 0) {
    global.$message.error(global.$t('流水倍数不能为负数'));
    return
  }
  // 单次金额限制
  if (FormRef.value.data.money < 100 || FormRef.value.data.money > 10000) {
    global.$message.error(global.$t('单次代充金额不能小于100或大于10000'));
    return
  }
  FormRef.value.form.validate((valid) => {
    if (valid) {
      const formData = FormRef.value.data;
      formData.user_type = moneyType.value === 'member' ? '1' : '2';
      formData.money_type = userType.value === 'depositRecharge' ? '1' : '2';
      deposit(formData);
    } else {
      return false;
    }
  });
};

</script>

<style lang="scss" scoped>
.subordinate-charge-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;
  text-align: left;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin-bottom: 20px;
    text-align: left;
  }

  :deep(.el-radio-group) {
    height: 40px;
    margin-bottom: 22px;
    align-items: center;
    display: flex;
  }

  .form-wrap {
    width: 500px;
  }

  :deep(.el-button) {
    width: 300px;
  }

  :deep(.el-textarea__inner) {
    height: 170px;
  }

  :deep(.el-input__count) {
    bottom: 20px;
  }
}

.remark-wrap {
  position: relative;

  .max-length {
    position: absolute;
    right: 10px;
    bottom: 40px;
  }
}

.foot-note {
  font-size: 14px;
  color: var(--font-color-999);
  margin-top: 5px;
}

.note {
  margin-left: 10px;
}

.card-wrap {
  margin: 30px 30px 20px 0;
}

.form-note {
  margin: 12px 0 0px;
  font-size: 14px;
  color: var(--font-color-999);
  line-height: 1;
}

:deep(.el-tabs__item) {
  color: var(--font-color-0a0a0a);

  &.is-active {
    color: var(--font-color-333);
  }
}

:deep(.el-textarea__inner) {
  height: 170px !important;
}
</style>
