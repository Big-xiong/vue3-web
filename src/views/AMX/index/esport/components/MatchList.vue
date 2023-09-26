<template>
  <div
    v-loading="matchLoading"
    class="home-wrap-show"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <div
      v-show="!matchLoading"
      class="home-wrap-show-left"
      @click="change('prev')"
    >
      <i class="el-icon-arrow-left" />
    </div>
    <div
      v-show="!matchLoading"
      class="home-wrap-show-right"
      @click="change('next')"
    >
      <i class="el-icon-arrow-right" />
    </div>
    <div class="home-wrap-show-container">
      <ul :class="{ 'prev-animate': data.prevAnimate, 'next-animate': data.nextAnimate }">
        <li
          v-for="(item, index) in matchList"
          :key="index"
        >
          <p class="title">{{ item.title }}</p>
          <p class="time">{{ item.date }}</p>
          <div class="content">
            <div class="team">
              <img
                :src="item.left.team_logo"
                alt
              />
              <p class="name">{{ item.left.name }}</p>
              <p>{{ item.left.rate }}</p>
            </div>
            <div class="score">
              <img
                :src="$getSrc('/src/current_project/assets/images/sport/channel_vs.png')"
                alt
              />
              <p>{{ item.middle }}</p>
            </div>
            <div class="team">
              <img
                :src="item.right.team_logo"
                alt
              />
              <p class="name">{{ item.right.name }}</p>
              <p>{{ item.right.rate }}</p>
            </div>
          </div>
          <div class="shadow">
            <el-button
              type="primary"
              v-login
              @click="$playGame(item)"
            >{{ user?.isLogin ? $t("立即游戏") : $t("立即投注") }}</el-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, nextTick, watch, onBeforeUnmount,
} from 'vue';
// import { useRequest } from 'ahooks-vue';
import { useRequest } from 'ahooks-vue';
import { gaming } from '@/api/esport';
import { useInterval, useTimeout } from '@/utils/hooks';

const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', 'allplatform');
const { dicts } = $store.state.app;

const data = reactive({
  prevAnimate: false,
  nextAnimate: false,
});

const { data: matchList, loading: matchLoading } = useRequest(gaming, {
  formatResult: (res) => res.map((item) => ({
    ...item,
    game_id: 17,
    platform_id: 28,
  })),
  onSuccess() {
    start();
  },
});

const { run: runInterval, stop: stopInterval } = useInterval(() => change('next'), 3000, { manual: true });

const { run: runTimeout, stop: stopTimeout } = useTimeout((direction) => {
  if (direction === 'prev') {
    matchList.value.unshift(matchList.value[matchList.value.length - 1]);
    matchList.value.pop();
  } else {
    matchList.value.push(matchList.value[0]);
    matchList.value.shift();
  }
  nextTick(() => {
    data.prevAnimate = false;
    data.nextAnimate = false;
  });
}, 500, { manual: true });

// 开始轮播
function start() {
  if (!matchList.value?.length) return;
  stopInterval();
  runInterval();
}

// 停止轮播
function stop() {
  stopInterval();
  stopTimeout();
}

// 切换
function change(direction) {
  const type = `${direction}Animate`;
  if (!data[type]) {
    data[type] = true;
    runTimeout(direction);
  }
}

</script>

<style lang="scss" scoped>
.home-wrap-show {
  min-width: 1200px;
  height: 200px;
  position: relative;
  margin-top: 40px;

  &-left,
  &-right {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: -40px;
    width: 26px;
    height: 37px;
    line-height: 37px;
    margin-top: -18px;
    background: var(--bg-color-282828);
    border-radius: 4px;
    text-align: center;

    &:hover {
      color: var(--theme-color);
    }
  }

  &-right {
    left: auto;
    right: -40px;
  }

  &-container {
    height: 100%;
    overflow: hidden;
    position: relative;

    p {
      margin: 0;
    }

    ul {
      width: 2000%;
      height: 100%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: -303px;

      li {
        float: left;
        width: 291px;
        height: 200px;
        position: relative;
        background-color: var(--bg-color-282828);
        margin-right: 10px;
        border-radius: 4px;
        overflow: hidden;

        > .shadow {
          display: none;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: var(--bg-color-00008);
        }

        &:hover {
          > .shadow {
            display: flex;
            align-items: center;
            justify-content: center;

            .el-button {
              border-radius: 2px !important;
              min-height: 38px !important;
              height: 38px !important;
              padding-top: 0;
              padding-bottom: 0;
              line-height: 36px;
              font-size: 14px !important;

              &:hover {
                background-color: var(--theme-color) !important;
                color: var(--font-color-fff) !important;
              }
            }
          }
        }

        > .title {
          display: block;
          font-size: 16px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          margin: 30px 0 0;
          color: var(--font-color-000);
        }

        > .time {
          font-size: 12px;
          text-align: center;
          line-height: 17px;
          color: var(--font-color-999);
          margin-top: 6px;
        }

        > .content {
          margin-top: 15px;
          display: flex;
          justify-content: center;

          > .team {
            > img {
              display: block;
              width: 36px;
              height: 36px;
              margin: 0 auto 10px;
            }

            > .name {
              color: var(--font-color-fff);
            }

            > p {
              font-size: 12px;
              color: var(--font-color-999);
              line-height: 17px;
              margin-top: 3px;
              text-align: center;
            }
          }

          > .score {
            margin: 0 20px;
            width: 80px;

            > img {
              display: block;
              width: 36px;
              height: 48px;
              margin: 0 auto 3px;
            }

            > p {
              font-size: 12px;
              color: var(--font-color-999);
              line-height: 17px;
              text-align: center;
            }
          }
        }
      }

      &::after {
        content: '';
        display: block;
        clear: both;
      }

      &.next-animate {
        transition: all 0.5s;
        margin: 0;
        left: -606px;
      }

      &.prev-animate {
        transition: all 0.5s;
        left: 0;
      }
    }
  }
}
</style>
