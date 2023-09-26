<template>
  <div class="page404-wrap">
    <div class="main-content">
      <div class="text-cn">
        <h4>{{$t('您访问的页面不存在')}}</h4>
        <p>{{$t(`您访问的页面已丢失，导致您所尝试的页面无法打开。由此给你带来的不便{0}娱乐深表歉意`,[subConfig.title])}}</p>
      </div>
      <div class="text-en">
        <h4>Dear Customers</h4>
        <p>
          The current website is under maintenance,we are temporarily unable to
          provide services for you.We apologize for the inconvenience caused.
        </p>
      </div>
      <el-button @click="$openKefu">{{$t('联系在线客服')}}</el-button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
const subConfig = inject('subConfig');
</script>

<style lang="scss" scoped>
.main-content {
  margin: 50px 0;
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: 304px auto;
  padding-top: 420px;
  background-image: url('/src/assets/images/404/404@2x.png');

  h4 {
    font-size: 20px;
    font-weight: 600;
    color: var(--font-color-ccc);
    line-height: 28px;
    margin-top: 30px;
    margin-bottom: 0;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    color: var(--font-color-999);
    line-height: 22px;
  }

  .text-en,
  .text-cn {
    margin-bottom: 30px;
    text-align: center;

    p {
      width: 546px;
      margin: 0 auto;
    }
  }

  :deep(.el-button) {
    display: block;
    margin: 0 auto;
    text-align: center;
    background-color: var(--theme-color);
    color: var(--font-color-fff);
  }
}
</style>
