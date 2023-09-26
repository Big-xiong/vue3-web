<template>
  <Dialog v-model="modelValue" :title="$t('修改账号')" center confirmType="primary" :confirmText="$t('提交保存')"
    :confirmLoading="loading" cancelType="grey" :cancelText="$t('取消修改')" @onConfirm="bindChange"
    @onClose="close => { close() }" customeClass="changepwdoraccount-wrap" titlePadding="0">
    <el-form :model="formData" label-position="left" label-width="100px">
      <el-form-item :label="$t('会员账号')">
        <el-input v-model="formData.username" :placeholder="$t('请输入a开头的6-12位英文字母和数字')" />
      </el-form-item>
      <el-form-item :label="$t('账号密码')">
        <el-input v-model="formData.password" :placeholder="$t('密码6-20位数字及字母组成')" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { firstchange } from '@/api/user';
import Dialog from '@/components/Dialog/index.vue';

const global = inject('global');

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  username: {
    type: String,
    default: '',
  },
  pwd: {
    type: String,
    default: '',
  },
});

const formData = reactive({
  username: props?.username,
  password: props?.pwd,
});

const { run, loading } = useRequest(firstchange, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('信息修改成功!'));
    global.$store.dispatch('user/getUserInfo');
    global.$store.dispatch('user/updateUserPassword', formData.password); // bug#19338 修改后的密码显示到success页面
  },
});

function bindChange(close) {
  run(formData).then(() => {
    close();
  });
}

</script>

<style lang="scss">
.changepwdoraccount-wrap {
  .el-dialog__header {
    background-color: var(--theme-color);
    border-radius: 10px 10px 0 0;

    .el-dialog-title {
      color: var(--font-color-fff);
      height: 60px;
      line-height: 60px;
    }

    .el-dialog__close {
      color: var(--font-color-fff) !important;
    }
  }

  .el-form {
    &-item {
      align-items: center;
      border-bottom: 1px solid var(--border-color-e5e5e5);

      .el-input__inner {
        border: 0;
        font-size: 14px;
        background-color: transparent !important;

        &:focus,
        &:hover {
          border: 0 !important;
        }
      }
    }
  }

  .dialog-footer-inline-btn {
    flex-direction: row-reverse;
  }
}
</style>
