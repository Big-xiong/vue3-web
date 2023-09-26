<template>
  <div class="account-settings-wrap">
    <Form ref="accountRef" label-position="top" :columns="accountColumns">
      <template #rightSlot>
        <span class="el-select-prefix el-icon-plus"></span>
        <el-input
          :disabled="user.userInfo?.is_valid_mobile === 2"
          class="form-phone-input"
          v-model="tel"
          :placeholder="$t('请输入手机号')"
        ></el-input>
        <el-tag
          size="mini"
          :type="user?.userInfo?.is_valid_mobile === 2 ? 'success' : 'danger'"
          effect="dark"
          v-if="user?.userInfo?.mobile"
        >{{ (user?.userInfo?.mobile === tel && user?.userInfo?.is_valid_mobile === 2) ? $t('已验证') : $t('未验证') }}</el-tag>
        <template v-if="user?.userInfo?.mobile">
          <el-button
            @click="getCode('mobile')"
            :loading="smsLoading"
            :disabled="running"
            v-if="showCodeBut || user?.userInfo?.is_valid_mobile !== 2"
          >{{ $t(`获取验证码`) }}{{ num === 60 ? '' : `(${num})` }}</el-button>
          <el-button
            v-else-if="!showCodeBut && user.userInfo.is_valid_mobile !== 2"
            @click="edit"
          >{{ $t('修改') }}</el-button>
          <div class="form-phone-code" v-if="showCodeBut || user?.userInfo?.is_valid_mobile !== 2">
            <el-input v-model="mobileCode" class="form-phone-input" :placeholder="$t('请输入验证码')"></el-input>
            <el-button
              @click="bindingCode('mobile')"
              :disabled="!mobileCode"
              :loading="bindLoading"
            >{{ $t('绑定') }}</el-button>
          </div>
        </template>
      </template>

      <template #emailSlot>
        <el-tag
          size="mini"
          :type="user?.userInfo?.is_valid_email === 2 ? 'success' : 'danger'"
          effect="dark"
          v-if="user?.userInfo?.email"
        >{{ user?.userInfo?.is_valid_email === 2 ? $t('已验证') : $t('未验证') }}</el-tag>

        <el-button
          @click="getCode('email')"
          v-if="showEmailBut || (user?.userInfo?.is_valid_email !== 2 && user?.userInfo?.email)"
          :loading="emailLoading"
          :disabled="emailRunning"
        >{{ $t(`获取验证码`) }}{{ emailnNum === 60 ? '' : `(${emailnNum})` }}</el-button>

        <el-button
          v-else-if="user?.userInfo?.email && user?.userInfo.is_valid_email !== 2"
          @click="editEmail"
        >{{ $t('修改') }}</el-button>
        <div
          class="form-phone-code"
          v-if="(user?.userInfo?.is_valid_email !== 2 && user?.userInfo?.email) || showEmailBut"
        >
          <el-input class="form-phone-input" v-model="codeForEmail" :placeholder="$t('请输入验证码')"></el-input>
          <el-button
            :disabled="!codeForEmail"
            :loading="bindEmailLoading"
            @click="bindingCode('email')"
          >{{ $t('绑定') }}</el-button>
        </div>
      </template>
    </Form>
    <el-button
      style="width: 300px;"
      type="primary"
      @click="saveProfile"
      :loading="saveLoading"
    >{{ $t(`保存`) }}</el-button>
  </div>
</template>

<script setup>
import {
  ref, inject, reactive, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useInterval } from '@/utils/hooks';
import {
  updateProfile, smscode, bindmobile, setemail, bindemail,
} from '@/api/center';
import Form from '@/components/Form/index.vue';

const accountRef = ref(null);
const tel = ref('');
const mobileCode = ref('');
const codeForEmail = ref('');
const global = inject('global');
const $store = inject('store');

const { user } = $store.state;

$store.dispatch('app/getDict', 'phoneareav3');

const showCodeBut = ref(false);
function edit() {
  showCodeBut.value = !showCodeBut.value;
}

const showEmailBut = ref(false);
function editEmail() {
  showEmailBut.value = !showEmailBut.value;
}

