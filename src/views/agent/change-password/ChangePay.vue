<template>
  <div class="change-pay-wrap">
    <template v-if="showOldPass">
      <div class="input-wrapper" v-if="agent.userInfo?.pay_password">
        <div class="label">{{ $t('输入原密码') }}</div>
        <PasswordInput v-model="data.old_password" :clear="clear" ref="pwd1" />
      </div>
    </template>
    <div class="input-wrapper">
      <div class="label">{{ agent.userInfo?.pay_password ? $t('新密码') : $t('请输入6为纯数字的资金密码') }}</div>
      <PasswordInput v-model="data.password" :clear="clear" ref="pwd2" />
    </div>
    <div class="input-wrapper">
      <div class="label">{{ $t('确认密码') }}</div>
      <PasswordInput v-model="data.repassword" :clear="clear" ref="pwd3" />
    </div>

    <el-button type="primary" size="large" :loading="loading || setLoading" @click="doChange">{{ $t('确认修改') }}
    </el-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {

  inject, reactive, watch, ref, computed,
} from 'vue';
import { setpaypass, resetpass } from '@/api/agent';
import PasswordInput from '../components/PasswordInput.vue';

const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;

const props = defineProps({
  loading: Boolean,
  code: String,
  changeType: {
    type: String,
    default: 'change',
  },
  showOldPass: {
    type: Boolean,
    default: true,
  },
});

const data = reactive({
  password: '',
  old_password: '',
  repassword: '',
});

watch(() => data.password, () => console.log(data.password));

const { run: changePassword, loading: setLoading } = useRequest(
  () => setpaypass(data),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('密码修改成功'));
      global.$store.dispatch('agent/getUserInfo');
      data.password = '';
      data.old_password = '';
      data.repassword = '';
    },
  },
);

const userInfoParams = computed(() => ({
  mobile: agent.userInfo.mobile,
  phone_area_code: agent.userInfo.phone_area_code,
  uid: agent.userInfo.id,
}));
const { run: resetPassRun, loading: resetLoading } = useRequest(
  (params) => resetpass({
    ...userInfoParams.value,
    code: props?.code,
    password: data.password,
    repassword: data.repassword,
    password_type: '2',
  }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('修改成功'));
    },
  },
);

const pwd1 = ref(null);
const pwd2 = ref(null);
const pwd3 = ref(null);
const clear = ref(false);
function doChange() {
  if (!props.showOldPass) {
    console.log(props?.code);
    resetPassRun();
    // $emit('handleReset', data);
  } else {
    changePassword();
  }
  // changePassword();
  clear.value = true;
}
</script>

<style lang="scss" scoped>
.input-wrapper {
  margin-bottom: 20px;
}

.label {
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--font-color-000);
}

.save-btn {
  margin-top: 20px;
}
</style>
