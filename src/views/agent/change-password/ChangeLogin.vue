<template>
  <div class="change-login-wrap">
    <Form ref="FormRef" :columns="columns" label-position="top" />
    <el-button @click="doChange" :loading="loading || setLoading" size="large" type="primary">{{ $t('确认修改') }}
    </el-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  computed,
  inject, reactive, ref,
} from 'vue';
import Form from '@/components/Form/index.vue';
import { setpass } from '@/api/agent';

const global = inject('global');
const FormRef = ref(null);
const $store = inject('store');

const props = defineProps({
  loading: Boolean,
  changeType: {
    type: String,
    default: 'change',
  },

});

const baseColumns = reactive([
  {
    type: 'password',
    prop: 'old_password',
    label: global.$t('输入原密码'),
    placeholder: global.$t('请输入原密码'),
    width: '500px',
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('请输入原密码'),
    }],
  },
  {
    type: 'password',
    prop: 'password',
    label: global.$t('新密码'),
    placeholder: global.$t('请输入新密码'),
    width: '500px',
    rule: [{
      message: global.$t('新密码由6-20位英文字母或数字组成'),
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const reg = /^[0-9A-Za-z]{6,20}$/;
        if (!reg.test(value)) {
          callback(new Error(global.$t('密码由6-20位英文字母或数字组成')));
        }
        callback();
      },
    }],
  },
  {
    type: 'password',
    prop: 'repassword',
    label: global.$t('确认密码'),
    placeholder: global.$t('再次确认'),
    width: '500px',
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('两次输入的密码不一致'),
      validator: (rule, value, callback) => {
        const { password } = FormRef.value.data;
        if (password !== value) {
          callback(new Error(global.$t('两次输入的密码不一致！')));
        }
        callback();
      },
    }],
  },
]);

const columns = computed(() => {
  if (props.changeType === 'new') {
    const tempColumns = [...baseColumns];
    tempColumns.splice(0, 1);
    return tempColumns;
  }

  return baseColumns;
});

const { run: changePassword, loading: setLoading } = useRequest(
  () => setpass(FormRef.value?.data ?? {}),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('修改成功'));
      $store.dispatch('agent/getUserInfo');
      FormRef.value.form.resetFields();
    },
  },
);

const emit = defineEmits(['reset']);
function doChange() {
  // console.log('doChange', props.changeType);
  FormRef.value.form.validate((valid) => {
    if (valid) {
      if (props.changeType === 'new') {
        emit('reset', FormRef.value?.data ?? {});
      } else {
        changePassword();
      }
    }
  });
}
</script>

<style lang="scss" scoped>
</style>