const accountColumns = reactive([
  {
    label: global.$t('真实姓名'),
    type: 'input',
    prop: 'realname',
    width: '500px',
    placeholder: global.$t('请输入真实姓名'),
    rule: [{
      required: true,
      message: global.$t('请输入真实姓名！'),
      trigger: 'blur',
    }],
  },
  {
    label: global.$t('出生日期'),
    type: 'date-picker',
    'date-picker': 'date',
    prop: 'birthday',
    width: '500px',
    disabled: !!user.userInfo?.birthday,
    placeholder: global.$t('请输入出生日期'),
  },
  {
    label: global.$t('手机号'),
    placeholder: global.$t('手机号'),
    prop: 'phone_area_code',
    type: 'select',
    disabled: user.userInfo?.is_valid_mobile === 2,
    list: [],
    value: 'key',
    class: 'form-phone-select',
    'popper-append-to-body': false,
    'show-arrow': false,
    prefix: 'el-icon-plus',
    renderOption: (item, h) => h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
    slot: 'rightSlot',
    rule: [{
      required: false,
    }],
  },
  {
    label: global.$t('邮箱地址'),
    type: 'input',
    block: true,
    width: '500px',
    placeholder: global.$t('请输入邮箱'),
    slot: 'emailSlot',
    prop: 'email',
    class: 'form-email-content',
    disabled: user.userInfo?.is_valid_email === 2,
    rule: [{
      required: true,
      message: global.$t('请输入邮箱'),
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (!reg.test(value)) {
          callback(new Error(global.$t('邮箱格式不正确！')));
        }
        callback();
      },
    }],
  },
  {
    label: 'Facebook',
    type: 'input',
    prop: 'facebook',
    width: '500px',
    placeholder: global.$t('请输入Facebook'),
  },
  {
    label: 'WhatsApp',
    type: 'input',
    prop: 'whatsapp',
    width: '500px',
    placeholder: global.$t('请输入WhatsApp'),
  },
  {
    label: 'Skype',
    type: 'input',
    prop: 'skype',
    width: '500px',
    placeholder: global.$t('请输入Skype'),
  },
]);

// watch(() => user.userInfo, () => {
//   accountColumns[2].disabled = user?.userInfo?.is_valid_mobile === 2;
// }, { immediate: true });

const { dicts } = $store.state.app;

// 根据地区显示不同的联系方式项
watch(() => user.userInfo?.inte_region_id, () => {
  if (user.userInfo.inte_region_id === 2) {
    const item = {
      label: global.$t('Line'),
      type: 'input',
      prop: 'line',
      width: '500px',
      placeholder: global.$t('请输入Line'),
    };
    accountColumns.push(item);
  }
  if (user.userInfo.inte_region_id === 3) {
    const item = {
      label: global.$t('Zalo'),
      type: 'input',
      prop: 'zalo',
      width: '500px',
      placeholder: global.$t('请输入Zalo'),
    };
    accountColumns.push(item);
  }
}, { immediate: true });

// form赋值
onMounted(() => {
  watch(() => [user.userInfo, dicts.phoneareav3], () => {
    accountColumns[2].list = dicts.phoneareav3?.map((item) => ({
      key: item.split('-')[2],
      label: item.split('-')[2],
      value: item.split('-')[1],
    }));
    initData();
  }, { immediate: true });
});

const inteContact = ref(null);
function initData() {
  const {
    realname = '',
    qq = '',
    wechat = '',
    mobile = '',
    email = '',
    phone_area_code = '',
    birthday = '',
    currency,
    is_valid_email = '',
    inte_contact = '{}',
  } = user?.userInfo;

  inteContact.value = JSON.parse(inte_contact);
  accountColumns[0].disabled = !!realname;
  accountColumns[1].disabled = !!birthday;

  if (accountRef?.value?.data) {
    tel.value = mobile;
    accountRef.value.data.realname = realname;
    accountRef.value.data.line = inteContact?.value?.line?.account;
    accountRef.value.data.zalo = inteContact?.value?.zalo?.account;
    accountRef.value.data.skype = inteContact?.value?.skype?.account;
    accountRef.value.data.facebook = inteContact?.value?.facebook?.account;
    accountRef.value.data.whatsapp = inteContact?.value?.whatsapp?.account;
    accountRef.value.data.mobile = mobile;
    accountRef.value.data.email = email;
    accountRef.value.data.birthday = birthday;
    accountRef.value.data.phone_area_code = phone_area_code ? (phone_area_code.indexOf('+') !== -1 ? phone_area_code.split('+')[1] : phone_area_code) : accountColumns[2]?.list?.[0]?.label;
  }
  if (currency === 'vnd') {
    accountColumns.forEach((item, index) => {
      if (['facebook', 'whatsapp', 'skype'].includes(item.prop)) {
        delete accountColumns[index];
      }
    });
  }
}

