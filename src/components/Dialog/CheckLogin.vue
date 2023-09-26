<template>
  <Dialog v-model="show" :title="$t('温馨提示')" center titlePadding="40px 0 0" contentPadding="0"
    :footerStyle="{ paddingBottom: '20px' }" confirmType="grey" :confirmText="$t('新手教程')" cancelType="primary"
    :cancelText="$t('立即登录')" @onConfirm="$emit('update:show', false)"
    @onClose="close => { global.$dialog({ tpl: 'Login' }); close() }" customeClass="tipsDia-wrap">
    <p class="dialog-tips">{{ $t(`为了您更好的体验{0}游戏，建议您登录后进行游戏`, [$t(subConfig.title)]) }}</p>
  </Dialog>
</template>

<script setup>
import { inject } from 'vue';
import Dialog from './index.vue';

const global = inject('global');
const subConfig = inject('subConfig');

defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});

</script>
