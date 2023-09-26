<template>
  <div class="member-register-wrap">
    <header>{{ $t('会员开户') }}</header>
    <Form ref="addMemberRef" label-width="0px" :columns="formColumns" />
    <el-button :loading="loading" size="large" @click="doAddMember" type="primary">{{ $t(`确认提交`) }}</el-button>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, computed, onMounted, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import { addmember } from '@/api/agent';

const addMemberRef = ref(null);
const global = inject('global');
const $store = inject('store');
$store.dispatch('app/getDict', ['regionlist']);
const subConfig = inject('subConfig');

const { dicts } = $store.state.app;
const regionList = computed(() => {
  const list = dicts?.regionlist || [];
  return list.map((item) => ({ key: item.id, label: item.name, value: item.id }));
});

const currencyList = ref(null);

const formColumns = reactive([
  {
    type: 'input',
    prop: 'username',
    maxlength: '20',
    placeholder: global.$t('请输入会员账号'),
    rule: [{
      required: true,
      message: global.$t('请输入会员帐号'),
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    prop: 'password',
    maxlength: '20',
    placeholder: global.$t('请输入会员密码'),
    rule: [{
      required: true,
      message: global.$t('请输入会员密码'),
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    prop: 'repassword',
    maxlength: '20',
    placeholder: global.$t('确认密码'),
    rule: [{
      required: true,
      message: global.$t('请再次输入新密码'),
      trigger: 'blur',
    }, {
      message: global.$t('两次输入的密码不一致'),
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const { password } = addMemberRef.value.data;
        if (password !== value) {
          callback(new Error(global.$t('两次输入的密码不一致！')));
        }
        callback();
      },
    }],
  },

]);

if (subConfig.isCurrency) {
  formColumns.push({
    type: 'select',
    prop: 'inte_region_id',
    placeholder: global.$t('请选择地区'),
    list: regionList,
    width: '500px',
  });
  formColumns.push({
    type: 'select',
    prop: 'inte_currency_id',
    placeholder: global.$t('请选择货币'),
    list: currencyList,
    optionLabel: 'name',
    value: 'id',
    width: '500px',
    disabled: true,
  });
}

onMounted(() => {
  watch(() => addMemberRef.value?.data?.inte_region_id, (curVal) => {
    formColumns[4].disabled = false;
    addMemberRef.value.data.inte_currency_id = dicts?.regionlist.filter((item) => item.id === curVal)[0]?.currency_conf?.default?.id;
    const list = dicts?.regionlist.filter((item) => item.id === curVal)[0]?.currency_conf?.list ?? [];
    currencyList.value = list.filter((item) => item.status === 1);
  });
});

const { loading, run: requestAddMember } = useRequest(
  (params) => addmember(params),
  {
    manual: true,
    onSuccess(result) {
      if (Array.isArray(result) && result.length === 0) {
        global.$message.success(global.$t('添加成功'));
        addMemberRef.value.form.resetFields();
      }
    },
  },
);

const doAddMember = () => {
  addMemberRef.value.form.validate((valid) => {
    console.log(valid);
    if (valid) {
      requestAddMember(addMemberRef.value.data);
    } else {
      return false;
    }
  });
};

</script>

<style lang="scss" scoped>
.member-register-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;
  text-align: left;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin: 0 0 20px;
    text-align: left;
  }

  :deep(.el-form-item) {
    width: 500px;
  }
}
</style>
