<template>
  <Dialog
    ref="dialogRef"
    :title="$t('找回登录密码')"
    v-model="modelValue"
    width="1200px"
    append-to-body
    :showBtn="false"
    contentPadding="100px 0 60px"
    customeClass="findPassWord"
    v-bind="$attrs"
  >
    <div class="forget-password-wrap">
      <div class="step-wrap">
        <div :class="['item', step === 1 ? 'finished active' : '']">
          <div class>1</div>
          <span>{{ $t("输入您的账号") }}</span>
        </div>
        <div :class="['line first', step === 2 ? 'active' : '',
        step > 2 ? 'finished' : '',]" />
        <div :class="[
          'item',
          step === 2 ? 'active' : '',
          step > 2 ? 'finished' : '',
        ]">
          <div>2</div>
          <span>{{ $t("身份认证") }}</span>
        </div>
        <div :class="['line second', step === 3 ? 'active' : '']" />
        <div :class="['item', step === 3 ? 'active' : '']">
          <div>3</div>
          <span>{{ $t("重置密码") }}</span>
        </div>
      </div>

      <div
        class="account-form"
        v-if="step === 1"
      >
        <el-form label-width="120px">
          <el-form-item :label="$t('用户名')">
            <el-input
              :placeholder="$t('请输入账号')"
              v-model="username"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div
        class="identity-verify"
        v-if="step === 2"
      >
        <el-form
          :rules="formRules"
          :model="form"
          ref="verifyRef"
          label-width="120px"
        >
          <el-form-item class="method-select">
            <el-select
              v-model="methodType"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in methodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div
            v-if="methodType !== 'question'"
            class="show-info"
          >{{ $t("已绑定") }}{{ methodType === "phone" ? $t('手机') :
          $t('邮箱')
          }}:{{ methodType === "phone" ? userInfo.mobile : userInfo.email }}</div>
          <el-form-item
            v-if="methodType !== 'question'"
            prop="code"
            :label="$t('验证码')"
          >
            <div class="msg-code">
              <el-input
                v-model="form.code"
                :placeholder="$t('请输入验证码')"
              />
              <el-button
                class="get-code-count"
                @click="sendCode"
                :loading="sendSmsCodeLoading || sendEmailCodeLoading"
                :disabled="sendSmsCodeLoading || sendEmailCodeLoading || isCounting"
              >{{ $t("获取验证码") }}{{ isCounting ?
              `(${seconds})` : ""
              }}</el-button>
            </div>
          </el-form-item>
          <el-form-item
            class="nolabel"
            v-if="methodType === 'question'"
          >
            <el-select
              v-model="form.pass_question_id"
              :placeholder="$t('请选择问题')"
            >
              <el-option
                v-for="item in questions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="methodType === 'question'"
            prop="pass_answer"
            :label="$t('密保答案')"
          >
            <el-input
              v-model="form.pass_answer"
              :placeholder="$t('密保答案')"
              class="ansKlass"
            />
          </el-form-item>
        </el-form>
      </div>

      <div
        class="reset-passowrd-wrap"
        v-if="step === 3"
      >
        <Form
          ref="resetRef"
          :columns="resetColumns"
          label-width="120px"
        ></Form>
      </div>

      <el-button
        class="btn"
        :disabled="!username"
        @click="doNext"
        type="primary"
        :loading="usernameLoading || checkSmsCodeLoading || checkEmailCodeLoading || resetPasswordLoading"
      >{{ $t("下一步")
      }}</el-button>
    </div>
    <template #footer>
      <FooterService
        :type="3"
        @unmount="$attrs.unmount"
      />
    </template>
  </Dialog>
</template>

<script setup>
import {

  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import Dialog from './index.vue';
import {
  forgetPassword,
  forgetPassEmailCode,
  forgetPassSmsCode,
  forgetPassEmailCodeCheck,
  forgetPassSmsCodeCheck,
  passQuestion,
  passQuestionCheck,
  forgetPassReset,
} from '@/api/user';
import FooterService from '@/components/FooterService/index.vue';

const step = ref(1);
const dialogRef = ref(null);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  defaultUsername: {
    type: String,
    default: '',
  },
});

const global = inject('global');
const username = ref(props.defaultUsername);
const methodType = ref('');
const seconds = ref(60);
const isCounting = ref(false);
const questions = ref([]);
const methodOptions = ref([
  {
    value: 'phone',
    label: global.$t('手机号'),
  },
  {
    value: 'email',
    label: global.$t('电子邮件'),
  },
  {
    value: 'question',
    label: global.$t('安全问题'),
  },
]);

