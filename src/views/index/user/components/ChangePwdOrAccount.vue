<template>
  <div class="changepwdoraccount-wrap">
    <Dialog
      v-model="modelValue"
      :title="$t('温馨提示')"
      center
      titlePadding="40px 0 0"
      contentPadding="0 15px"
      confirmType="primary"
      :confirmText="$t('提交保存')"
      cancelType="grey"
      :cancelText="$t('取消修改')"
      @onConfirm="bindChange"
      @onClose="$emit('update:show', false)"
      customeClass="tipsDia-wrap"
    >
      <el-form
        ref="form"
        :rules="formRule"
        :model="formData"
        label-position="left"
        label-width="100px"
      >
        <el-form-item :label="$t('会员账号')">
          <el-input
            v-model="formData.username"
            :placeholder="$t('请输入a开头的6-12位英文字母和数字')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('账号密码')">
          <el-input
            v-model="formData.password"
            :placeholder="$t('密码6-20位数字及字母组成')"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
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
  info: {
    type: Object,
    default: () => ({
      username: '',
      password: '',
    }),
  },
});

const formData = reactive({
  username: props.info.username,
  password: props.info.password,
});

const { run } = useRequest(firstchange, {
  manual: true,
});

function bindChange() {
  run(formData);
}

</script>

<style lang="scss" scoped>
.changepwdoraccount-wrap {
  .el-form {
    &-item {
      align-items: center;
      border-bottom: 1px solid #e5e5e5;

      :deep(.el-input__inner) {
        border: 0;
        font-size: 14px;
      }
    }
  }
}
</style>
