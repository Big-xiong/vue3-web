<template>
  <div class="profitRank-wrap">
    <div class="align-center-wrap-1200" v-loading="topLoading">
      <div class="profitRank-wrap-tabs">
        <template v-for="(item, index) in topList" :key="index">
          <div :class="activeIndex === index ? 'active' : ''" @click="goNav(index)">{{ item.name }}</div>
          <i v-show="index !== topList?.length - 1"></i>
        </template>

      </div>

      <div class="profitRank-wrap-top">
        <template v-for="(item, index) in list[activeIndex]?.list">
          <div v-if="index < 3" :key="index" class="layout-flex-between"
            :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/profitRank/pic-rink-${index + 1}.png`)})` }">
            <p class="account">{{ `${$t('账号')}：${item.username}` }}</p>
            <div class="profit">
              <p>{{ $t('今日盈利金额') }}</p>
              <p>¥ {{ priceFormat(item.num) }}</p>
            </div>
            <div class="bet">
              <p>{{ $t('有效投注额：') }}{{ priceFormat(item.valid_bet) }}</p>
              <p>{{ $t('盈利率') }}{{ percent(item.num, item.valid_bet) }}</p>
            </div>
            <el-button type="primary" @click="$playGame(item)">{{ user?.isLogin ? $t('立即跟注') : $t($t('立即注册')) }}
            </el-button>
          </div>
        </template>
      </div>
      <div class="profitRank-wrap-other">
        <ConfigTable :data="list[activeIndex]?.list?.slice(3, list[activeIndex]?.list?.length)" :columns="columns"
          v-loading="recordLoading">
          <template #platform="{ row }">
            <span>{{ dicts?.allplatform[row.platform_id ?? ''] }}</span>
          </template>
          <template #btn="{ row }">
            <span class="pointer follow" @click="$playGame(row)">{{ user?.isLogin ? $t('跟注') : $t('注册') }}</span>
          </template>
        </ConfigTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { newtoplist } from '@/api/home';
import { priceFormat } from '@/utils/index';
import ConfigTable from '@/components/Table/index.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', ['allplatform']);
const { dicts } = $store.state.app;
const activeIndex = ref(0);
const list = ref([]);
const columns = reactive([
  {
    prop: 'index', label: global.$t('排名'), align: 'center', type: 'index', width: '156px', 'class-name': 'bold', index: (value) => value + 4,
  },
  {
    prop: 'username', label: global.$t('会员账号'), align: 'center', formatter: (row) => `${global.$t('账号')}：${row.username}`,
  },
  {
    prop: 'num', label: global.$t('今日盈利金额'), align: 'center', 'class-name': 'bold', formatter: (row) => priceFormat(row.num),
  },
  {
    prop: 'valid_bet', label: global.$t('有效投注额'), align: 'center', formatter: (row) => priceFormat(row.valid_bet),
  },
  {
    prop: 'num', label: global.$t('盈利率'), align: 'center', formatter: (row) => percent(row.num, row.valid_bet),
  },
  {
    prop: 'username', label: global.$t('游戏平台'), align: 'center', slot: 'platform',
  },
  { prop: 'username', align: 'center', slot: 'btn' },
]);
const { data: topList, loading: topLoading } = useRequest(newtoplist, {
  onSuccess(res) {
    list.value = res;
  },
});

function goNav(index) {
  activeIndex.value = index;
}
// 盈利率
function percent(num, vaild) {
  if (parseInt(vaild, 10)) {
    const percentage = ((num / vaild) * 100).toFixed(2);
    return `${percentage}%`;
  }
  return '***';
}

</script>

<style lang="scss" scoped>
.profitRank-wrap {
  min-height: 30vh;

  &-tabs {
    height: 80px;
    background-color: var(--bg-color-282828);
    margin: 40px auto 20px;
    padding: 0 34px;
    overflow-x: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >div {
      font-size: 20px;
      color: var(--font-color-666);
      cursor: pointer;
      position: relative;

      &.active {
        color: var(--theme-color);
      }
    }

    i {
      width: 2px;
      height: 26px;
      opacity: 0.2;
      background: #ffffff;
      border-radius: 2px;
    }
  }

  &-top {
    >div {
      height: 160px;
      margin-bottom: 13px;
      padding: 0 60px 0 300px;
      color: var(--font-color-fff);
      background-size: 100% auto;
      background-repeat: no-repeat;

      &:nth-child(2) {
        .el-button {
          background-color: #fff !important;
          color: var(--font-color-ad8b62) !important;
          border-color: #fff !important;
        }
      }

      &:nth-child(3) {
        .el-button {
          background-color: #fff !important;
          color: var(--font-color-7c86e9) !important;
          border-color: #fff !important;
        }
      }

      p {
        margin: 0;
      }

      .account {
        font-size: 24px;
      }

      .profit {
        text-align: center;

        p {
          letter-spacing: 3px;
        }

        p:first-child {
          font-size: 24px;
          line-height: 33px;
        }

        p:last-child {
          font-size: 34px;
          font-weight: 700;
          line-height: 40px;
        }
      }

      .bet {
        font-size: 18px;
        line-height: 25px;
        color: var(--font-color-fff);
      }
    }

    &-bg1 {
      background: url('/src/current_project/assets/images/profitRank/pic-rink-first.jpg');
    }

    &-bg2 {
      background: url('/src/current_project/assets/images/profitRank/pic-rink-second.jpg');
    }

    &-bg3 {
      background: url('/src/current_project/assets/images/profitRank/pic-rink-third.jpg');
    }
  }

  &-other {
    padding: 0 18px;
    background-color: var(--bg-color-282828);
    margin: 30px 0 80px;

    :deep(.el-table) {
      font-size: 18px;
      color: var(--font-color-000);

      th {
        height: 90px;
        font-weight: normal;
        background-color: transparent !important;
        color: var(--font-color-000) !important;
      }

      td {
        height: 70px;
        background-color: transparent !important;
        border-bottom: 0;

        &.bold {
          font-weight: 700;
        }
      }
    }

    .follow {
      color: var(--theme-color);
      text-decoration: underline;
    }
  }
}
</style>
