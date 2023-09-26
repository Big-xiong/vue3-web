<template>
  <div class="widthdrawRank-wrap">
    <div class="align-center-wrap-1200">
      <div class="widthdrawRank-wrap-head">
        <div
          class="widthdrawRank-wrap-head-top"
          :style="{ 'background-image': `url(${$getSrc('/src/assets/images/widthdrawRank/bg.jpg')})` }"
        >
          <h2 v-t="'本周累积取款排行榜'"></h2>
          <div class="layout-flex-center widthdrawRank-wrap-head-top-list" v-loading="topLoading">
            <div v-for="(item,index) in topList" :key="index">
              <img :src="$getSrc(`/src/assets/images/widthdrawRank/rank${index + 1}.png`)" alt />
              <div class="line"></div>
              <div class="content">
                <p class="title" v-t="rankTit[index]" />
                <p class="name">{{ item.username }}</p>
                <p class="money" v-money="item.money" />
                <!-- <p class="symbol">RMB</p> -->
              </div>
            </div>
          </div>
        </div>
        <div class="layout-flex-center widthdrawRank-wrap-head-record">
          <div v-for="(item,index) in record" :key="index">
            <h2>{{ item.title }}</h2>
            <p>{{ item.tips }}</p>
          </div>
        </div>
      </div>
      <div class="widthdrawRank-wrap-record" v-loading="infoLoading">
        <div class="layout-flex-between widthdrawRank-wrap-record-top">
          <p v-t="'实时取款动态'" />
          <div class="layout-flex-between">
            <p>
              <span>{{ dataInfo.info?.withdraw_today_times ?? 0 }}{{ $t('笔') }}</span>
              <span v-t="'今日取款'" />
            </p>
            <p>
              <span>{{ dataInfo.info?.withdraw_times ?? 0 }}{{ $t('笔') }}</span>
              <span v-t="'当前取款'" />
            </p>
            <p>
              <span>{{ dataInfo.info?.time ?? 0 }}{{ $t('分钟') }}</span>
              <span v-t="'平均到账时间'" />
            </p>
          </div>
        </div>
        <div class="widthdrawRank-wrap-record-table">
          <ConfigTable
            :data="dataInfo.recordList"
            :columns="dataInfo.columns"
            v-loading="recordLoading"
            :total="dataInfo.total"
            :current="dataInfo.current"
            :pageUpdate="pageUpdate"
          >
            <template #levelIcon="{ row }">
              <div class="layout-flex-center">
                <span>{{ row?.username }}</span>
                <SvgIcon :name="`vip${row?.level}`" />
              </div>
            </template>
            <template #level="{ row }">
              <span
                v-if="dicts?.memberlevellist?.length"
              >{{ dicts?.memberlevellist?.filter(item => item.level === row.level)[0]?.name ?? '' }}</span>
            </template>
            <template #default="{ row }">
              <span
                :class="statusClass(row.status)"
              >{{ dicts?.allwithdrawstatus[row.status] ?? '' }}</span>
            </template>
          </ConfigTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, withDirectives, resolveDirective, h,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { withdrawtopinfo, withdrawlistinfo } from '@/api/center';
import ConfigTable from '@/components/Table/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const moneyDirective = resolveDirective('money');
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
const rankTit = [global.$t('第一名'), global.$t('第二名'), global.$t('第三名')];
const dataInfo = reactive({
  current: 1,
  recordList: [],
  columns: [
    {
      prop: 'username', label: global.$t('会员账号'), align: 'center', slot: 'levelIcon',
    },
    // {
    //   prop: 'level', label: global.$t('优先级'), align: 'center', slot: 'level',
    // },
    {
      prop: 'money', label: global.$t('金额'), align: 'center', formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.money]]),
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
  if (status === 4 || status === 2) {
    return 'active_one';
  } if (status === 1 || status === 5) {
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
    background-color: var(--dark-bg-color-191919, var(--bg-color-f7f7f7));
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
      background-repeat: no-repeat;
      background-size: 100% 100%;

      &-list {
        align-items: flex-end;
        min-height: 310px;
        position: relative;

        > div {
          text-align: center;

          img {
            width: 44px;
            display: inline-block;
            vertical-align: top;
          }

          .line {
            width: 240px;
            height: 30px;
            margin: 0 auto;
            background: var(--rank-first-line-bg);
            box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.26);
            position: relative;
            z-index: 2;
          }

          .content {
            padding-top: 24px;
            width: 230px;
            height: 169px;
            margin: 0 auto;
            box-sizing: border-box;
            background: var(--rank-first-content-bg);

            .title {
              margin: 0;
              // font-family: "FZCSJW--GB1-0";
              font-size: 20px;
              color: var(--font-color-fff);
            }

            .name {
              // font-family: "PingFangSC-Regular";
              font-size: 18px;
              color: var(--font-color-fff);
              line-height: 30px;
              background: var(--bg-color-000-2);
              border-radius: 15px;
              margin: 0 auto;
              margin-top: 17px;
              margin-bottom: 10px;
              width: 120px;
              height: 30px;
            }

            .money {
              // font-family: "DINAlternate-Bold";
              font-size: 26px;
              line-height: 30px;
              font-weight: bold;
              margin: 0;
              color: var(--font-color-fff);
            }

            .symbol {
              line-height: 25px;
              font-size: 18px;
              font-weight: 400;
              color: var(--font-color-fff);
              margin: 0;
            }
          }

          &:first-child {
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -135px;
            z-index: 4;

            .line {
              width: 260px;
            }

            .content {
              height: 200px;

              .money {
                font-size: 32px;
              }
            }
          }

          &:nth-child(2) {
            margin-right: 100px;

            .line {
              background: var(--rank-second-line-bg);
            }

            .content {
              background: var(--rank-second-content-bg);
            }
          }

          &:nth-child(3) {
            margin-left: 100px;

            .line {
              background: var(--rank-third-line-bg);
            }

            .content {
              height: 150px;
              background: var(--rank-third-content-bg);

              .name {
                margin: 11px auto 6px;
              }

              .money {
                font-size: 18px;
              }
            }
          }
        }
      }
    }

    &-record {
      > div {
        flex: 1;
        padding: 32px 0;
        text-align: center;

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

    &-top {
      padding: 0 60px;
      background-color: var(--theme-color);
      height: 100px;

      p {
        margin: 0;
        font-size: 22px;
        color: var(--font-color-fff);
        text-align: center;

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
            font-size: 20px;
          }
        }
      }
    }

    &-table {
      padding: 0 30px 30px;
      background-color: var(--dark-bg-color-191919, var(--bg-color-fff));

      :deep(.el-table) {
        font-size: 16px;

        tbody {
          border-bottom: 1px solid var(--border-color-000-1);
          .svg-icon {
            font-size: 50px;
            margin-left: 6px;
            fill: var(--theme-color) !important;
          }
        }

        th,
        td {
          background-color: transparent !important;
          border-bottom: 0 !important;
          color: var(--font-color-333);
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

  .level-icon {
    width: 30px;
    margin-left: 5px;
  }
}
</style>