// 获取验证码
const num = ref(60);
const emailnNum = ref(60);
const { run: runInterval, stop: stopInterval, running } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });
const { run: runEmailInterval, stop: stopEmailInterval, running: emailRunning } = useInterval(() => {
  emailnNum.value -= 1;
  if (emailnNum.value === 0) {
    stopEmailInterval();
    emailnNum.value = 60;
  }
}, 1000, { manual: true });
const { run: smsRun, loading: smsLoading } = useRequest(smscode, {
  manual: true,
  onSuccess: () => {
    runInterval();
  },
});
const { run: emailRun, loading: emailLoading } = useRequest(() => setemail(accountRef?.value?.data), {
  manual: true,
  onSuccess: () => {
    runEmailInterval();
  },
});
function getCode(name) {
  if (name === 'mobile') {
    accountRef.value.data.mobile = tel.value;
    smsRun(accountRef.value.data);
  } else if (name === 'email') {
    emailRun();
  }
}

// 绑定手机号
const { run: bindRun, loading: bindLoading } = useRequest(bindmobile, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('手机号绑定成功!'));
    $store.dispatch('user/getUserInfo');
  },
});
// 绑定邮箱
const { run: bindEmailRun, loading: bindEmailLoading } = useRequest(bindemail, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('邮箱绑定成功!'));
    $store.dispatch('user/getUserInfo');
  },
});
function bindingCode(name) {
  const { mobile, phone_area_code, email } = accountRef.value.data;

  if (name === 'mobile') {
    bindRun({ mobile, phone_area_code, code: mobileCode.value });
  } else if (name === 'email') {
    bindEmailRun({ email, code: codeForEmail.value });
  }
}

// 保存
const { run: saveRun, loading: saveLoading } = useRequest((params) => updateProfile(params), {
  manual: true,
  onSuccess: () => {
    global.$message.success(global.$t('信息保存成功！'));
    $store.dispatch('user/getUserInfo');
  },
});
function saveProfile() {
  accountRef.value.form.validate((valid) => {
    if (valid) {
      accountRef.value.data.mobile = tel.value;
      const params = accountRef.value.data;
      // const contact = {
      //   line: accountRef.value.data.line,
      //   zalo: accountRef.value.data.zalo,
      //   whatsapp: accountRef.value.data.whatsapp,
      //   skype: accountRef.value.data.skype,
      //   facebook: accountRef.value.data.facebook,
      // };
      const contact = {
        line: {
          account: accountRef.value.data.line,
          is_bind: inteContact.value?.line?.is_bind ?? 2,
        },
        zalo: {
          account: accountRef.value.data.zalo,
          is_bind: inteContact.value?.zalo?.is_bind ?? 2,
        },
        whatsapp: {
          account: accountRef.value.data.whatsapp,
          is_bind: inteContact.value?.whatsapp?.is_bind ?? 2,
        },
        skype: {
          account: accountRef.value.data.skype,
          is_bind: inteContact.value?.skype?.is_bind ?? 2,
        },
        facebook: {
          account: accountRef.value.data.facebook,
          is_bind: inteContact.value?.facebook?.is_bind ?? 2,
        },
      };
      delete params.line;
      delete params.zalo;
      delete params.whatsapp;
      delete params.skype;
      delete params.facebook;
      params.inte_contact = JSON.stringify(contact);
      saveRun(params);
    } else {
      return false;
    }
  });
}
</script>

<style lang="scss" scoped>
.account-settings-wrap {
  font-size: 14px;

  .el-form {
    :deep(.form-phone-select) {
      width: 90px;
      .el-input__inner {
        padding-right: 0;
      }
    }
    .el-select-prefix {
      position: absolute;
      left: 10px;
      top: 16px;
      color: var(--font-color-ccc);
    }

    :deep(.el-form-item__label)::before {
      content: none;
    }

    :deep(.el-form-item.is-required) {
      .el-form-item__content {
        flex-wrap: wrap;
      }
    }

    .form-phone-code {
      margin-top: 20px;

      .form-phone-input {
        :deep(.el-input__inner) {
          border-radius: 6px;
        }
      }
    }

    .el-button {
      margin-left: 10px;
    }

    .form-phone-input {
      width: 412px;
      :deep(.el-input__inner) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .el-tag {
      border-radius: 20px;
      position: absolute;
      right: 455px;
      top: 13px;
      color: var(--font-color-fff);
    }
  }
}
</style>
