<template>
  <div class="sport-wrap">
    <SubBanner id="4" />
    <div class="sport-wrap-list">
      <div class="align-center-wrap">
        <div class="sport-wrap-flex">
          <div v-for="(item, index) in sportList" :class="{ 'gray-scal': $getGameStatus(item, '体育') }" :key="index"
            class="sport-wrap-flex-content"
            :style="{ 'background-image': `url(${$getSrc('/src/assets/images/esport/bg.png')})` }">
            <img class="logo" :src="$getSrc(item.logo)" alt />
            <img class="person" :src="$getSrc(item.bjImg)" alt />
            <div class="sport-wrap-flex-content-tips">
              <p>
                {{ item.title }}
                <template v-if="$getGameStatus(item, '体育')">
                  ({{ $t('维护中') }})
                </template>
              </p>
              <p>{{ item.subTitle }}</p>
              <p>{{ item.tirTitle }}</p>
              <el-button type="primary" v-login @click="$playGame(item, 4)">{{ $t(`立即投注`) }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import SubBanner from '@/components/Banner/sub.vue';

const global = inject('global');

const sportList = [
  {
    bjImg: '/src/assets/images/sport/ibc.png',
    title: global.$t('IBC体育'),
    subTitle: global.$t(`超多盘口`),
    tirTitle: global.$t(`亚洲市占率第一`),
    logo: '/src/assets/images/sport/ibc-tit@3x.png',
    default_game_id: 18,
    game_platform_id: 13,
    name: 'IBC',
  },
  {
    bjImg: '/src/assets/images/sport/bti.png',
    title: global.$t(`BTI体育`),
    subTitle: global.$t(`赛事直播`),
    tirTitle: global.$t(`快速结算`),
    logo: '/src/assets/images/sport/bti-tit@3x.png',
    default_game_id: 9668,
    game_platform_id: 136,
    name: 'BTI',
  },
  {
    bjImg: '/src/assets/images/sport/im.png',
    title: global.$t(`IM体育`),
    subTitle: global.$t(`满足亚洲体育`),
    tirTitle: global.$t(`会员爱好`),
    logo: '/src/assets/images/sport/im-tit@3x.png',
    default_game_id: 4223,
    game_platform_id: 117,
    name: 'IMSB',
  },
];
</script>

<style lang="scss" scoped>
.sport-wrap {
  min-height: 700px;

  &-list {
    padding-top: 30px;
    background: var(--bg-color-e3e3e3);
  }

  &-flex {
    margin: 10px -60px 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 50px;

    &-content {
      width: calc(100% / 3 - 60px);
      text-align: center;
      position: relative;
      background-size: 100% 100%;
      border-radius: 12px;
      overflow: hidden;
      margin: 0 60px 0 0;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        border-top: 124px solid var(--bg-color-4c6ca1);
        border-right: 106px solid transparent;
      }

      .logo {
        position: absolute;
        width: 30%;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
      }

      &:nth-child(2) {
        &::before {
          border-top-color: var(--theme-color);
        }

        .logo {
          width: 146px;
        }
      }

      &:nth-child(3) {
        &::before {
          border-top-color: var(--bg-color-ae2122);
        }

        .logo {
          width: 227px;
        }
      }

      .person {
        width: 100%;
        transition: transform 0.2s;
      }

      &:hover .person {
        transform: scale(1.1);
      }

      &-tips {
        width: 100%;
        position: absolute;
        bottom: 50px;
        text-align: center;

        p:first-child {
          font-size: 30px;
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 600;
          color: var(--theme-color);
          line-height: 45px;
          letter-spacing: 2px;
          margin: 0;
        }

        p:nth-of-type(2) {
          padding-top: 15px;
          margin: 0;
        }

        p:nth-of-type(2),
        :nth-of-type(3) {
          font-size: 20px;
          color: var(--font-color-000);
          line-height: 25px;
          letter-spacing: 1px;
          margin: 0;
        }

        :deep(.el-button) {
          min-width: 240px;
          margin: 20px auto 0;
          font-size: 20px;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>
