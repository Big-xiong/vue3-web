<template>
  <div class="hotGame-wrap">
    <div class="align-center-wrap-1200">
      <h2 class="tit">{{ $t(`热门游戏 应有尽有`) }}</h2>
      <p class="subtit">POPULAE GAMES HAVE EVERYTHING</p>
      <div class="hotGame-con">
        <div class="hot-cover">
          <img
            :src="$getSrc(`/src/assets/images/AMX/channel/pic0${hotListIndex + 1}.png`)"
            alt
          />
        </div>
        <div class="hot-play">
          <!-- <img
            src="/src/current_project/assets/images/channel/line-t.png"
            alt
          /> -->
          <svg-icon name="line-t" />
          <div
            class="play-btn"
            @click="$router.push(hotList[hotListIndex].path)"
          >
            <span>
              {{ $t(`开始`) }}
              <br />
              {{ $t(`游戏`) }}
            </span>
          </div>
          <svg-icon name="line-b" />
          <!-- <img
            src="/src/current_project/assets/images/channel/line-b.png"
            alt
          /> -->
        </div>
        <div class="hot-info">
          <div class="hot-t">
            <div class="hot-desc">
              <p class="hot-eng">{{ hotList[hotListIndex].eng }}</p>
              <div class="hot-chi">
                <!-- <img
                  src="/src/current_project/assets/images/channel/hot.png"
                  alt
                /> -->
                <svg-icon name="dot" />
                <i></i>
                <span>{{ hotList[hotListIndex].tit }}</span>
              </div>
              <p
                class="hot-tip"
                v-html="hotList[hotListIndex].desc"
              ></p>
            </div>
            <div class="hot-tab">
              <div
                v-for="(item, index) in 4"
                :key="index"
                :class="hotListIndex === index ? 'active' : ''"
                @mouseenter="hotListIndex = index"
              >
                <img
                  class="cover"
                  :src="$getSrc(`/src/assets/images/AMX/channel/thumb0${index + 1}.jpg`)"
                  alt
                />
                <div class="hot-show">
                  <img
                    :src="$getSrc(`/src/assets/images/AMX/channel/thumb0${index + 1}-gray.jpg`)"
                    alt
                  />
                  <!-- <img
                    :src="
                      $getSrc(`/src/current_project/assets/images/channel/thumb0${index + 1}-dot.png`)
                    "
                    alt
                  /> -->
                  <svg-icon :name="`thumb0${index + 1}-dot`" />
                </div>
              </div>
            </div>
          </div>
          <div class="hot-b">
            <div
              v-for="(item, index) in hotList[hotListIndex].hotGame"
              :key="index"
              :class="hotListIndex === index ? 'active' : ''"
              @click="$router.push(hotList[hotListIndex].path)"
            >
              <img
                :src="$getSrc(`/src/current_project/assets/images/channel/hot0${hotListIndex + 1}.${index + 1}.png`)"
                alt
              />
              <p>{{ item.tit }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  inject,
  ref,
} from 'vue';

