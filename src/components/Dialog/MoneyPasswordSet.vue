<template>
  <!-- <div class="money-password-set-wrap"> -->
  <Dialog :title="title ? title : (user?.userInfo?.is_pay_password === 2 ? $t('修改资金密码') : $t('设置新资金密码'))"
    v-model="showMoneyPassDia" center :showCancelBtn="false" :confirmText="$t('完成')" @onConfirm="save"
    :confirmLoading="saveLoading" :serviceType="1" contentPadding="0 40px" footerPadding="0 40px">
    <Form ref="MoneyPasswordSetRef" label-position="top" :columns="MoneyPasswordSetColumns">
      <template #rightSlot v-if="user.userInfo.is_pay_password === 2 && showOldPass">
        <el-form-item>
          <label class="el-form-item__label">{{ $t(`请输入旧资金密码`) }}</label>
          <PasswordInput @input="getOldVal" />
        </el-form-item>
      </template>
      <template #newSlot>
        <el-form-item>
          <label class="el-form-item__label">{{ $t(`请输入6位纯数字的新资金密码`) }}</label>
          <PasswordInput @input="getVal" />
        </el-form-item>
      </template>
      <template #oldSlot>
        <el-form-item>
          <label class="el-form-item__label">{{ $t(`请再次输入新密码`) }}</label>
          <PasswordInput @input="getVal02" />
        </el-form-item>
      </template>
    </Form>
    <template #footerTips>
      <p class="layout-flex-center tips-text pointer" @click="$openKefu">
        <svg-icon name="service"></svg-icon><span>{{ $t('专属客服') }}</span>
      </p>
    </template>
  </Dialog>
  <!-- </div> -->
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { setpaypass } from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import PasswordInput from '@/components/PasswordInput/index.vue';

const $store = inject('store');
const { user } = $store.state;

const MoneyPasswordSetRef = ref(null);

const global = inject('global');
const props = defineProps({
  showMoneyPassDia: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  showOldPass: {
    type: Boolean,
    default: true,
  },
});

const MoneyPasswordSetColumns = reactive([
  {
    label: global.$t('请输入6位纯数字的新资金密码'),
    slot: 'newSlot',
    prop: 'password',
    type: '',
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('请输入6位纯数字的新资金密码'),
    }],
  },
  {
    label: global.$t('请再次输入新密码'),
    slot: 'oldSlot',
    prop: 'repassword',
    type: '',
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('确认新密码'),
    }, {
      validator: (rule, value, callback) => {
        if (MoneyPasswordSetRef.value.data.password !== MoneyPasswordSetRef.value.data.repassword) {
          callback(new Error(global.$t('两次密码输入不一致')));
        }
        callback();
      },
    }],
  },
]);

watch(() => user.userInfo, () => {
  if (user?.userInfo?.is_pay_password === 2) {
    MoneyPasswordSetColumns.unshift({
      label: global.$t('请输入旧资金密码'),
      slot: 'rightSlot',
      prop: 'old_password',
      trigger: 'blur',
      type: '',
      rule: [{
        required: true,
        message: global.$t('请输入旧资金密码'),
      }],
    });
  }
}, { immediate: true });

function getOldVal(val) {
  MoneyPasswordSetRef.value.data.old_password = val;
}
function getVal(val) {
  MoneyPasswordSetRef.value.data.password = val;
}
function getVal02(val) {
  MoneyPasswordSetRef.value.data.repassword = val;
}

let closeDialog = null;
const { run: saveRun, loading: saveLoading } = useRequest((params) => setpaypass(params), {
  manual: true,
  onSuccess: () => {
    global.$store.dispatch('user/getWalletInfo');
    global.$store.dispatch('user/getUserInfo');
    global.$message.success(global.$t('恭喜您，资金密码设置成功！'));
    closeDialog();
  },
});
//  保存
function save(close) {
  closeDialog = close;
  MoneyPasswordSetRef.value.form.validate((valid) => {
    if (valid) {
      if (!props?.showOldPass) {
        saveRun({ ...MoneyPasswordSetRef.value.data, is_reset: 1 });
      } else {
        saveRun(MoneyPasswordSetRef.value.data, close);
      }
    } else {
      return false;
    }
  });
}

</script>

<style lang="scss" scoped>
.tips-text {
  font-size: 14px;
  color: var(--font-color-ccc);

  .svg-icon {
    fill: var(--theme-color);
    width: 30px;
    height: 24px;
    margin-right: 10px;
  }
}
</style>
