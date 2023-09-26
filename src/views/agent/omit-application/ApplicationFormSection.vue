<template>
  <div class="application-form-wrap">
    <Form :columns="applicationColumns" label-width="0" ref="ApplicationFormRef">
      <template #submit>
        <el-button @click="doApplication" type="primary" :loading="loading">{{ $t('提交申请') }}</el-button>
      </template>
    </Form>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { ElMessage } from 'element-plus';
import {

  inject, reactive, ref, watch,
} from 'vue';
import Form from '@/components/Form/index.vue';
import { agentcommissionlog, agentcommissionstatus, omitadduser } from '@/api/agent';

const global = inject('global');
const applicationColumns = reactive([
  {
    type: 'input',
    prop: 'username',
    placeholder: global.$t('请输入会员帐号'),
    slot: 'submit',
    rule: [{
      message: global.$t('请输入会员帐号'),
      required: true,
      trigger: blur,
    }],
  },
]);

const emit = defineEmits(['apply']);

const { run: postApplication, loading } = useRequest(
  (username) => omitadduser({
    username,
  }),
  {
    manual: true,
    onSuccess(result) {
      if (result) {
        emit('apply');
        ElMessage.success({
          message: global.$t('申请成功'),
          type: 'success',
        });
      }
    },
  },
);

const ApplicationFormRef = ref(null);

function doApplication() {
  ApplicationFormRef.value.form.validate((valid) => {
    if (valid) {
      postApplication(ApplicationFormRef.value.data);
    }
  });
}

</script>

<style lang="scss" scoped>
.application-form-wrap {
  padding-bottom: 20px;
  height: 45px;
  border-bottom: solid 1px var(--border-color-e2e2e2);

  :deep(.el-form-item__content) {
    display: flex;
    justify-content: flex-start;
  }

  :deep(.el-input__inner),
  :deep(.el-input) {
    width: 220px;
    margin-right: 20px;
  }
}
</style>
