<template>
  <div class="passwordSet-wrap">
    <Dialog :title="$t('设置登录密码')" v-model="showPassDia" center :showCancelBtn="false" blockBtn :confirmText="$t('完成')"
      @onConfirm="save" @close="onClose" :loading="saveLoading" :serviceType="1" footerBtnWidth="100%"
      contentPadding="0 40px" footerPadding="0 40px">
      <p class="dialog-tips" v-if="user?.userInfo?.is_first_set_pass === 2">{{ $t('登录密码重置成功一定要牢牢记住哦') }}</p>
      <Form ref="passwordRef" label-position="top" :columns="passwordColumns" />
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
import { setpass } from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';

const emit = defineEmits(['closePassDia']);
const props = defineProps({
  showPassDia: {
    type: Boolean,
    default: false,
  },
});

const global = inject('global');
const passwordColumns = reactive([
  {
    label: global.$t('请输入新密码'),
    placeholder: global.$t('8-20位字符，由字母，数字，特殊符号组成'),
    type: 'password',
    prop: 'password',
    'show-password': true,
    rule: [
      {
        required: true,
        message: global.$t('请输入新登录密码'),
        trigger: 'blur',
      },
    ],
  },
  {
    label: global.$t('请再次输入新密码'),
    placeholder: global.$t('请再次输入新密码'),
    type: 'password',
    prop: 'repassword',
    'show-password': true,
    rule: [
      {
        required: true,
        message: global.$t('请再次输入新密码'),
        trigger: 'blur',
      },
      {
        validator: (rule, value, callback) => {
          if (passwordColumns.password !== passwordColumns.repassword) {
            callback(new Error(global.$t('两次密码输入不一致')));
          }
          callback();
        },
      },
    ],
  },
]);

const $store = inject('store');
const { user } = $store.state;
watch(
  () => user.userInfo,
  () => {
    if (user?.userInfo?.is_first_set_pass === 2) {
      passwordColumns.unshift({
        label: global.$t('请输入旧登录密码'),
        placeholder: global.$t('请输入旧登录密码'),
        type: 'password',
        prop: 'old_password',
        'show-password': true,
        rule: [
          {
            required: true,
            message: global.$t('请输入旧登录密码'),
            trigger: 'blur',
          },
        ],
      });
    }
  },
  { immediate: true },
);

const passwordRef = ref(null);
const { run: saveRun, loading: saveLoading } = useRequest((params) => setpass(params), {
  manual: true,
  onSuccess: () => {
    global.$message.success(global.$t('设置密码成功'));
    emit('closePassDia', false);
    $store.dispatch('user/getUserInfo');
  },
});
function save() {
  passwordRef.value.form.validate((valid) => {
    if (valid) {
      saveRun(passwordRef.value.data);
    } else {
      return false;
    }
  });
}

function onClose(data) {
  emit('closePassDia', false);
}
</script>

<style lang="scss" scoped>
.dialog-tips {
  text-align: left;
  padding: 0;
}
</style>
