<template>
  <div class="esport-wrap">
    <SubBanner id="8" />
    <div class="esport-wrap-list">
      <div class="align-center-wrap">
        <div class="esport-wrap-flex">
          <div
            v-for="(item, index) in esportList"
            :key="index"
            class="esport-wrap-flex-content"
            v-bind:class="{ 'gray-scal': $getGameStatus(item, '电竞') }"
            :style="{ 'background-image': `url(${$getSrc('/src/assets/images/esport/bg.png')})` }"
          >
            <img
              class="logo"
              :src="$getSrc(item.logo)"
              alt
            />
            <img
              class="person"
              :src="$getSrc(item.bjImg)"
              alt
            />
            <div class="esport-wrap-flex-content-tips">
              <p>
                {{ item.title }}
                <template v-if="$getGameStatus(item, '电竞')">
                  ({{$t('维护中')}})
                </template>
              </p>
              <p>{{ item.subTitle }}</p>
              <p>{{ item.tirTitle }}</p>
              <el-button
                type="primary"
                v-login
                @click="$playGame(item, 8)"
              >{{$t(`立即投注`)}}</el-button>
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

const esportList = [
  {
    bjImg: '/src/assets/images/esport/ibc.png',
    title: global.$t(`IBC电竞`),
    subTitle: global.$t(`全球顶级赛事`),
    tirTitle: global.$t(`为战队加油助威`),
    logo: '/src/assets/images/sport/ibc-tit@3x.png',
    default_game_id: 1549,
    game_platform_id: 13,
    name: 'IBC',
  },
  // {
  //   bjImg: '/src/assets/images/esport/bti.png',
  //   title: global.$t(`BTI电竞`),
  //   subTitle: global.$t(`全球顶级赛事`),
  //   tirTitle: global.$t(`为战队加油助威`),
  //   logo: '/src/assets/images/sport/bti-tit@3x.png',
  //   name: '',
  // },
  {
    bjImg: '/src/assets/images/esport/im.png',
    title: global.$t(`IM电竞`),
    subTitle: global.$t(`尖端全面多元`),
    tirTitle: global.$t(`的电竞游戏`),
    logo: '/src/assets/images/sport/im-tit@3x.png',
    default_game_id: 4224,
    game_platform_id: 118,
    name: 'ESB',
  },
];
</script>

<style lang="scss" scoped>
.esport-wrap {
  min-height: 700px;
  &-list {
    padding-top: 30px;
    background: var(--bg-color-e3e3e3);
  }
  &-flex {
    margin: 10px -60px 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
    &-content {
      width: calc(100% / 3 - 60px);
      position: relative;
      text-align: center;
      position: relative;
      background: url('/src/assets/images/esport/bg.png') no-repeat;
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
