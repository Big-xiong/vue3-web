<template>
  <div class="add-bank-wrap">
    <Dialog ref="refDialog" :cancelText="$t('取消申请')" :showCancelBtn="!disabled" :showConfirmBtn="!disabled"
      :confirmLoading="submitLoading" :confirmText="$t('确认提交')" v-model="modelValue" :title="$t(title)" width="500px"
      @onConfirm="handleSubmit" @close="$emit('update:modelValue', false)" @onClose="$emit('update:modelValue', false)"
      contentPadding="0 40px" blockBtn footerBtnWidth="100%" cancelType="default">
      <div class="omit-dialog-form">
        <div class="tips">
          <i class="el-icon-warning-outline" />
          {{ $t('只能找回通过自身代理链接注册的下级会员，且注册三天时间内有效') }}
        </div>
        <div class="username">
          <span>{{ $t('会员账号：') }}</span>
          <span>{{ target.username }}</span>
        </div>
        <div class="username" v-if="config.isCurrency">
          <span>{{ $t('地区：') }}</span>
          <span>{{ target.user_region?.name }}</span>
        </div>
        <div class="username" v-if="config.isCurrency">
          <span>{{ $t('货币：') }}</span>
          <span>{{ target.user_currency?.name }}</span>
        </div>
        <Form ref="FormRef" :columns="columns" label-position="top"></Form>
        <div class="upload-tips">{{ $t('申请附图：请上传jpg，png，jpeg格式，且大小不超过5M的图片。') }}</div>
        <div class="upload-section">
          <el-upload :action="action" :before-upload="beforeUpload" :disabled="disabled" :file-list="fileList"
            :class="{ 'hide-upload': disabled }" :on-success="uploadSuccess" @onConfirm="handleSubmit"
            list-type="picture-card">
            <template #default>
              <i class="el-icon-plus" />
              <span class="max-numbers">{{ $t('最多6张') }}</span>
            </template>
            <template #file="{ file }">
              <div>
                <!-- <img
                  class="el-upload-list__item-thumbnail"
                  :src="file?.url?.response?.data?.path || file.url"
                  alt
                /> -->
                <el-image class="el-upload-list__item-thumbnail" :src="file?.url?.response?.data?.path || file.url"
                  fit="cover" style="height: 90px">
                </el-image>
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)"></span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </div>
      </div>
    </Dialog>
    <PreviewImage v-model="isShowPreviewImage" :imageUrl="imageUrl" @close="isShowPreviewImage = false" />
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  ref, inject, watch, reactive, computed, watchEffect,
} from 'vue';
import Dialog from '@/components/Dialog/index.vue';
import { askomit } from '@/api/agent';
import Form from '@/components/Form/index.vue';
import PreviewImage from './PreviewImage.vue';

const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;
const action = ref('');
const title = ref('');
const config = inject('subConfig');

const baseUrl = import.meta.env.VITE_APP_WEB_API_URL;
// const projectName = import.meta.env.VITE_APP_PROJECT_NAME;
const projectName = 'wq';

action.value = `${baseUrl}upload?merhant_no=${projectName}`;

const props = defineProps({
  modelValue: Boolean,
  target: Object,
  onDialogClose: Function,
});

const disabled = computed(() => props.target.audit_status !== 2);
title.value = disabled.value ? '查看申请' : '发起申请';