const resetRef = ref(null);
const resetColumns = reactive([
  {
    label: global.$t('新密码'),
    type: 'password',
    prop: 'password',
    maxlength: '20',
    placeholder: global.$t('输入新密码'),
    rule: [{
      required: true,
      message: global.$t('输入新密码'),
      trigger: 'blur',
    }],
  },
  {
    label: global.$t('确认新密码'),
    type: 'password',
    prop: 'repassword',
    maxlength: '20',
    placeholder: global.$t('确认新密码'),
    rule: [{
      required: true,
      message: global.$t('确认新密码'),
      trigger: 'blur',
    }, {
      message: global.$t('两次输入的密码不一致'),
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const { password } = resetRef.value.data;
        if (password !== value) {
          callback(new Error(global.$t('两次输入的密码不一致！')));
        }
        callback();
      },
    }],
  },
]);

const userInfo = ref({});
const { run: checkUsername, loading: usernameLoading } = useRequest(
  () => forgetPassword({
    username: username.value,
  }),
  {
    manual: true,
    onSuccess(result) {
      if (!result.email && !result.mobile && result.is_pass_answer === 1) {
        global.$message.error(global.$t('由于您未绑定手机号、邮箱，未设置密保问题，请尝试联系客服找回密码'));
        return;
      }
      // bug#19824 未绑定的方式 第二步不提供选项
      const availableMethods = methodOptions.value.filter((ele) => {
        const isPhoneBind = ele.value === 'phone' && result.mobile;
        const isEmailBind = ele.value === 'email' && result.email;
        const isQuestionBind = ele.value === 'question' && result.is_pass_answer > 1;
        return isPhoneBind || isEmailBind || isQuestionBind;
      });
      methodOptions.value = availableMethods;
      methodType.value = availableMethods[0].value;
      userInfo.value = result;
      step.value += 1;
    },
  },
);

const form = reactive({
  code: '',
  pass_question_id: '',
  pass_answer: 'null',
});

const formRules = {
  code: [
    {
      required: true,
      trigger: 'blur',
      message: global.$t('请输入验证码'),
    },
  ],
  pass_answer: [
    {
      required: true,
      trigger: 'blur',
      message: global.$t('请输入答案'),
    },
  ],
};

const interval = 0;

const { run: postSendSmsCode, loading: sendSmsCodeLoading } = useRequest(
  (params) => forgetPassSmsCode(params),
  {
    manual: true,
    onSuccess() {
      isCounting.value = true;
    },
  },
);

const { run: postSendEmailCode, loading: sendEmailCodeLoading } = useRequest(
  () => forgetPassEmailCode({ uid: userInfo.value.id }),
  {
    manual: true,
    onSuccess() {
      isCounting.value = true;
    },
  },
);

async function sendCode() {
  if (isCounting.value) {
    return;
  }

  try {
    if (methodType.value === 'phone') {
      await postSendSmsCode({
        uid: userInfo.value.id,
        /* mobile: '18316022606', */
        /* mobile: userInfo.value.mobile, */
        phone_area_code: userInfo.value.phone_area_code,
      });
    } else if (methodType.value === 'email') {
      await postSendEmailCode();
    }
  } catch (e) { }

  isCounting.value = true;
  seconds.value = 60;
  setInterval(() => {
    seconds.value -= 1;
    if (seconds.value === 0) {
      clearInterval(interval);
      isCounting.value = false;
      seconds.value = 60;
    }
  }, 1000);
}

const { run: checkEmailCode, loading: checkEmailCodeLoading } = useRequest(
  () => forgetPassEmailCodeCheck({ uid: userInfo.value.id, code: form.code }),
  {
    manual: true,
    onSuccess() {
      step.value += 1;
    },
  },
);

const { run: checkSmsCode, loading: checkSmsCodeLoading } = useRequest(
  () => forgetPassSmsCodeCheck({ uid: userInfo.value.id, code: form.code }),
  {
    manual: true,
    onSuccess() {
      step.value += 1;
    },
  },
);

useRequest(() => passQuestion({ uid: userInfo.value.id }), {
  onSuccess(result) {
    questions.value = result;
  },
});

const { run: checkQuestion, loading: checkQuestionLoading } = useRequest(
  () => passQuestionCheck({
    ...form,
    uid: userInfo.value.id,
  }),
  {
    manual: true,
    onSuccess() {
      step.value += 1;
    },
  },
);

watch(
  () => methodType.value,
  () => {
    if (methodType.value === 'phone') {
      form.pass_answer = 'null';
      form.code = '';
    } else if (methodType.value === 'email') {
      form.pass_answer = 'null';
      form.code = '';
    } else {
      form.pass_answer = '';
      form.code = 'null';
      form.pass_question_id = questions.value?.[0].id;
    }
  },
);

