<template>
  <div class="change-password-wrap">
    <header>{{$t('修改密码')}}</header>
    <el-tabs
      v-model="tabSelected"
      @tab-click="tabChange"
    >
      <el-tab-pane
        name="login"
        :label="$t('登录密码')"
      >
        <ChangeLogin />
      </el-tab-pane>
      <el-tab-pane
        name="pay"
        :label="$t('支付密码')"
      >
        <ChangePay :change-type="agent.userInfo?.pay_password ? 'new' : 'change'" />
      </el-tab-pane>
      <el-tab-pane
        name="forgot"
        :label="$t('忘记密码')"
      >
        <ChangeLogin
          :loading="resetLoading"
          :changeType="'new'"
          @reset="handleReset($event)"
          v-if="changeType === 'login'"
        />
        <ChangePay
          :loading="resetLoading"
          :changeType="'new'"
          :code="code"
          @reset="handleReset($event)"
          v-else-if="changeType === 'pay'"
          :showOldPass="false"
        />
        <div
          class="verify-code"
          v-else
        >
          <div class="mobile-wrap">{{$t("绑定手机号")}}:{{agent.userInfo?.mobile??''}}</div>
          <Form
            ref="FormRef"
            :columns="columns"
          >
            <template #getCode>
              <el-button
                class="get-code-btn"
                @click="getCode"
                :disabled="running"
                :loading="getCodeLoading"
              >{{$t(`获取验证码`)}}{{num===60?'':`(${num})`}}</el-button>
            </template>
          </Form>
          <el-button
            @click="doVerify"
            :loading="verifyLoading"
            size="large"
            style="width: 300px"
            type="primary"
          >{{$t('提交验证')}}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  computed, inject, reactive, ref,
} from 'vue';
import { useInterval } from '@/utils/hooks';
import { forgetpasssmscode, forgetpasscode, resetpass } from '@/api/agent';
import Form from '@/components/Form/index.vue';
import ChangeLogin from './ChangeLogin.vue';
import ChangePay from './ChangePay.vue';

const tabSelected = ref('forgot');

const $store = inject('store');
const { agent } = $store.state;

const global = inject('global');

const columns = reactive([
  {
    type: 'input',
    slot: 'getCode',
    prop: 'code',
    placeholder: global.$t('请输入验证码'),
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('请输入验证码'),
    }],
  },
  {
    type: 'select',
    placeholder: global.$t('请选择密码类型'),
    prop: 'changeType',
    list: [
      {
        label: global.$t('登录密码'),
        value: 'login',
      },
      {
        label: global.$t('支付密码'),
        value: 'pay',
      },
    ],
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('请选择密码类型'),
    }],
  },
]);

const FormRef = ref(null);
const num = ref(60);
const changeType = ref(null);
const code = ref('');

const userInfoParams = computed(() => ({
  mobile: agent.userInfo.mobile,
  phone_area_code: agent.userInfo.phone_area_code,
  uid: agent.userInfo.id,
}));
const { run: runInterval, stop: stopInterval, running } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });
const { run: getCode, loading: getCodeLoading } = useRequest(
  () => forgetpasssmscode(userInfoParams.value),
  {
    manual: true,
    onSuccess: () => {
      runInterval();
    },
  },
);

const { run: verifyCode, loading: verifyLoading } = useRequest(
  () => forgetpasscode({
    ...userInfoParams.value,
    code: FormRef.value?.data.code,
  }),
  {
    manual: true,
    onSuccess() {
      changeType.value = FormRef.value?.data.changeType;
      code.value = FormRef.value?.data.code;
    },
  },
);

function doVerify() {
  FormRef.value.form.validate((valid) => {
    if (valid) {
      verifyCode();
    }
  });
}

const { run: resetPassRun, loading: resetLoading } = useRequest(
  (params) => resetpass({
    ...userInfoParams.value,
    ...params,
    code: code.value,
    password_type: changeType.value === 'login' ? '1' : '2',
  }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('修改成功'));
    },
  },
);

function handleReset(event) {
  resetPassRun(event);
}

function tabChange(data) {
  changeType.value = null;
}
</script>

<style lang="scss" scoped>
.change-password-wrap {
  margin-top: 20px;
  border-radius: 6px;
  padding: 30px;
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  text-align: left;

  header {
    font-size: 20px;
    color: var(--font-color-000);
    margin-bottom: 20px;
    text-align: left;
  }
}

:deep(.el-form-item__label) {
  color: var(--font-color-999);
}

.verify-code {
  display: flex;
  flex-direction: column;

  :deep(.config-form-wrap) {
    width: 642px;
    display: inline-block;
  }

  :deep(.el-form-item__content) {
    display: flex;
  }

  :deep(.el-input__inner) {
    width: 500px;
  }

  :deep(.get-code-btn) {
    margin-left: 20px;
  }

  .mobile-wrap {
    margin-bottom: 20px;
  }

  .save-btn {
    width: 120px;
  }
}
:deep(.el-tabs__item) {
  color: var(--font-color-0a0a0a);

  &.is-active {
    color: var(--theme-color);
  }
}
</style>
