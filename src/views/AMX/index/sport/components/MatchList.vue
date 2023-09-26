<template>
  <div
    v-loading="matchLoading"
    class="home-wrap-show"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <header>
      <div class="title-wrap">
        <SvgIcon name="sport_icon" />
        <span>{{ $t('快捷投注') }}</span>
      </div>
      <div class="arrow-wrap">
        <div
          class="home-wrap-show-left"
          @click="change('prev')"
        >
          <i class="el-icon-arrow-left" />
        </div>
        <div
          class="home-wrap-show-right"
          @click="change('next')"
        >
          <i class="el-icon-arrow-right" />
        </div>
      </div>
    </header>
    <div class="home-wrap-show-container">
      <ul :class="{ 'prev-animate': data.prevAnimate, 'next-animate': data.nextAnimate }">
        <li
          v-for="(item, index) in matchList"
          :key="index"
        >
          <header>
            <p class="title">{{ item.title }}</p>
            <p class="time">{{ item.date }}</p>
          </header>
          <div class="content">
            <div class="team">
              <img
                :src="item.left.img"
                alt
              />
            </div>
            <div class="score">
              <img
                :src="$getSrc('/src/current_project/assets/images/sport/channel_vs.png')"
                alt
              />
            </div>
            <div class="team">
              <img
                :src="item.right.img"
                alt
              />
            </div>
          </div>
          <div class="footer">
            <div class="team-score">
              <span>{{ item.left.name }}</span>
              <span>{{ item.left.rate }}</span>
            </div>
            <div class="middle"><span>{{ item.middle }}</span></div>
            <div class="team-score">
              <span>{{ item.right.name }}</span>
              <span>{{ item.right.rate }}</span>
            </div>
          </div>
          <div class="shadow">
            <el-button
              type="primary"
              v-login
              @click="$playGame(item)"
            >{{ user?.isLogin ? $t("立即游戏") : $t("立即投注") }}
            </el-button>
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
import { useRequest } from 'ahooks-vue';
import { sports } from '@/api/sports';
import { useInterval, useTimeout } from '@/utils/hooks';
import SvgIcon from '@/components/SvgIcon.vue';

const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', 'allplatform');

const data = reactive({
  prevAnimate: false,
  nextAnimate: false,
});

const { data: matchList, loading: matchLoading } = useRequest(sports, {
  formatResult(result) {
    return result.map((item) => {
      const value = { ...item };
      value.left.rate = value.left.rate < 0 ? '-' : value.left.rate;
      value.right.rate = value.right.rate < 0 ? '-' : value.right.rate;
      return value;
    });
  },
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

// 切换
function change(direction) {
  const type = `${direction}Animate`;
  if (!data[type]) {
    data[type] = true;
    runTimeout(direction);
  }
}

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

</script>

<style lang="scss" scoped>
.home-wrap-show {
  min-width: 1200px;
  position: relative;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 21px;

    .title-wrap {
      font-size: 24px;
      color: var(--font-color-333);

      .svg-icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }

    .arrow-wrap {
      display: flex;
      align-items: center;

      div {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-color-arrow-bg, var(--bg-color-122339));
        color: var(--font-color-333);
        cursor: pointer;

        &.disabled {
          pointer-events: none;
          cursor: not-allowed;
        }

        &:first-child {
          margin-right: 15px;
        }
      }
    }
  }

  &-left,
  &-right {
    cursor: pointer;
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

  &-container {
    height: 100%;
    overflow: hidden;
    height: 200px;
    position: relative;
      border-radius: 6px;

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
        box-sizing: border-box;
        padding: 18px 14px 0 14px;
        position: relative;
        background-color: var(--bg-color-282828);
        margin-right: 10px;
        border-radius: 4px;
        overflow: hidden;

        >.shadow {
          display: none;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: var(--bg-color-00008);
        }

        &:hover {
          >.shadow {
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
              border-radius: 6px !important;

              &:hover {
                background-color: var(--theme-color) !important;
                color: var(--font-color-fff) !important;
              }
            }
          }
        }

        header {
          display: flex;
          align-items: center;

          >.title {
            width: 100%;
            display: block;
            font-size: 12px;
            height: 22px;
            line-height: 22px;
            color: var(--font-color-333, --font-color-fff);
            font-weight: bold;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          >.time {
            font-size: 12px;
            text-align: center;
            line-height: 17px;
            color: var(--cur-color-fff05);
            white-space: nowrap;
          }

        }

        >.content {
          margin-top: 32px;
          display: flex;
          justify-content: center;

          >.team {
            >img {
              display: block;
              width: 44px;
              height: 44px;
              margin: 0 auto 10px;
            }

            >.name {
              color: var(--font-color-333, --font-color-fff);
            }

            >p {
              font-size: 12px;
              color: var(--cur-color-fff05);
              line-height: 17px;
              margin-top: 3px;
              text-align: center;
            }
          }

          >.score {
            margin: 0 48px;
            width: 30px;
            display: flex;
            align-items: center;

            >img {
              display: block;
              width: 100%;
              margin: 0 auto 3px;
            }

            >p {
              font-size: 12px;
              color: var(--cur-color-fff05);
              line-height: 17px;
              text-align: center;
            }
          }
        }
      }

      .footer {
        margin-top: 11px;
        display: flex;
        justify-content: center;

        >div {
          width: 74px;
          height: 45px;
          overflow: hidden;
          background-color: var(--bg-color-202930);
          border-radius: 4px;
        }

        .middle {
          display: flex;
          margin: 0 16px;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: var(--font-color-333, --font-color-fff);

          span {
            opacity: 0.5;
          }
        }

        .team-score {
          padding: 4px 0;
          box-sizing: border-box;

          span {
            line-height: 17px;
            font-size: 12px;
            color: var(--font-color-333, --font-color-fff);

            &:nth-child(2) {
              opacity: 0.5;
            }

            &:nth-child(1) {
              box-sizing: border-box;
              display: block;
              width: 80%;
              margin: 0 auto;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
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
