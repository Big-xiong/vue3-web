<template>
  <div class="header-wrap">
    <Top />
    <Nav />
    <Suspension v-if="$route.path!=='/play'" />
    <div class="right-fixed-slide">
      <!-- 回顶部 -->
      <div
        v-if="btnFlag === true"
        class="go-top"
        @click="backTop"
      >
        <svg-icon name="top" />
        <p>{{ $t("回顶部") }}</p>
      </div>
      <!-- 客服 -->
      <div
        v-if="$store.state.app.dicts?.siteinfo?.kf_online_type === 1"
        class="header-wrap-service"
        @click="$openKefu"
      >
        <img
          src="/src/assets/images/home/kefu.png"
          alt
        />
        <p>{{ $t(`在线客服`) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, onMounted, onBeforeUnmount,
} from 'vue';
import Top from './components/Top.vue';
import Nav from './components/Nav.vue';
import Suspension from './components/Suspension.vue';

const global = inject('global');

const btnFlag = ref(false);

function backTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToTop() {
  const scrollTop = window.pageYOffset
    || document.documentElement.scrollTop
    || document.body.scrollTop;
  btnFlag.value = scrollTop > window.screen.height;
}
onMounted(() => {
  window.addEventListener('scroll', scrollToTop);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollToTop);
});
</script>

<style lang="scss" scoped>
.header-wrap {
  background-color: var(--bg-color-header, var(--bg-color-222930));
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2001;

  .right-fixed-slide {
    width: 80px;
    position: fixed;
    cursor: pointer;
    z-index: 9;
    top: 42%;
    right: 0;
    > div {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 80px;
      height: 80px;
      background: var(--theme-color);
      border-radius: 20px 0 0 0;
      &:not(:last-child) {
        border-bottom: 1px solid var(--border-color-6c6c6c);
      }
      &:only-child {
        border-radius: 20px 0 0 20px !important;
      }
      svg {
        color: var(--font-color-fff);
        font-size: 20px;
      }
      p {
        padding-top: 8px;
        font-size: 14px;
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: center;
        color: var(--font-color-fff);
        line-height: 16px;
        margin: 0;
      }
    }
  }

  &-service {
    opacity: 1;
    border-radius: 0 0 0 20px !important;
    img {
      width: 24px;
    }
  }

  .right-fixed-slide {
    width: 80px;
    position: fixed;
    cursor: pointer;
    z-index: 9;
    top: 42%;
    right: 0;
    > div {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 80px;
      height: 80px;
      background: var(--theme-color);
      border-radius: 20px 0 0 0;
      &:not(:last-child) {
        border-bottom: 1px solid var(--border-color-6c6c6c);
      }
      &:only-child {
        border-radius: 20px 0 0 20px !important;
      }
      svg {
        color: var(--font-color-fff) !important;
        font-size: 20px;
      }
      p {
        padding-top: 8px;
        font-size: 14px;
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: center;
        color: var(--font-color-fff);
        line-height: 16px;
        margin: 0;
      }
    }
  }
}
</style>