const { run: resetPassword, loading: resetPasswordLoading } = useRequest(
  (params) => forgetPassReset(params),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('重置成功！'));
      setTimeout(() => dialogRef.value.closeDialog(), 100);
    },
  },
);

const verifyRef = ref();

function doNext() {
  if (step.value === 1) {
    checkUsername();
  } else if (step.value === 2) {
    verifyRef.value.validate((valid) => {
      if (valid) {
        if (methodType.value === 'phone') {
          checkSmsCode();
        } else if (methodType.value === 'email') {
          checkEmailCode();
        } else {
          checkQuestion();
        }
      }
    });
  } else {
    resetRef.value.form.validate((valid) => {
      const typeList = ['phone', 'email', 'question'];
      if (valid) {
        resetPassword({
          ...form,
          ...resetRef.value.data,
          phone_area_code: userInfo.value.phone_area_code,
          uid: userInfo.value.id,
          type: typeList.indexOf(methodType.value) + 1,
        });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.forget-password-wrap {
  width: 420px;
  margin: 0 auto;

  .el-form {
    :deep() {
      .el-form-item {
        position: relative;
        height: 45px;

        &.nolabel .el-form-item__content {
          margin-left: 0 !important;
        }

        .el-form-item__content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;

          .el-input {
            width: 100%;
          }

          .el-input__inner {
            padding-left: 140px;
          }

          .msg-code {
            position: relative;

            .el-button {
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }
        }
      }

      .el-form-item__label {
        text-align: left;
        line-height: 45px;
        font-size: 18px !important;
        color: var(--forget-label-font-color, var(--font-color-333)) !important;
        font-weight: 500 !important;

        &::before {
          content: none !important;
        }
      }

      .el-input__inner {
        background-color: transparent;
        font-size: 14px;
        padding: 0;
        border: 0 !important;
        border-radius: 0 !important;
        border-bottom: 1px solid var(--border-color-e5e5e5) !important;

        &:focus,
        &:hover {
          border-color: var(--theme-color) !important;
        }
      }

      .el-select {
        .el-input__inner {
          padding-left: 0 !important;
          font-size: 18px;
        }
      }

      .method-select .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}

:deep(.login-dialog-footerTips) {
  span {
    color: var(--forget-label-font-color, var(--font-color-333));
  }
}

.step-wrap {
  position: relative;
  width: 420px;
  display: flex;
  margin: 0 auto 35px;
  justify-content: space-between;

  .line {
    border-top: 2px var(--border-color-e5e5e5) dashed;
    width: 115px;
    position: absolute;
    top: 25px;
    z-index: 1;

    &.active,
    &.finished {
      border-top-color: var(--border-color-666);
    }

    &.first {
      left: 70px;
    }

    &.second {
      left: 235px;
    }
  }

  .item {
    margin-right: 50px;
    text-align: center;
    width: 88px;
    position: relative;
    z-index: 2;

    &.active {
      color: var(--font-color-fff);

      >div {
        color: var(--font-color-fff);
        border-color: var(--theme-color);
        background: var(--theme-color);
      }

      >span {
        color: var(--theme-color);
      }
    }

    &:last-child {
      margin-right: 0;
    }

    >div {
      border: 2px solid var(--border-color-6c6c6c);
      border-radius: 100%;
      width: 48px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 26px;
      background: var(--bg-color-353435);
      color: var(--font-color-bcbcbc);
      margin: 0 auto 15px;
    }

    >span {
      font-size: 14px;
      color: var(--font-color-666);
    }
  }
}

.account-form {
  :deep(.el-input__inner) {
    border: 0;

    &:hover,
    &:focus {
      border: 0;
    }
  }
}

.btn {
  color: var(--font-color-fff);
  background-color: var(--theme-color);
  width: 420px;
  display: block;
  margin: 0 auto;
}

.identity-verify {
  .show-info {
    font-size: 14px;
    padding-bottom: 15px;
    color: var(--font-color-999);

    span {
      color: var(--font-color-525152);
    }
  }

  :deep(.el-select) {
    width: 100%;
  }

  .msg-code {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-input {
      width: 170px;
      margin-right: 10px;
      flex: 1;

      .el-input__inner {
        border-bottom: 0;
      }
    }

    .get-code {
      width: 120px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      text-align: center;
      border: 1px solid var(--theme-color);
      color: var(--theme-color);
      cursor: pointer;
      height: 50px;
    }

    .get-code-count {
      background-color: transparent;
      color: var(--theme-color);
      border-radius: 4px !important;
      height: 45px;
      width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0;

      span {
        color: var(--theme-color) !important;
      }
    }
  }
}

.reset-passowrd-wrap {
  :deep(.el-input__inner) {
    border: 0;
  }
}
</style>