const subConfig = inject('subConfig');
const global = inject('global');
const hotListIndex = ref(0);
const hotList = [
  {
    name: '',
    path: '/real',
    tit: global.$t(`视讯直播`),
    eng: 'LIVE CASINO',
    desc:
      `${global.$t(`最美荷官在线互动，带您玩转百家乐、骰宝、轮盘、牛牛、炸金花等<br />多款真人视讯游戏，国际标准、公平公正，极致享受尽在{0}`, [subConfig.title])}`,
    hotGame: [
      {
        tit: global.$t(`百家乐`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot01.1.png'),
      },
      {
        tit: global.$t(`骰宝`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot01.2.png'),
      },
      {
        tit: global.$t(`轮盘`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot01.3.png'),
      },
      {
        tit: global.$t(`龙虎斗`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot01.4.png'),
      },
    ],
  },
  {
    name: '',
    path: '/sport',
    tit: global.$t(`体育赛事`),
    eng: 'SPORTS',
    desc:
      global.$t(`最多投注类型，最强投注体验，支持提前兑现，各种趣味玩法，最全<br>赛事覆盖助你花式收米赢到人生巅峰！`),
    hotGame: [
      {
        tit: global.$t(`足球`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot02.1.png'),
      },
      {
        tit: global.$t(`篮球`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot02.2.png'),
      },
      {
        tit: global.$t(`网球`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot02.3.png'),
      },
      {
        tit: global.$t(`棒球`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot02.4.png'),
      },
    ],
  },
  {
    name: '',
    path: '/esport',
    tit: global.$t(`电竞赛事`),
    eng: 'E-SPORTS',
    desc:
      global.$t(`亚洲最专业的电子竞技竞猜平台,专为各种电竞玩家和爱好者设计，拥有最顶级的视觉界面及高效的投注体验，汇聚全网最新最热的赛事供您选择！`),
    hotGame: [
      {
        tit: global.$t(`王者荣耀`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot03.1.png'),
      },
      {
        tit: global.$t(`和平精英`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot03.2.png'),
      },
      {
        tit: global.$t(`英雄联盟`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot03.3.png'),
      },
      {
        tit: global.$t(`守望先锋`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot03.4.png'),
      },
    ],
  },
  {
    name: '',
    path: '/lottery',
    tit: global.$t(`彩票游戏`),
    eng: 'LOTTERY',
    desc:
      '专注于彩票游戏行业多年，拥有经典彩种、玩法。还有超多独家创新玩<br>法，足够新颖，极易操作的游戏界面，更是在您游戏过程中增光添彩！',
    hotGame: [
      {
        tit: global.$t(`腾讯分分彩`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot04.1.png'),
      },
      {
        tit: global.$t(`重庆时时彩`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot04.2.png'),
      },
      {
        tit: global.$t(`北京赛车`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot04.3.png'),
      },
      {
        tit: global.$t(`香港六合彩`),
        pic: global.$getSrc('/src/current_project/assets/images/channel/hot04.4.png'),
      },
    ],
  },
];
</script>
<style lang="scss" scoped>
@import '@current/font/DINPro-CondBold.css';

.hotGame-wrap {
  padding: 56px 0 26px;
  background-color: var(--bg-color-0d1720);

  .play-btn {
    width: 97px;
    height: 97px;
    position: relative;
    text-align: center;
    padding-top: 30px;
    font-size: 14px;
    color: var(--font-color-fff);
    margin: -48px auto 0;
    cursor: pointer;
    box-sizing: border-box;

    &:hover::after {
      transform: rotate(180deg);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('/src/current_project/assets/images/channel/play-bg.png') no-repeat;
      background-size: cover;
      transition: 0.3s;
    }

    span {
      position: relative;
      z-index: 2;
      line-height: 18px;
    }
  }

  h2 {
    font-size: 36px;
    color: var(--font-color-333);
    font-weight: bold;
    margin: 0;
  }

  .subtit {
    font-size: 10px;
    color: var(--font-color-666);
    margin-top: 5px;
  }

  .hotGame-con {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hot-cover {
    width: 412px;
    height: 460px;

    img {
      display: block;
      width: 100%;
    }
  }

  .hot-play {
    .svg-icon {
      width: 20px;
      height: 102px;
    }

    .play-btn {
      width: 130px;
      height: 130px;
      margin: 7px 0;
      padding-top: 47px;
      box-sizing: border-box;
    }
  }

  .hot-info {
    flex: 1;

    .hot-info {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      margin-left: 23px;
    }

    .hot-t {
      display: flex;
      align-items: flex-end;
    }

    .hot-desc {
      flex: 1;
      text-align: right;

      .hot-eng {
        font-size: 50px;
        color: var(--theme-color);
        font-family: 'DINPro-CondBold';
        line-height: 60px;
        opacity: 0.5;
        margin: 0;
      }

      .hot-chi {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 22px;
        color: var(--color-white);
        font-weight: bold;
        margin: 10px 0;

        .svg-icon {
          width: 12px;
          height: 12px;
        }

        i {
          width: 100px;
          height: 1px;
          opacity: 1;
          background: linear-gradient(90deg, #f4f4f4 2%, #dcdcdc 50%, #f4f4f4 100%);
          margin: 0 20px;
        }
      }

      .hot-tip {
        font-size: 12px;
        line-height: 21px;
        color: var(--font-color-e4e4e4);
        height: 63px;
      }
    }

    .hot-tab {
      font-size: 0;
      width: 212px;
      margin-left: 24px;

      div {
        display: inline-block;
        vertical-align: top;
        width: 106px;
        position: relative;
        cursor: pointer;

        &.active,
        &:hover {
          .hot-show {
            display: block;
          }
        }

        .cover {
          display: block;
          width: 100%;
        }

        .hot-show {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 2;
          display: none;

          img:first-child {
            display: block;
            width: 100%;
            height: 100%;
          }

          .svg-icon {
            position: absolute;
            width: 36px;
            height: 106px;
            top: 0;
            left: 35px;
          }
        }
      }
    }
  }

  .hot-b {
    padding-left: 38px;
    background: url('/src/current_project/assets/images/channel/first_title_game03.png') 72px top no-repeat;
    background-size: 30px auto;
    font-size: 0;
    text-align: right;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 54px;

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 136px;
      height: 136px;
      opacity: 1;
      border: 1px solid var(--border-color-284d7c);
      font-size: 12px;
      color: var(--color-white);
      margin-right: -1px;
      cursor: pointer;

      &:hover {
        border-color: var(--theme-color);
        position: relative;
        z-index: 3;
        color: var(--theme-color);
      }

      img {
        width: 62px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
