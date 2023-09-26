<template>
  <div class="agent-home-wrap">
    <DateRange
      :loading="loading"
      @query="queryData($event)"
    />
    <UserCount :statisticData="data.statisticData" />
    <TeamCount :statisticData="data.statisticData" />
    <Charts />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRequest } from 'ahooks-vue';
import { agentstatinfo } from '@/api/agent';
import DateRange from './DateRange.vue';
import UserCount from './UserCount.vue';
import TeamCount from './TeamCount.vue';
import Charts from './Charts.vue';

const global = inject('global');

const data = {
  statisticData: {},
};

const { run: queryStatistic, loading } = useRequest(
  agentstatinfo,
  {
    manual: true,
    onSuccess: (result) => {
      data.statisticData = result;
    },
  },
);

queryStatistic();

function queryData(params) {
  console.log(params);
  queryStatistic({
    start_date: params.startTime,
    end_date: params.endTime,
  });
}
</script>

<style lan="scss" scoped>
.agent-home-wrap {
  width: 960px;
}
</style>
