<template>
  <div class="digAddress" v-loading="walletLoading">
    <ul v-loading="deleteLoading">
      <li v-for="(item, index) in walletList" :key="index" @click="handleChose(item)">
        <div class="top">
          <h4>{{ item.remark }}</h4>
          <p v-if="item.address.length < 15">{{ item.address }}</p>
          <p v-else>{{ `${item.address.substr(0, 6)}...${item.address.substr(item.address.length - 7)}` }}</p>
          <i class="el-icon-edit" @click.stop="handleAdd(item)" />
          <i class="el-icon-delete" @click.stop="handleDel(item)" />
        </div>
        <div class="bottom">
          <p>{{ item.updated_at }}</p>
        </div>
      </li>
    </ul>
    <template v-if="!walletLoading">
      <div v-if="!walletList?.length" class="empty">
        <!-- <img src="/src/assets/images/center/widthdraw/empty.png" alt /> -->
        <svg-icon name="address-null" />
        <p>{{ $t('暂未设置收币地址') }}</p>
        <span @click="handleAdd()">{{ $t('添加地址') }}</span>
      </div>
      <div v-else class="button-wrap">
        <el-button type="primary" @click="handleAdd()">{{ $t('添加地址') }}</el-button>
      </div>
    </template>

    <Dialog v-model="digitalDia" :title="title" width="500px" center blockBtn footerBtnWidth="400px"
      :confirmText="$t('保存')" :cancelText="$t('取消')" @onConfirm="save" @onClose="onCancel" @close="digitalDia = false"
      customeClass="digital-wrap" :loading="saveLoading" contentPadding="0 40px" :show-close="true">
      <Form :columns="columns" ref="formRef" label-position="top" v-loading="protocalLoading">
        <template #propSlot>
          <div class="layout-flex-center widthdraw-digital-wrap-protocal" v-if="protocalList?.length">
            <span v-for="(item, index) in prtList" :key="index" :class="{ active: form.protocol === item.value }"
              @click="handleProtocol(item.value)">{{ item.name }}</span>
          </div>
        </template>
      </Form>
    </Dialog>

    <Dialog v-model="deleteDialogVisible" width="390px" center footerBtnWidth="134px" :confirmText="$t('取消')"
      :cancelText="$t('确认')" confirmType="grey" cancelType="primary" @onConfirm="deleteDialogVisible = false"
      @onClose="deleteConfirmHandle" @close="deleteDialogVisible = false" contentPadding="40px 40px 0 40px"
      :show-close="false">
      <svg-icon name="warning" class="warning-icon" />
      <p>{{ $t('是否确认删除该地址') }}</p>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, nextTick,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { dateFormat } from '@/utils';
import {
  digwalletlist, adddigwallet, deldigwallet, staticprotocol,
} from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';

scroll(0, 0);
const global = inject('global');
const digitalDia = ref(false);
const deleteDialogVisible = ref(false);
const formRef = ref(null);
const title = ref('');
const deleteAddrId = ref('');
const columns = reactive([
  {
    label: global.$t('提款币种'),
    placeholder: global.$t('请选择货币类型'),
    prop: 'type',
    type: 'select',
    list: [],
    width: '100%',
    value: 'type',
    defaultValue: '',
  },
  {
    label: global.$t('协议'),
    type: 'radio',
    slot: 'propSlot',
    prop: 'protocol',
  },
  {
    label: global.$t('收币地址'),
    type: 'input',
    prop: 'address',
    placeholder: global.$t('请输入或粘贴') + global.$t('地址'),
    rule: [
      {
        required: true,
        message: global.$t('地址不能为空'),
        trigger: 'blur',
      },
    ],
  },
  {
    label: global.$t('备注'),
    type: 'input',
    prop: 'remark',
    placeholder: global.$t('备注'),
    rule: [
      {
        required: true,
        message: global.$t('请输入备注'),
        trigger: 'blur',
      },
    ],
  },
]);
const form = reactive({
  type: '',
  protocol: '',
});

const { run: walletListRun, data: walletList, loading: walletLoading } = useRequest(digwalletlist);
// 提款币种
const prtList = ref([]);
const { data: protocalList, loading: protocalLoading } = useRequest(staticprotocol, {
  onSuccess(res) {
    columns[0].list = res.map((item) => ({ id: item.id, type: item.type.toUpperCase() }));
    // columns[0].list = res;
    form.type = res[0]?.type?.toUpperCase();
    form.protocol = res[0].protocol[0].value;
    prtList.value = res?.find((m) => m.type === res[0]?.type).protocol ?? [];
  },
});

