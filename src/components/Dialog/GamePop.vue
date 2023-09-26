<template>
  <Dialog
    v-model="modelValue"
    :title="$t('温馨提示')"
    center
    titlePadding="40px 0 0"
    contentPadding="0"
    :footerStyle="{ paddingBottom: '20px' }"
    confirmType="grey"
    :confirmText="$t('新手教程')"
    cancelType="primary"
    :cancelText="$t('立即登录')"
    @onConfirm="goHelp"
    @onClose="goLogin"
    customeClass="tipsDia-wrap"
    v-bind="$attrs"
  >
    <p class="dialog-tips">{{ $t(`为了您更好的体验{0}游戏，建议您登录后进行游戏`, [$t(subConfig.title)]) }}</p>
  </Dialog>
</template>

<script setup>
import { inject } from 'vue';
import Dialog from './index.vue';

const global = inject('global');
const subConfig = inject('subConfig');

defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
});

const projectName = import.meta.env.VITE_APP_PROJECT_NAME;

function goLogin(close) {
  switch (projectName) {
    case '10022':
    case '10068':
    case '10023':
    case '10024':
    case '10070':
    case '10025':
    case '10026':
    case '10027':
    case '10028':
    case '10029':
    case '10065':
    case '10043':
    case '10044':
    case '10066':
    case '10033':
      global.$router.push({ name: 'login' });
      break;
    case '10051':
    case '10052':
      // global.$store.commit('user/SET_LOGIN_DIALOG', true);
      global.$dialog({
        tpl: 'Login'
      });
      break;
    case '10037':
      global.$router.push('/');
    default:
      global.$store.commit('user/SET_LOGIN_DIALOG', true);
  }
  close();
}

function goHelp(close) {
  if (projectName === '10057') {
    global.$router.push({
      name: 'helpQuestion',
      query: { name: global.$t('手机充值教程'), id: 4 }
    });
  } else {
    global.$router.push({ name: 'helpQuestion', query: { id: '0-0' } });
  }
  close();
}
</script>
