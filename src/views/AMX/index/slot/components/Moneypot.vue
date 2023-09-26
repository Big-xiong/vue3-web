<template>
  <div
    v-loading="dataLoading"
    class="layout-flex-center electron-wrap-num"
  >
    <img
      :src="$getSrc('/src/current_project/assets/images/electron/light1.png')"
      alt
      class="light"
    />
    <img
      :src="$getSrc('/src/current_project/assets/images/electron/light2.png')"
      alt
      class="light2"
    />
    <div
      v-for="item in data.potrankList"
      :key="item.name"
    >
      <p class="money">
        CNY
        <count-to
          :key="item.name"
          :duration="data.jackpotSettings[item.name].duration"
          :decimals="data.jackpotSettings[item.name].decimals"
          :startVal="data.jackpotSettings[item.name].startVal"
          :endVal="data.jackpotSettings[item.name].endVal"
        />
      </p>
      <p class="type">{{ item.name }}{{ $t('电游总彩池') }}</p>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, onMounted } from 'vue';
// import { useRequest } from 'ahooks-vue';
import { useRequest } from 'ahooks-vue';
import { CountTo } from 'vue3-count-to';
import { platformpot } from '@/api/electron';

const data = reactive({
  potrankList: [],
  jackpotSettings: [],
  decimals: 2, // 参数设置
  duration: 5000000000, // 参数设置
});

const { loading: dataLoading } = useRequest(platformpot, {
  onSuccess(res) {
    const { decimals, duration } = data;
    // 为了拉霸效果，设置.5s的动画
    const delay = 500;
    const st = new Date().getTime();
    const obj = res;
    const i = 3;
    const list = [];
    Object.keys(obj).forEach((k) => {
      if (k <= i) {
        list.push(obj[k]);
      }
    });
    list.forEach((val) => {
      data.jackpotSettings[val.name] = {
        startVal: val.pot_money,
        endVal: val.pot_money * 2,
        duration,
        decimals,
      };
    });

    const st2 = new Date().getTime() - st;
    if (st2 > delay) {
      data.potrankList = list;
    } else {
      setTimeout(() => {
        data.potrankList = list;
      }, delay - st2);
    }
  },
});

</script>

<style lang="scss" scoped>
.electron-wrap-num {
  margin-top: 40px;
  padding: 20px;
  height: 168px;
  background: var(--bg-color-282828) url('@img/electron/light-bg.png') center no-repeat;
  background-size: 100% 100%;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  .light,
  .light2 {
    position: absolute;
    width: 100%;
    height: auto;
  }

  .light2 {
    animation: fade 1s linear infinite forwards;
  }

  > div {
    height: 100%;
    flex: 1;

    > .money {
      font-family: 'Din Alternate', Quicksand, 'PingFang SC', 'Hiragino Sans GB', 'Helvetica Neue', 'Microsoft Yahei', sans-serif,
        arial;
      font-size: 30px;
      line-height: 35px;
      color: var(--theme-color);
      text-align: center;
      margin-top: 36px;
      margin-bottom: 0;

      span {
        font-family: 'Din Alternate', Quicksand, 'PingFang SC', 'Hiragino Sans GB', 'Helvetica Neue', 'Microsoft Yahei',
          sans-serif, arial;
      }
    }

    > .type {
      font-size: 18px;
      color: var(--font-color-666);
      text-align: center;
      line-height: 25px;
      margin-top: 14px;
    }
  }
  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
}
</style>
