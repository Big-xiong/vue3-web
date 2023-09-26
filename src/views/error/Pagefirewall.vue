<template>
  <div class="page404-wrap">
    <div class="main-content">
      <div class="text-cn">
        <h4>{{$t('您的IP存在异常')}}</h4>
        <p>{{$t(`您访问的页面已丢失，导致您所尝试的页面无法打开。由此给你带来的不便{0}深表歉意`, [subConfig.title])}}</p>
      </div>
      <div class="text-en">
        <h4>Dear Customers</h4>
        <p>
          The current website is under maintenance,we are temporarily unable to
          provide services for you.We apologize for the inconvenience caused.
        </p>
      </div>
      <el-button
        type="primary"
        @click="$openKefu"
      >{{$t('联系在线客服')}}</el-button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
const subConfig = inject('subConfig');
</script>

<style lang="scss" scoped>
.page404-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  margin-top: calc(0px - var(--header-height));
}
.main-content {
  text-align: left;
  img {
    width: 304px;
    margin-bottom: 55px;
  }

  h4 {
    font-size: 20px;
    font-weight: 600;
    color: var(--font-color-404040);
    line-height: 28px;
    margin-top: 30px;
    margin-bottom: 0;
    text-align: left;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    color: var(--font-color-404040);
    line-height: 22px;
    text-align: left;
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
    text-align: center;
    background-color: var(--theme-color);
    color: var(--font-color-fff);
  }
}
</style>
