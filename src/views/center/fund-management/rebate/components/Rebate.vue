<template>
  <div class="rebate-wrap">
    <div class="layout-flex-center rebate-wrap-wash" v-if="!dataObj.noData && dataObj.recordList.length">
      <div>
        <h2 v-money="dataObj.totalMoney"></h2>
        <p>{{ $t('可洗码金额') }}</p>
      </div>
      <el-button type="primary" :loading="oRecordLoading" @click="doRebate">{{ $t('一键洗码') }}</el-button>
    </div>
    <el-space direction="vertical" v-if="!dataObj.noData && !recordLoading">
      <ConfigTable :data="dataObj.recordList" :columns="dataObj.columns" v-loading="recordLoading"
        :total="dataObj.total" :current="dataObj.current" :pageUpdataObj="pageUpdataObj" stripe></ConfigTable>
    </el-space>
    <div class="record-nodata" v-show="dataObj.noData">
      <!--      <img-->
      <!--        src="/src/assets/images/center/rebate/empty@2x.png"-->
      <!--        alt-->
      <!--      />-->
      <svg-icon name="rebate-empty" />
      <p>{{ $t('尊敬的用户，当前由于您尚未达到任何游戏厅的洗码结算要求，暂时无法为您洗码，多多游戏才能多多洗码哦~') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, h, withDirectives, resolveDirective,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { washcodelist, dowashcode } from '@/api/center';
import ConfigTable from '@/components/Table/index.vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const global = inject('global');
const dataObj = reactive({
  startTime: '',
  endTime: '',
  noData: false,
  recordList: [],
  columns: [],
  total: 0,
  current: 1,
  totalMoney: '0.00',
});
const moneyDirective = resolveDirective('money');
const { run: recordRun, loading: recordLoading } = useRequest(
  washcodelist,
  {
    manual: false,
    onSuccess: (res, params) => {
      dataObj.columns = [
        {
          prop: 'game_cate_id',
          label: global.$t('游戏类型'),
          width: '210px',
          formatter: (row) => props?.list?.filter((item) => item.game_cate_id === row.game_cate_id)[0]?.name ?? '',
        },
        {
          prop: 'rate',
          label: global.$t('洗码比例'),
          cellType: 'slots',
          formatter: (row) => `${(row.rate * 100).toFixed(2)}%`,
        },
        {
          prop: 'today_valid_bet',
          label: global.$t('本轮有效投注额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.today_valid_bet]]),
        },
        {
          prop: 'promotion_money',
          label: global.$t('洗码金额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.no_settle_valid_bet]]),
        },
      ];
      dataObj.recordList = res.list;
      dataObj.totalMoney = res.total_money;
      dataObj.noData = !res.list.length;
    },
  },
);

// 洗码
const { run: doRecordRun, loading: oRecordLoading } = useRequest(
  dowashcode,
  {
    manual: true,
    onSuccess: (res, params) => {
      global.$message.success(global.$t('洗码成功'));
      recordRun();
    },
  },
);
function doRebate() {
  doRecordRun();
}
</script>

<style lang="scss" scoped>
.rebate-wrap {
  min-height: 400px;

  &-wash {
    justify-content: flex-start;
    padding: 10px 0 46px;

    h2 {
      font-size: 30px;
      color: var(--theme-color);
      margin: 0;
    }

    p {
      font-size: 14px;
      color: var(--font-color-ccc);
      margin: 0;
    }

    .el-button {
      min-width: 200px;
      margin-left: 70px;
    }
  }

  .config-table-wrap {
    // border-top: 1px solid var(--border-color-e6ecf1);
  }

  .record-nodata {
    .svg-icon {
      width: 94px;
      height: 60px;
      fill: var(--theme-color) !important;
    }
  }
}
</style>
