<template>
  <div class="validateIdentity-wrap">
    <Dialog
      ref="dialog"
      :title="$t('身份验证')"
      v-model="showValidateDia"
      center
      :showCancelBtn="false"
      blockBtn
      :confirmText="$t('确定')"
      @onConfirm="save"
      @onClose="onClose"
      :loading="saveLoading"
      footerBtnWidth="400px"
      @close="closeDia"
      contentPadding="0 40px"
    >
      <!-- <p class="dialog-tips">{{ $t('忘记密码验证能够更加让您的资金有安全保障，若您忘记资金密码可以') }}<span @click="$openKefu">{{ $t('联系专属客服')
      }}</span></p> -->
      <div class>
        <el-select v-model="dataObj.type" :popper-append-to-body="false" :placeholder="$t('请选择')" style="width: 100%">
          <el-option v-for="item in dataObj.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="dataObj.type === 1" class="validateIdentity-wrap-label">
          <span>{{ $t('已绑定手机') }}:</span>
          <span>{{ user?.userInfo?.mobile ?? '' }}</span>
        </div>
        <div v-if="dataObj.type === 2" class="validateIdentity-wrap-label">
          <span>{{ $t('已绑定邮箱') }}:</span>
          <span>{{ user?.userInfo?.email ?? '' }}</span>
        </div>
        <div v-if="dataObj.type === 3" class="validateIdentity-wrap-label">
          <span>{{ $t('密保问题') }}:</span>
          <span>{{ questions && questions[6 - dataObj.ruleForm.pass_question_id]?.name }}</span>
        </div>
        <el-input v-if="dataObj.type === 3" v-model="dataObj.ruleForm.pass_answer" :placeholder="$t('密保答案')" />
        <div v-if="dataObj.type !== 3" class="layout-flex-center validateIdentity-wrap-code">
          <el-input v-model="dataObj.ruleForm.code" :placeholder="$t('请输入验证码')" class="code" />
          <el-button type="primary" @click="getCode" :loading="dataObj.codeLoading">
            {{ $t(`发送验证码`) }}{{ num === 60 ? '' : `(${num})` }}</el-button
          >
        </div>
      </div>
      <template #footerTips>
        <p class="layout-flex-center tips-text pointer" @click="$openKefu">
          <svg-icon name="service"></svg-icon>
          <span>{{ $t('专属客服') }}</span>
        </p>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import { useInterval } from '@/utils/hooks';
import {
  passquestion,
  forgetpass,
  forgetsafequestion,
  forgetpasssmscode,
  forgetpasscode,
  forgetpassemailcodecheck,
  forgetPassEmailCode
} from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';

const dialog = ref(null);
const props = defineProps({
  showValidateDia: {
    type: Boolean,
    default: false
  }
});

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const dataObj = reactive({
  options: [],
  type: null,
  ruleForm: {
    pass_question_id: null,
    pass_answer: null,
    code: null
  },
  saveLoading: false,
  codeLoading: false
});
const { data: questions } = useRequest(passquestion);
const { run: forgetRun } = useRequest(forgetpass, {
  manual: true,
  onSuccess: (res) => {
    dataObj.ruleForm.pass_question_id = res.pass_question_id;
  }
});
watch(
  () => user.userInfo,
  () => {
    const { is_valid_mobile, is_valid_email, is_pass_answer, id } = user?.userInfo;
    dataObj.options = [];
    if (is_valid_mobile === 2) {
      dataObj.options.push({
        value: 1,
        label: global.$t('手机号')
      });
    }
    if (is_valid_email === 2) {
      dataObj.options.push({
        value: 2,
        label: global.$t('邮箱')
      });
    }
    if (is_pass_answer === 2) {
      dataObj.options.push({
        value: 3,
        label: global.$t('密保问题')
      });
    }
    dataObj.ruleForm.uid = id;
    dataObj.type = dataObj.options[0]?.value;
    if (user.userInfo.username) {
      forgetRun({ username: user?.userInfo?.username });
    }
  },
  { immediate: true }
);

// 获取手机验证码
const num = ref(60);
const { run: runInterval, stop: stopInterval } = useInterval(
  () => {
    num.value -= 1;
    if (num.value === 0) {
      stopInterval();
      num.value = 60;
    }
  },
  1000,
  { manual: true }
);
const { run: smsRun } = useRequest(
  () => forgetpasssmscode({ ...dataObj.ruleForm, phone_area_code: user?.userInfo?.phone_area_code }),
  {
    manual: true,
    onSuccess: () => {
      dataObj.codeLoading = false;
      runInterval();
    }
  }
);
// 获取邮箱验证码
const { run: runEmailInterval, stop: stopEmailInterval } = useInterval(
  () => {
    num.value -= 1;
    if (num.value === 0) {
      stopEmailInterval();
      num.value = 60;
    }
  },
  1000,
  { manual: true }
);

const { run: emailCodeRun } = useRequest(() => forgetPassEmailCode(dataObj.ruleForm), {
  manual: true,
  onSuccess: () => {
    dataObj.codeLoading = false;
    runEmailInterval();
  }
});
function getCode() {
  dataObj.codeLoading = true;
  if (dataObj.type === 1) {
    smsRun();
  } else {
    emailCodeRun();
  }
}

// 保存
const emit = defineEmits(['closePassDia', 'validTrue', 'closeValidateDia']);
function onClose(data) {
  emit('closeValidateDia', false);
}
function handleRes() {
  dataObj.saveLoading = false;
  emit('closeValidateDia', false);
  emit('validTrue', true);
}

function closeDia() {
  emit('closeDia', false);
  // emit('closeValidateDia', false);
}
// 密保问题保存
const { run: codeRun } = useRequest(() => forgetsafequestion(dataObj.ruleForm), {
  manual: true,
  onSuccess: () => {
    handleRes();
  }
});
// 手机验证保存
const { run: passRun } = useRequest(() => forgetpasscode(dataObj.ruleForm), {
  manual: true,
  onSuccess: () => {
    handleRes();
  }
});
// 邮箱验证保存
const { run: emailRun } = useRequest(() => forgetpassemailcodecheck(dataObj.ruleForm), {
  manual: true,
  onSuccess: () => {
    handleRes();
  }
});
function save() {
  dataObj.saveLoading = true;
  if (dataObj.type === 1) {
    passRun();
  } else if (dataObj.type === 2) {
    emailRun();
  } else {
    codeRun();
  }
}
</script>

<style lang="scss" scoped>
.validateIdentity-wrap {
  .tips-text {
    font-size: 14px;
    color: var(--font-color-000);
    height: auto;
    margin: 30px 0 0;

    .svg-icon {
      fill: var(--theme-color);
      width: 30px;
      height: 24px;
      margin-right: 10px;
    }
  }

  &-label {
    font-size: 16px;
    color: var(--font-color-000);
    margin: 20px 0 10px;
  }

  &-code {
    .el-button {
      height: 40px;
      margin-left: 15px;
    }
  }
}

.dialog-tips {
  text-align: left;
  padding: 0;
  line-height: 24px;

  span {
    color: var(--theme-color);
    padding-left: 5px;
    cursor: pointer;
  }
}

:deep(.el-dialog__footer) {
  padding-bottom: 30px !important;
}
</style>
