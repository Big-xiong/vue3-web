<template>
  <div class="blizzwin-wrap">
    <div class="align-center-wrap">
      <div class="home-card-title">{{$t(`{0}优势`,[subConfig.title])}}</div>
      <div class="layout-flex-between blizzwin-content">
        <div
          v-for="blizzwin in blizzwins"
          :key="blizzwin.title"
          class="blizzwin-item"
        >
          <div class="blizzwin-item-img">
            <img
              :src="$getSrc(blizzwin.imgUrl)"
              alt
            />
          </div>
          <div class="blizzwin-item-title">{{ blizzwin.title }}</div>
          <div class="blizzwin-item-desc top">{{ blizzwin.desc }}</div>
          <div class="blizzwin-item-desc">{{ blizzwin.subDesc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, watchEffect,
} from 'vue';

const global = inject('global');
const subConfig = inject('subConfig');

const blizzwins = ref([]);

watchEffect(() => {
  blizzwins.value = [
    {
      title: global.$t(`实力品牌推荐`),
      desc: global.$t(`英超联赛赞助商`),
      subDesc: global.$t(`业界标杆、信誉领航`),
      imgUrl: '/src/assets/images/home/recommend_icon.png',
      imgStyle: {
        width: '80px',
        height: '80px',
      },
    },
    {
      title: global.$t(`游戏类型齐全`),
      desc: global.$t(`海量体育、真人等娱乐`),
      subDesc: global.$t(`项目，任你挑选`),
      imgUrl: '/src/assets/images/home/category_icon.png',
      imgStyle: {
        width: '65px',
        height: '65px',
      },
    },
    {
      title: global.$t(`多种支付方式`),
      desc: global.$t(`80家合作支付平台，随`),
      subDesc: global.$t(`时随地轻松投注`),
      imgUrl: '/src/assets/images/home/swiping_card_icon.png',
      imgStyle: {
        width: '74px',
        height: '54px',
      },
    },
    {
      title: global.$t(`交易安全快捷`),
      desc: global.$t(`存款立即到账`),
      subDesc: global.$t(`取款仅需100秒`),
      imgUrl: '/src/assets/images/home/safe_icon.png',
      imgStyle: {
        width: '60px',
        height: '70px',
      },
    },
  ];
});
</script>

<style lang="scss" scoped>
.blizzwin-wrap {
  padding: 20px 0 30px;
  background-color: var(--bg-color-f5f5f5);
  .blizzwin-content {
    margin-top: 20px;
    margin-right: -19px;
    align-items: flex-start;
    .blizzwin-item {
      padding: 31px 20px 43px;
      border-top: 6px solid var(--theme-color);
      background-color: var(--bg-color-BLIZZWIN优势);
      color: var(--font-color-333);
      width: calc(25% - 19px);
      box-sizing: border-box;
      margin-right: 19px;
      align-self: stretch;
      .blizzwin-item-img {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 80px;
          height: 80px;
        }
      }
      .blizzwin-item-title {
        margin-top: 22px;
        font-size: 20px;
        font-family: var(--font-family-bold);
        font-weight: 700;
        line-height: 20px;
      }
      .blizzwin-item-desc {
        &.top {
          margin-top: 11px;
        }
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
}
</style>
