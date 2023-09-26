<template>
  <div class="callBack-wrap">
    <Dialog center :title="$t('请求回电')" v-model="callBackShow" :cancelText="$t('上传附件')" :confirmText="$t('确定提交')"
      @onConfirm="save" @onClose="showUpload" @close="close" :confirmLoading="saveLoading" :showConfirmBtn="false"
      :showCancelBtn="false" :serviceType="2" contentPadding="20px 40px 50px">
      <p class="dialog-form-tips">
        {{ $t("尊敬的会员") }}{{ user?.userInfo?.username }}：{{ user?.userInfo?.mobile }}
        <br />
        {{ $t('我们将3分钟内给您回电') }}
      </p>
      <Form ref="formRef" label-position="top" :columns="formColumns" theme="dark" class="select-form">
        <template #iconSlot>
          <span class="phone-area-code-plus">+</span>
          <!-- <span class="phone-area-code-line"></span> -->
        </template>
      </Form>
      <div class="layout-flex-between list">
        <div v-for="(item, index) in pics" :key="item" class="item">
          {{ item }}
          <span class="pointer" @click="deletePic(item, index)">x</span>
        </div>
      </div>
      <div class="layout-flex-between upload-btn">
        <el-upload :action="action" :before-upload="beforeUpload" :disabled="disabled" :on-success="uploadSuccess"
          @onConfirm="handleSubmit" :show-file-list="false">
          <el-button size="small" type="grey">{{ $t('上传附件') }}</el-button>
        </el-upload>
        <el-button type="primary" @click="save" :loading="saveLoading">{{ $t('确定提交') }}</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { recall, upload } from '@/api/home';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
  callBackShow: {
    type: Boolean,
    default: false,
  },
});

const global = inject('global');
const $store = inject('store');

const { user } = $store.state;
const { dicts } = $store.state.app;

$store.dispatch('app/getDict', ['phoneareav3']);

const formRef = ref(null);
const pics = ref([]);
const input = ref('');
const action = ref('');
const baseUrl = import.meta.env.VITE_APP_WEB_API_URL;
action.value = `${baseUrl}upload`;

const formColumns = reactive([
  [
    {
      placeholder: global.$t('手机号'),
      prop: 'phone_area_code',
      type: 'select',
      list: [],
      value: 'key',
      defaultValue: '86',
      class: 'form-phone-select',
      'popper-append-to-body': false,
      'show-arrow': false,
      prefix: 'el-icon-plus',
      renderOption: (item, h) => h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
      slot: 'iconSlot',
      width: '100px',
    },
    {
      type: 'input',
      prop: 'tel',
      slot: 'phoneSelect',
      class: 'form-phone-inpput',
      placeholder: global.$t('请输入电话号码'),
      rule: [{
        required: true,
        trigger: 'blur',
        validator: validateMobile,
      }],
    },
  ],
  {
    type: 'textarea',
    input: 'textarea',
    prop: 'remark',
    placeholder: global.$t('您可以描述您的疑问，可以更快的帮助您处理'),
  },
]);

watch(() => dicts.phoneareav3, () => {
  formColumns[0][0].list = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[2], value: item.split('-')[1],
  }));
}, { immediate: true });

function validateMobile(rule, value, callback) {
  if (!value) {
    callback(new Error(global.$t('请输入电话号码')));
  } else if (!new RegExp(/^[0-9]{5,16}$/).test(value)) {
    callback(new Error(global.$t('请输入正确格式电话号码')));
  } else {
    callback();
  }
}

function deletePic(item, index) {
  pics.value.splice(index, 1);
}

function beforeUpload(file) {
  if (file.size > 5242880 || file.type.indexOf('image') === -1) {
    global.$message.error(global.$t('请上传小于5m的图片'));
    return false;
  }
}

function uploadSuccess(res, file, list) {
  pics.value.push(res.data.path);
}

const emit = defineEmits(['close']);

function close() {
  emit('close', false);
}
const { run: saveRun, loading: saveLoading } = useRequest(recall, {
  manual: true,
  onSuccess: () => {
    global.$message.success(global.$t('提交成功'));
    emit('close', false);
  },
});

function save() {
  formRef.value.form.validate((valid) => {
    if (valid) {
      saveRun({ ...formRef.value.data, pic: JSON.stringify(pics.value) });
    } else {
      return false;
    }
  });
}

</script>

<style lang="scss" scoped>
.dialog-form-tips {
  line-height: 1.5;
  text-align: center;
}

.upload-btn {
  >div {
    width: calc(50% - 10px);

    :deep(div),
    :deep(div button) {
      width: 100%;
    }
  }

  >.el-button {
    width: calc(50% - 10px);
  }
}

.list {
  margin: 0 auto 30px;

  .item {
    width: 175px;
    height: 33px;
    background: var(--callback-list-item-bg, var(--bg-color-191919));
    line-height: 33px;
    text-align: center;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    color: var(--font-color-ccc);

    span {
      color: var(--font-color-ccc);
      position: absolute;
      top: 15px;
      right: 10px;
      font-size: 22px;
      line-height: 0;
    }
  }
}

.hide {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

:deep(.config-form-wrap-group) {
  position: relative;

  .el-form-item {
    max-width: initial;

    &:first-child {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }

  .form-phone-inpput {
    .el-input__inner {
      padding-left: 100px;
    }
  }

  .el-select {
    .el-input__inner {
      background: none !important;
      padding-left: 30px;
      border: 0 !important;
      padding-right: 0;
      height: 42px !important;
      margin: 1px 0 0 1px;
    }

    .el-input__suffix {
      line-height: 45px;
    }
  }
}

.phone-area-code-plus {
  position: absolute;
  left: 20px;
  top: 2px;
  font-size: 16px;
  color: var(--font-color-000);
}

.phone-area-code-line {
  width: 1px;
  position: absolute;
  height: 20px;
  background: var(--border-color-000-1);
  top: 12px;
  right: 0;
}

:deep(.el-textarea__inner) {
  height: 120px !important;
}
</style>

<style lang="scss">
.callBack-wrap {
  .el-dialog__footer {
    display: none;
  }

  .el-button--grey {

    &:active,
    &:focus {
      border-color: var(--font-color-fff-4) !important;
    }
  }
}
</style>
