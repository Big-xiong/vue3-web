<template>
  <div class="password-question-wrap">
    <Dialog :title="$t('设置新密保问题')" v-model="showPassQuesDia" center :showCancelBtn="false" blockBtn
      :confirmText="$t('完成')" @onConfirm="save" @close="onClose" :loading="saveLoading" :serviceType="1"
      footerBtnWidth="100%" contentPadding="20px 40px 0" footerPadding="0 40px">
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
  inject, reactive, ref, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { passquestion, setpassquestion } from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';

const emit = defineEmits(['closePassQuesDia']);
const passwordRef = ref(null);
const props = defineProps({
  showPassQuesDia: {
    type: Boolean,
    default: false,
  },
});

const global = inject('global');
const $store = inject('store');
const passwordColumns = reactive([
  {
    label: global.$t('请选择新密保问题'),
    placeholder: global.$t('请选择'),
    type: 'select',
    prop: 'question_id',
    list: [],
    width: '100%',
    value: 'value',
    optionLabel: 'label',
    rule: [
      {
        required: true,
        message: global.$t('请选择新密保问题'),
        trigger: 'blur',
      },
    ],
  },
  {
    label: global.$t('密保答案'),
    placeholder: global.$t('请输入答案'),
    type: 'input',
    prop: 'answer',
    rule: [
      {
        required: true,
        message: global.$t('请输入答案'),
        trigger: 'blur',
      },
    ],
  },
  {
    label: global.$t('确认答案'),
    placeholder: global.$t('请输入答案'),
    type: 'input',
    prop: 're_answer',
    rule: [
      {
        required: true,
        message: global.$t('请确认答案'),
        trigger: 'blur',
      },
      {
        validator: (rule, value, callback) => {
          if (passwordRef.value.data.answer !== passwordRef.value.data.re_answer) {
            callback(new Error(global.$t('两次输入答案不同')));
          }
          callback();
        },
      },
    ],
  },
]);

// passquestion().then((res) => {
//   console.log(res);
//   passwordColumns[0].list = res.map((item) => ({
//     key: item.id, label: item.name, value: item.id,
//   }));
// });
const { run: passquestionRun, loading: passquestionLoading } = useRequest(passquestion, {
  onSuccess: (res) => {
    passwordColumns[0].list = res.map((item) => ({
      key: item.id,
      label: item.name,
      value: item.id,
    }));
  },
});

onMounted(() => {
  passquestion().then((res) => {
    passwordColumns[0].list = res.map((item) => ({
      key: item.id,
      label: item.name,
      value: item.id,
    }));
  });
});

const { run: saveRun, loading: saveLoading } = useRequest((params) => setpassquestion(params), {
  manual: true,
  onSuccess: () => {
    global.$message.success(global.$t('设置密保成功'));
    emit('closePassQuesDia', false);
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
  emit('closePassQuesDia', false);
}
</script>

<style lang="scss" scoped>
.password-question-wrap {
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
</style>
