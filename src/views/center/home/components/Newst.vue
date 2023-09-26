<template>
  <h2
    class="layout-flex-between center-home-wrap-title pointer"
    @click="$router.push({ name: data.withdrawLists.length ? 'centerAccountChangeRecord' : 'transRank' })"
  >
    <span>{{ data.withdrawLists ? $t('最新动态') : $t('取款排行榜') }}</span>
    <i class="el-icon-arrow-right"></i>
  </h2>
  <template v-if="data.withdrawLists.length">
    <el-carousel
      :interval="4000"
      :loop="true"
      direction="vertical"
      height="140px"
      class="center-home-wrap-lists"
      indicator-position="none"
      v-loading="data.loading"
    >
      <el-carousel-item
        v-for="(item, index) in data.withdrawLists"
        :key="index"
      >
        <div
          v-for="(list, idx) in item"
          :key="idx"
          class="layout-flex-center center-home-wrap-lists-item"
        >
          <div class="layout-flex-between">
            <p>

              <!-- <img
                v-if="list.withdraw_times === 0 || list.withdraw_times"
                src="@/assets/images/center/home/widthdraw-money@2x.png"
                alt
              /> -->
              <svg-icon
                v-if="list.withdraw_times === 0 || list.withdraw_times"
                name="withdraw-icon"
              />
              <svg-icon
                v-else
                name="deposit-icon"
              />
              <!-- <img
                v-else
                src="@/assets/images/center/home/save-money@2x.png"
                alt
              /> -->
              <i>{{ list.username }}</i>
              <el-button @click="Urge">{{ $t('催一下') }}</el-button>
            </p>
            <p class="money">{{ list.money }}</p>
          </div>
          <div class="layout-flex-between">
            <p>{{ list.created_at }}</p>
            <p class="handle">
              {{ $t('处理中') }}
              <span>(14:56)</span>
            </p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </template>
  <template v-else>
    <div
      class="center-home-wrap-top3"
      v-loading="topListLoading"
    >
      <!-- :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/center/home/top${index+1}.png`)})` }" -->
      <div
        v-for="(item,index) in topListData"
        :key="index"
        :class="['center-top3-bg', 'center-top3-bg' + (index + 1)]"
      >
        <div class="title">
          <i>{{ index+1 }}</i>
          <svg-icon
            name="top1-bg"
            v-show="index===0"
          />
        </div>
        <svg-icon name="top-head" />
        <p v-money="item.money"></p>
        <p>{{ item.username }}</p>
      </div>
    </div>
  </template>
</template>

<script setup>
import { inject, reactive, onMounted } from 'vue';
import { useRequest } from 'ahooks-vue';
import { getdepositandwithdrawlist, withdrawtopinfo } from '@/api/center';

const global = inject('global');
const data = reactive({
  withdrawLists: [],
  loading: true,
});

const { data: topListData, loading: topListLoading } = useRequest(() => withdrawtopinfo());

const initdata = reactive([]);
const { run: type2, data: type2data } = useRequest(() => getdepositandwithdrawlist({ type: 2 }), {
  manual: true,
  onSuccess(res) {
    initdata.value = [...res.data];
    for (let i = 0, len = initdata.value.length; i < len; i += 2) {
      data.withdrawLists.push(initdata.value.slice(i, i + 2));
    }
    data.loading = false;
  },
});
const { run: type1 } = useRequest(() => getdepositandwithdrawlist({ type: 1 }), {
  onSuccess(res) {
    initdata.value = res;
    type2();
  },
});

function Urge() {
  global.$message({
    message: global.$t('系统已优先为您处理'),
    type: 'success',
  });
}
</script>

<style lang="scss" scoped>
.center-home-wrap-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--font-color-000);
  margin: 0;
  padding: 20px 20px 15px;

  i {
    color: var(--font-color-999);
    font-size: 14px;
  }
}

.center-home-wrap-lists {
  padding: 0 20px;

  :deep(.el-carousel__container) {
    border-top: 1px solid var(--border-color-525152);
  }

  .el-carousel__item {
    box-sizing: border-box;
  }

  &-item {
    height: 70px;
    color: var(--font-color-b1b1b1);
    font-size: 14px;
    flex-direction: column;
    border-bottom: 1px solid var(--border-color-525152);
    box-sizing: border-box;

    > div {
      width: 100%;

      .svg-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        fill: var(--theme-color) !important;
      }

      p {
        margin: 0;
        font-weight: normal;
        color: var(--font-color-000);

        &.money {
          color: var(--font-color-000);
          font-weight: 600;
        }

        &.handle {
          color: var(--font-color-666);

          span {
            color: var(--font-color-f00);
          }
        }
      }

      i {
        font-style: normal;
        padding: 0 5px;
      }

      .el-button {
        padding: 3px 5px;
        height: auto !important;
        font-size: 12px !important;
        min-height: auto !important;
        border-color: var(--font-color-f00);
        color: var(--font-color-f00);
      }

      &:last-child {
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
}

.center-home-wrap-top3 {
  position: relative;
  height: 135px;
  padding: 0 10px 20px;

  > div {
    position: absolute;
    bottom: 10px;
    width: 140px;
    height: 120px;
    border-radius: 7px;
    background-size: 100% auto;
    box-sizing: border-box;
    background-color: var(--rank-bg-color);
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.08);

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      border-radius: 7px 7px 0 0;
      z-index: 2;
      height: 4px;
      background-color: var(--bg-color-E1C086);
    }

    .icon-top-head {
      width: 50px;
      height: 50px;
      display: block;
      margin: 18px auto;
    }

    .title {
      position: absolute;
      left: 50%;
      top: -8px;
      transform: translateX(-50%);
      width: 16px;
      height: 16px;
      border-radius: 3px;
      background-color: var(--bg-color-E1C086);
      text-align: center;
      line-height: 16px;
      color: #fff;
      z-index: 3;

      i {
        font-style: normal;
        position: relative;
        z-index: 2;
      }
    }

    &:first-child {
      left: 50%;
      transform: translateX(-50%);
      height: 138px;

      .title {
        background-color: transparent;
        width: 23px;
        height: 23px;
        line-height: 28px;
        top: -12px;

        .svg-icon {
          width: 23px;
          height: 23px;
          position: absolute;
          left: 0;
          top: 0;
          fill: var(--bg-color-E1C086);
        }
      }
    }

    &:nth-child(2) {
      left: 20px;

      .title {
        background-color: var(--bg-color-C6C6C6);
      }

      &::after {
        background-color: var(--bg-color-C6C6C6);
      }
    }

    &:nth-child(3) {
      right: 20px;

      .title {
        background-color: var(--bg-color-E6A788);
      }

      &::after {
        background-color: var(--bg-color-E6A788);
      }
    }

    p {
      margin: 0;
      width: 100%;
      z-index: 2;
      font-size: 12px;
      color: var(--font-color-333);
      text-align: center;

      &.wrap-money {
        margin: -20px 0 -10px;
      }

      &:first-child(3) {
        font-family: moneyFont;
      }

      &:nth-child(4) {
        font-weight: bold;
        margin-top: -10px;
      }
    }
  }

  &-avatar {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 138px;
    z-index: 2;
  }

  &-tag {
    position: absolute;
    width: 23px;
    bottom: calc(100% - 10px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
}
</style>
