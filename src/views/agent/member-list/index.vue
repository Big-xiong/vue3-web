<template>
  <div class="member-list-wrap">
    <MemberForm @search="handleSearch" :searchLoading="searchLoading" />
    <MemberTable v-bind="tableData" :loading="searchLoading" @pageUpdate="searchReq" />
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { memberlist } from '@/api/agent';
import { useDicts } from '@/utils/hooks';
import MemberForm from './MemberForm.vue';
import MemberTable from './MemberTable.vue';

const tableData = ref({});

const searchParams = ref({});

const store = inject('store');
const { dicts } = store.state.app;

useDicts('agentmemberlevellist');

const { run: searchReq, loading: searchLoading } = useRequest(
  (params) => {
    params = { CACHE: true, ...params };
    return memberlist(params);
  },
  {
    manual: false,
    onSuccess(result) {
      const { data, total, current_page } = result;
      tableData.value = {
        total,
        current_page,
        data: data?.map?.((item) => ({
          ...item,
          currency_name: item.currency.name,
          region_name: item.region.name,
          level: dicts?.agentmemberlevellist.find((value) => value.level === item.level)
            .name,
        }))
      }
    },
  },
);

function handleSearch(event) {
  searchParams.value = {
    deposit_max: event.deposit_max,
    deposit_min: event.deposit_min,
    level: event.level,
    username: event.username,
  };
  if (event.type === 'statinfo') {
    searchParams.value.statinfo_end = event.end_time;
    searchParams.value.statinfo_start = event.start_time;
  } else if (event.type === 'first_deposit') {
    searchParams.value.first_deposit_end = event.end_time;
    searchParams.value.first_deposit_start = event.start_time;
  } else {
    searchParams.value.register_end = event.end_time;
    searchParams.value.register_start = event.start_time;
  }
}

watch(() => searchParams, () => {
  searchReq({
    ...searchParams.value,
    page: 1,
  });
}, { deep: true });
</script>

<style lang="scss" scoped>
.member-list-wrap {
  margin-top: 20px;

  &-table {
    margin-top: 30px;
    background-color: var(--bg-color-282828);
    border-radius: 6px;
    padding: 30px;
  }
}
</style>