function onCancel(close) {
  formRef.value.form.resetFields();
  digitalDia.value = false;
}

function getNowTime() {
  return dateFormat('HH:MM', new Date().getTime());
}

function handleProtocol(val) {
  form.protocol = val;
  nextTick(() => {
    formRef.value.data.remark = `${val} ${getNowTime()}`;
  });
}

function handleAdd(item) {
  digitalDia.value = true;
  if (item) {
    title.value = global.$t('编辑收币地址');
    nextTick(() => {
      const {
        id, type, protocol, address, remark,
      } = item;
      form.protocol = protocol;
      formRef.value.data.id = id;
      formRef.value.data.type = type.toUpperCase();
      formRef.value.data.protocol = protocol;
      formRef.value.data.address = address;
      formRef.value.data.remark = remark;
    });
  } else {
    title.value = global.$t('添加收币地址');
    nextTick(() => {
      formRef.value.data.type = form.type;
      formRef.value.data.protocol = form.protocol;

      formRef.value.data.remark = `${form.protocol} ${getNowTime()}`;
    });
  }
}

const { run: deletRun, loading: deleteLoading } = useRequest(deldigwallet, {
  manual: true,
  onSuccess() {
    walletListRun();
    global.$message.success(global.$t('操作成功'));
  },
});
function handleDel(item) {
  deleteAddrId.value = item.id;
  deleteDialogVisible.value = true;
}
function deleteConfirmHandle() {
  deleteDialogVisible.value = false;
  deletRun({ id: deleteAddrId.value });
}

const emit = defineEmits(['choseAddress']);
function handleChose(item) {
  emit('choseAddress', item);
}

const { run: saveRun, loading: saveLoading } = useRequest(adddigwallet, {
  manual: true,
  onSuccess() {
    walletListRun();
    digitalDia.value = false;
  },
});
function save() {
  formRef.value.data.protocol = form.protocol;
  formRef.value.form.validate((valid) => {
    if (valid) {
      saveRun(formRef.value.data);
    } else {
      return false;
    }
  });
}
</script>

<style lang="scss" scoped>
.digAddress {
  padding: 20px 55px;
  min-height: 10vh;

  ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    li {
      width: 430px;
      padding: 16px 30px;
      border: 1px solid var(--border-color-000-2);
      border-radius: 4px;
      margin-bottom: 20px;
      box-sizing: border-box;

      &:hover {
        border: 1px solid var(--theme-color);
      }

      .top {
        border-bottom: 1px solid rgba(#fff, 0.06);
        position: relative;

        h4 {
          font-size: 16px;
          color: var(--font-color-000);
          line-height: 22px;
          margin: 0 0 4px;
          height: 22px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p {
          font-size: 14px;
          color: var(--font-color-999);
          margin: 0 0 12px;
        }

        p+i {
          position: absolute;
          right: 40px;
          top: 14px;
          font-size: 18px;
          cursor: pointer;
          color: var(--theme-color);
        }

        i+i {
          position: absolute;
          right: 0;
          top: 14px;
          font-size: 18px;
          cursor: pointer;
          color: var(--theme-color);
        }
      }

      .bottom {
        p {
          color: var(--font-color-6A6A6A);
          font-size: 12px;
          line-height: 18px;
          margin: 10px 0 0;
        }
      }
    }
  }

  .el-button {
    margin-top: 30px;
  }
}

.button-wrap {
  .el-button {
    width: 300px;
  }
}

.empty {
  text-align: center;
  margin: 80px 0;

  .svg-icon {
    width: 60px;
    height: 60px;
    fill: var(--theme-color) !important;
  }

  p {
    font-size: 14px;
    margin-top: 18px;
  }

  span {
    color: var(--theme-color);
    cursor: pointer;
  }
}

.widthdraw-digital-wrap-protocal {
  justify-content: flex-start;

  span {
    height: 40px;
    border: 1px solid var(--border-color-000-2);
    line-height: 40px;
    font-size: 16px;
    min-width: 120px;
    border-radius: 6px;
    margin-right: 10px;
    text-align: center;
    cursor: pointer;

    &.active {
      color: var(--theme-color);
      border-color: var(--theme-color);
    }
  }
}

:deep(.el-dialog-title) {
  height: 60px;
  line-height: 60px;
}

:deep(.el-form) {
  .el-form-item__label {
    font-size: 16px;
    color: var(--font-color-000);

    &::before {
      content: none !important;
    }
  }
}

.warning-icon {
  display: block;
  margin: auto;
  width: 42px;
  height: 42px;
  fill: var(--theme-color);
}

.warning-icon+p {
  text-align: center;
  color: var(--font-color-000);
}
</style>
