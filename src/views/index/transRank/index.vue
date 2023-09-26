<template>
  <div class="widthdrawRank-wrap">
    <div class="align-center-wrap-1200">
      <div class="widthdrawRank-wrap-head">
        <div class="widthdrawRank-wrap-head-top">
          <h2>{{ $t('本周累积取款排行榜') }}</h2>
          <div class="layout-flex-center widthdrawRank-wrap-head-top-list" v-loading="topLoading">
            <div v-for="(item, index) in topList" :key="index">
              <img :src="$getSrc(`/src/assets/images/widthdrawRank/rank${index + 1}.png`)" alt />
              <div class="content">
                <p class="money" v-money="item.money" />
                <p class="name">{{ item.username }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="layout-flex-center widthdrawRank-wrap-head-record">
          <div v-for="(item, index) in record" :key="index">
            <h2>{{ item.title }}</h2>
            <p>{{ item.tips }}</p>
          </div>
        </div>
      </div>
      <div class="widthdrawRank-wrap-record" v-loading="infoLoading">
        <div class="layout-flex-between widthdrawRank-wrap-record-top">
          <p>{{ $t('实时取款动态') }}</p>
          <div class="layout-flex-between">
            <p>
              <span>
                {{ dataInfo.info?.withdraw_today_times ?? 0 }}
                <i>{{ $t('笔') }}</i>
              </span>
              <span>{{ $t('今日取款笔数（笔）') }}</span>
            </p>
            <p>
              <span>
                {{ dataInfo.info?.withdraw_times ?? 0 }}
                <i>{{ $t('笔') }}</i>
              </span>
              <span>{{ $t('当前取款笔数（笔）') }}</span>
            </p>
            <p>
              <span>
                {{ dataInfo.info?.time ?? 0 }}
                <i>{{ $t('分钟') }}</i>
              </span>
              <span>{{ $t('平均到账时间（分钟）') }}</span>
            </p>
          </div>
        </div>
        <div class="widthdrawRank-wrap-record-table">
          <ConfigTable :data="dataInfo.recordList" :columns="dataInfo.columns" v-loading="recordLoading"
            :total="dataInfo.total" :pageUpdate="pageUpdate" :pageSize="20">
            <template #username="{ row }">
              <div class="layout-flex-center username">
                <svg-icon name="money-get" />
                <!-- <svg-icon name="money-save" /> -->
                <span>{{ row.username }}</span>
                <svg-icon :name="`login-vip-${row.level}`" />
              </div>
            </template>
            <template #money="{ row }">
              <span v-money="row.money"></span>
            </template>
            <template #level="{ row }">
              <span>{{ dicts?.memberlevellist?.filter?.(item => item.level === row.level)[0]?.name ?? '' }}</span>
            </template>
            <template #default="{ row }">
              <span :class="statusClass(row.status)">{{ dicts?.allwithdrawstatus?.[row.status] ?? '' }}</span>
            </template>
          </ConfigTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import { withdrawtopinfo, withdrawlistinfo } from '@/api/center';
import ConfigTable from '@/components/Table/index.vue';

const global = inject('global');
const record = reactive([
  {
    title: global.$t('玩家单日累计提款500万'),
    tips: global.$t('玩家单日累计取款500万，快速出款让您尊享VIP尊享体验'),
  }, {
    title: global.$t('单日提款高达 2,000万'),
    tips: global.$t('银行工作时间内，取款1,000万内1小时到账，取款 2,000万内2小时到账'),
  }, {
    title: global.$t('随时洗码1秒到账'),
    tips: global.$t('单一游戏大厅洗码金额达到1元，即可进行结算，1秒即到账，无需漫长等待'),
  },
]);
const rankTit = ['第一名', '第二名', '第三名'];
const dataInfo = reactive({
  current: 1,
  recordList: [],
  columns: [
    {
      prop: 'username', label: global.$t('会员账号'), align: 'center', slot: 'username',
    },
    // {
    //   prop: 'level', label: global.$t('优先级'), align: 'center', slot: 'level',
    // },
    {
      prop: 'money', label: global.$t('金额'), align: 'center', slot: 'money',
    },
    { prop: 'created_at', label: global.$t('提交取款时间'), align: 'center' },
    {
      prop: 'status', label: global.$t('状态'), align: 'center', slot: 'default',
    },
  ],
  total: 0,
  info: {},
});

const { data: topList, loading: topLoading } = useRequest(withdrawtopinfo);
const { run: infoRun, loading: infoLoading } = useRequest(() => withdrawlistinfo({ page: dataInfo.current }), {
  onSuccess(res) {
    dataInfo.recordList = res.list;
    dataInfo.total = res.total;
    dataInfo.info = res.info;
    dataInfo.infoLoading = false;
    record[0].tips = res.info.user_name + global.$t('玩家单日累计取款500万，快速出款让您尊享VIP尊享体验');
  },
});
// 状态样式
function statusClass(status) {
  if (+status === 4 || +status === 2) {
    return 'active_one';
  } if (+status === 1 || +status === 5) {
    return 'active_three';
  }
  return 'active_two';
}
const $store = inject('store');
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', ['memberlevellist', 'allwithdrawstatus']);
// 金额
function moneyFilter(money) {
  if (money) {
    return money.toString().indexOf('.') === -1 ? (`${money}.00`) : money;
  }
}
// 分页
function pageUpdate(val) {
  dataInfo.current = val;
  infoRun();
}

</script>

<style lang="scss" scoped>
.widthdrawRank-wrap {
  padding: 40px 0;

  &-head {
    background-color: var(--rank-head-bg-color-f7f7f7);
    border-radius: 6px 6px 0 0;
    overflow: hidden;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      padding-top: 40px;
      color: var(--font-color-333);
    }

    &-top {
      text-align: center;
      // background: url('@img/widthdrawRank/bg.jpg') no-repeat;
      background-size: 100% 100%;

      &-list {
        align-items: flex-end;
        min-height: 310px;
        position: relative;
        margin-top: 24px;

        >div {
          text-align: center;
          width: 233px;
          height: 261px;
          position: relative;

          img {
            width: 100%;
            display: block;
          }

          .content {
            position: absolute;
            top: 167px;
            width: 100%;
            left: 0;

            .name {
              font-size: 20px;
              color: var(--font-color-333);
              line-height: 30px;
              margin: 0 auto;
              margin-bottom: 10px;
            }

            .money {
              font-size: 20px;
              line-height: 30px;
              font-weight: bold;
              margin: 0;
              color: var(--font-color-333);
            }
          }

          &:first-child {
            position: absolute;
            bottom: 0;
            left: 50%;
            height: 316px;
            transform: translateX(-50%);

            .content {
              top: 180px;
            }
          }

          &:nth-child(2) {
            margin-right: 133px;
          }

          &:nth-child(3) {
            margin-left: 133px;
          }
        }
      }
    }

    &-record {
      align-items: flex-start;

      >div {
        flex: 1;
        padding: 32px 0;
        text-align: center;

        &:nth-child(2) {
          background-color: var(--bg-color-3d3d3d);
        }

        h2 {
          padding-top: 0;
        }

        p {
          width: 292px;
          margin: 23px auto 0;
          font-size: 16px;
          color: var(--font-color-666);
          line-height: 22px;
        }
      }
    }
  }

  &-record {
    margin-top: 28px;
    background-color: var(--block-bg-color);
    border-radius: 8px 8px 0 0;

    &-top {
      padding: 0 60px;
      background-color: var(--theme-color);
      height: 100px;
      border-radius: 8px 8px 0 0;

      p {
        margin: 0;
        font-size: 22px;
        color: var(--font-color-fff);
        text-align: center;
        font-family: DINAlternate-Bold, DINAlternate;

        &:nth-child(2) {
          margin: 0 60px;
        }

        span {
          display: block;
          font-size: 16px;
          color: var(--font-color-fdfdfd);
          line-height: 22px;

          &:first-child {
            color: var(--font-color-fff);
            font-weight: 700;
            margin-bottom: 6px;
            font-size: 30px;
          }

          &:last-child {
            opacity: 0.6;
          }

          i {
            font-style: normal;
            font-size: 14px;
          }
        }
      }
    }

    &-table {
      padding: 0 30px 30px;
      border: 1px solid var(--rank-table-border);
      background-color: var(--rank-table-bg);
      border-radius: 0 0 4px 4px;

      :deep(.el-table) {
        font-size: 16px;
        border-bottom: 1px solid var(--border-color-000-2);

        th,
        td {
          background-color: transparent !important;
        }

        th {
          border-bottom: 1px solid var(--border-color-000-1) !important;
          height: 90px;
          color: var(--font-color-333) !important;
        }

        td {
          border-bottom: 0;
        }
      }

      .username {
        span {
          width: 90px;
        }

        .svg-icon:first-child {
          width: 28px;
          height: 28px;
          margin-right: 10px;
        }

        .svg-icon:last-child {
          width: 56px;
          height: 17px;
          margin-left: 10px;
        }
      }
    }

    :deep(.page-wrap) {
      margin-top: 20px;
    }

    .active_one {
      color: var(--font-color-7fe1df);
    }

    .active_two {
      color: var(--font-color-7c86e9);
    }

    .active_three {
      color: var(--theme-color);
    }
  }
}
</style>
