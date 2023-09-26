<template>
  <div class="money-password-set-wrap">
    <Dialog ref="dialog" :title="user?.userInfo?.is_pay_password === 2 ? $t('修改资金密码') : $t('设置新资金密码')"
      v-model="showMoneyPassDia" center :showCancelBtn="false" :confirmText="$t('完成')" @onConfirm="save"
      @close="onClose" :confirmLoading="saveLoading" :serviceType="1" contentPadding="0 40px" footerPadding="0 40px">
      <p class="dialog-tips" v-if="user.userInfo.is_pay_password === 2">{{
          $t('在此可更改资金密码，若忘记资金密码，则可在“取款-忘记资金密码”处通过手机或邮箱进行找回。')
      }}</p>
      <Form ref="MoneyPasswordSetRef" label-position="top" :columns="MoneyPasswordSetColumns">
        <template #rightSlot v-if="user.userInfo.is_pay_password === 2">
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
  </div>
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
const dialog = ref(null);

const MoneyPasswordSetRef = ref(null);

const global = inject('global');
const props = defineProps({
  showMoneyPassDia: {
    type: Boolean,
    default: false,
  },
});

const MoneyPasswordSetColumns = reactive([
  {
    label: global.$t('请输入旧资金密码'),
    slot: 'rightSlot',
    prop: 'old_password',
    trigger: 'blur',
    type: '',
    rule: [{
      required: true,
      message: global.$t('请输入旧资金密码'),
    }],
  },
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

function getOldVal(val) {
  MoneyPasswordSetRef.value.data.old_password = val;
}
function getVal(val) {
  MoneyPasswordSetRef.value.data.password = val;
}
function getVal02(val) {
  MoneyPasswordSetRef.value.data.repassword = val;
}

const emit = defineEmits(['closeMoneyPassDia']);
const { run: saveRun, loading: saveLoading } = useRequest((params) => setpaypass(params), {
  manual: true,
  onSuccess: () => {
    global.$message.success(global.$t('恭喜您，资金密码设置成功！'));
    emit('closeMoneyPassDia', false);
    $store.dispatch('user/getUserInfo');
  },
});
//  保存
function save() {
  MoneyPasswordSetRef.value.form.validate((valid) => {
    if (valid) {
      saveRun(MoneyPasswordSetRef.value.data);
    } else {
      return false;
    }
  });
}
// 关闭弹框
function onClose() {
  dialog.value.closeDialog();
  emit('closeMoneyPassDia', false);
}
</script>

<style lang="scss" scoped>
.money-password-set-wrap {
  .tips-text {
    font-size: 14px;
    color: var(--font-color-ccc);
    height: 66px;
    margin: 0;

    .svg-icon {
      fill: var(--theme-color);
      width: 30px;
      height: 24px;
      margin-right: 10px;
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
  }
}
</style>