const columns = reactive([
  {
    label: global.$t('推广链接'),
    placeholder: global.$t('请输入推广链接'),
    prop: 'agent_domain',
    type: 'input',
    disabled,
  },
  {
    label: global.$t('推广设备'),
    placeholder: global.$t('请选择推广设备'),
    prop: 'ask_dev_type',
    type: 'select',
    list: [],
    disabled,
    width: '100%',
    rule: [
      {
        message: global.$t('请选择推广设备'),
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    label: global.$t('申请理由'),
    placeholder: global.$t('请填写申请理由'),
    prop: 'ask_reason',
    type: 'textarea',
    disabled,
    list: [],
  },
]);
const refDialog = ref('refDialog');
const fileList = ref([]);
const askPics = ref([]);
const newFileList = ref([]);

const FormRef = ref(null);

function mapList(object) {
  return Object.keys(object).map((key) => ({
    label: object[key],
    value: key,
  }));
}

if (Object.keys(agent.devTypeList).length) {
  columns[1].list = mapList(agent.devTypeList);
} else {
  $store.dispatch('agent/getDevTypeList');
}

watch(() => agent.devTypeList, (val) => {
  columns[1].list = mapList(val);
});

const isDataInit = ref(false);
watch(() => FormRef.value, () => {
  if (FormRef.value && props.target.audit_status !== 2 && !isDataInit.value) {
    isDataInit.value = true;
    FormRef.value.data.agent_domain = props.target.agent_domain;
    FormRef.value.data.ask_dev_type = props.target.ask_dev_type;
    FormRef.value.data.ask_reason = props.target.ask_reason;
    try {
      const pics = JSON.parse(props.target.ask_pics);
      fileList.value = pics.map((item) => ({
        name: '',
        url: item,
      }));
    } catch (e) { }
  }
});

function handleRemove(file) {
  const index = fileList.value.findIndex((item) => item.url === file.url);
  newFileList.value.splice(index, 1);
  fileList.value = newFileList.value;
  askPics.value.splice(index, 1);
}

function beforeUpload(file) {
  if (file.size > 5242880 || file.type.indexOf('image') === -1) {
    global.$message.error(global.$t('请上传小于5m的图片'));
    return false;
  }
  if (newFileList.value.length > 6) {
    global.$message.error(global.$t('最多6张'));
    return false;
  }
}

function uploadSuccess(res, file, list) {
  newFileList.value = list;
  askPics.value.push(res.data.path);
}

const { run: postAskOmit, loading: submitLoading } = useRequest(
  (params) => askomit(params),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('申请成功！'));
      refDialog.value.handleCancel();
      props.onDialogClose();
    },
  },
);

const isShowPreviewImage = ref(false);
const imageUrl = ref('');
function handlePreview(file) {
  isShowPreviewImage.value = true;
  imageUrl.value = file?.url?.response?.data?.path || file.url;
}

function handleSubmit(close) {
  FormRef.value.form.validate((valid) => {
    if (valid) {
      const _fileList = newFileList.value.map((item) => item.response?.data?.path);
      const params = {
        ...props.target,
        ...FormRef.value.data,
        ask_pics: JSON.stringify(_fileList),
      };
      // console.log(params.ask_pics);
      postAskOmit(params);
    }
  });
}
</script>

<style lang="scss" scoped>
.omit-dialog-form {
  padding-top: 84px;
  text-align: left;
}

.upload-tips {
  font-size: 16px;
  margin-bottom: 32px;
  color: var(--font-color-333);
}

:deep(.el-textarea__inner) {
  color: var(--font-color-000);
}

:deep(.el-input.is-disabled .el-input__inner),
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background-color: var(--dark-font-color-000, #f0f0f0);
}

.username {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 16px;
  color: var(--cur-font-color-fff, var(--font-color-999));

  span:nth-child(2) {
    color: var(--font-color-222930);
  }
}

.tips {
  background: var(--dark-font-color-000, var(--bg-color-43535d));
  color: var(--font-color-fff);
  font-size: 16px;
  padding: 4px 20px;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  min-height: 40px;
  left: 0;
  line-height: 26px;
  top: 61px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    color: var(--theme-color);
    font-size: 14px;
    margin-right: 9px;
  }
}

:deep(.upload-section div) {

  //display: flex;
  .el-upload-list__item {
    // transition: none;
    font-size: 0;
    margin-right: 43px;
    width: 110px;
    height: 90px;
    line-height: 90px;

    &:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  .el-upload-list__item-thumbnail {
    //width: 110px;
    //height: 90px;
    vertical-align: middle;
  }
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 90px;
  border: 1px solid var(--border-color-e2e2e2);
  background-color: transparent;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  //display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .el-icon-plus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }

  .max-numbers {
    font-size: 12px;
    line-height: 12px;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    display: inline-block;
    width: auto;
    color: var(--font-color-606266);
  }
}

.hide-upload {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

:deep(.image-slot) {
  height: 90px;
  background-repeat: no-repeat;
  background-size: 80% auto;
  background-position: center center;
}
</style>
