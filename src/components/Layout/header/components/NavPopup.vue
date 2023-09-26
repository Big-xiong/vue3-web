<template>
  <div class="nav-popup-wrap">
    <ul>
      <li v-show="subnav.title">
        <div class="top">
          <span>{{ subnav.propotion }}%</span>
          <p>{{ subnav.tip }}</p>
        </div>
        <div class="bottom">
          <span>{{ subnav.title }}</span>
          <el-button
            type="primary"
            @click="$router.push({name:'vip'})"
          >{{ subnav.btnText }}</el-button>
        </div>
      </li>
      <template v-if="subnav?.games?.length">
        <li
          v-for="item in subnav.games"
          :key="item.title"
          :class="{ 'gray-scal': item.enterGame ? $getGameStatus(item, subnav.type) : '' }"
        >
          <div class="top flex">
            <img
              v-if="!item.enterGame"
              @click.stop="go('c', item)"
              :src="$getSrc(item.pic)"
              alt="item"
            />
            <img
              v-else
              @click.stop="$playGame(item, item.typeId)"
              :src="$getSrc(item.pic)"
              alt="item"
            />
          </div>
          <div class="bottom">
            <span>
              {{ item.title }}
              <template v-if="item.enterGame && $getGameStatus(item, subnav.type)">
                ({{$t('维护中')}})
              </template>
            </span>
            <el-button
              type="primary"
              v-if="!item.enterGame"
              @click.stop="go('c', item)"
            >{{ subnav.gameBtn }}</el-button>
            <el-button
              type="primary"
              v-else
              v-login
              @click.stop="$playGame(item, item.typeId)"
            >{{ subnav.gameBtn }}</el-button>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
defineProps({
  subnav: {
    type: Object,
    default: () => ({}),
  },
});

function go(t, item) {
  if (t === 'p') {
    if (item.to) {
      global.$router.push({ name: item.to });
    }
  } else if (t === 'c') {
    if (!item.enterGame) {
      if (item.id) {
        global.$router.push({ name: item.to, query: { id: item.id } });
      } else {
        global.$router.push({ name: item.to });
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.nav-popup-wrap {
  z-index: 3;
  width: 100%;
  height: 0;
  position: absolute;
  transition: all 0.5s ease-out;
  left: 0;
  top: 58px;
  box-sizing: border-box;
  background-color: var(--bg-color-222930);
  display: flex;
  align-items: center;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 70px;
    left: 0;
    bottom: 0;
    background-color: var(--bg-color-2C3239);
    z-index: 1;
  }

  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    position: relative;
    z-index: 2;
    margin: 0 auto;

    li {
      margin: 0 24px;
      min-width: 136px;
      transition: 0.3s;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: flex-end;
      cursor: pointer;
      transition: all 0.5s ease-out;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);

        img {
          transform: scale(1.1);
        }

        .el-button {
          transform: scale(1.1);
        }
      }
      &:first-child .top p {
        width: 185px;
        position: relative;
        transform: translateX(-50%);
        left: 50%;
      }
      .top {
        width: 134px;
        box-sizing: border-box;
        text-align: center;
        img {
          height: 114px;
          transition: all 0.5s ease-out;
        }
        span {
          font-size: 70px;
          font-family: DINAlternate, DINAlternate-Bold;
          font-weight: 700;
          text-align: center;
          color: var(--theme-color);
          line-height: 70px;
        }
        p {
          font-size: 18px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          text-align: center;
          color: var(--theme-color);
          line-height: 25px;
          margin: 0 0 10px;
        }
      }
      .flex {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .bottom {
        padding: 20px 0 9px;
        span {
          font-size: 14px;
          font-family: SourceHanSansCN, SourceHanSansCN-Bold;
          font-weight: 700;
          text-align: center;
          color: var(--font-color-fff);
          line-height: 21px;
          letter-spacing: 1px;
          display: block;
        }
      }
      .el-button--primary {
        min-height: 30px;
        padding: 0 10px;
        min-width: 90px;
        font-size: 12px;
        transition: all 0.5s ease-out;
      }
    }
  }
}
</style>
