<template>
  <div class="register-wrap">
    <Register :forgetpass="false" contentPadding="0" />
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
import Register from './components/register.vue';

const $store = inject('store');
const { user } = $store.state;

onMounted(() => {
  $store.commit('user/SET_REGISTER_DIALOG', true);
});
</script>

<style lang="scss" scoped>
.register-wrap {
  > :deep(.login-wrap)>div>div {
    inset: auto !important;
    position: relative !important;
    z-index: 1 !important;
    display: flex;
    justify-content: center;
  }
}
</style>
