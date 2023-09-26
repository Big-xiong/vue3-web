<template>
  <div class="agent-form-wrap">
    <header>{{ $t('代理列表') }}</header>
    <div class="form-wrap">
      <Form ref="AgentFormRef" label-font-size="16px" label-color="#999" :columns="agentFormColumns">
        <template #submitSlot>
          <el-button type="primary" :loading="loading" @click="doSearch" style="width: 300px">{{ $t('查询') }}</el-button>
        </template>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref, defineExpose } from 'vue';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import Form from '@/components/Form/index.vue';
import { agentlist } from '@/api/agent';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const { app } = $store.state;
const agentFormColumns = reactive([
  [
    {
      type: 'input',
      prop: 'username',
      maxlength: '20',
      placeholder: global.$t('请输入代理帐号'),
      rule: []
    },
    [
      {
        type: 'input',
        prop: 'deposit_money_min',
        maxlength: '20',
        placeholder: global.$t('最小金额'),
        pair: true,
        rule: [],
        children_prefix: (h) => h(SvgIcon, { name: 'money-prefix' })
      },
      {
        type: 'input',
        prop: 'deposit_money_max',
        maxlength: '20',
        pair: true,
        placeholder: global.$t('最大金额'),
        rule: []
      }
    ]
  ],
  [
    [
      {
        // label: global.$t('注册时间'),
        type: 'date-picker',
        prop: 'time_start',
        maxlength: '20',
        placeholder: global.$t('开始时间'),
        format: 'YYYY-MM-DD',
        'value-format': 'YYYY-MM-DD',
        pair: true,
        rule: []
      },
      {
        type: 'date-picker',
        prop: 'time_end',
        maxlength: '20',
        pair: true,
        placeholder: global.$t('截止时间'),
        format: 'YYYY-MM-DD',
        'value-format': 'YYYY-MM-DD',
        rule: []
      }
    ],
    {
      type: 'select',
      prop: 'type',
      maxlength: '20',
      placeholder: global.$t('统计时间'),
      width: app.lang === 'en' ? '215px' : '115px',
      list: [
        {
          value: 'statistical',
          key: 1,
          label: global.$t('统计时间')
        },
        {
          value: 'register',
          key: 1,
          label: global.$t('注册时间')
        }
      ],
      defaultValue: 'statistical'
    }
  ],
  [
    {
      type: 'input',
      prop: 'mincounts',
      placeholder: global.$t('请输入最小人数'),
      rule: []
    },
    {
      type: 'select',
      prop: 'counts',
      maxlength: '20',
      placeholder: global.$t('注册人数'),
      width: app.lang === 'en' ? '215px' : '115px',
      list: [
        {
          value: 'member_counts',
          key: 1,
          label: global.$t('注册人数')
        },
        {
          value: 'deposit_money_member_counts',
          key: 1,
          label: global.$t('存款人数')
        },
        {
          value: 'activity_number',
          key: 1,
          label: global.$t('活跃人数')
        }
      ],
      defaultValue: 'member_counts'
    }
    // {
    //   type: 'input',
    //   prop: ' deposit_money_member_counts',
    //   placeholder: global.$t('请输入最小存款人数'),
    //   rule: [],
    // },
    // {
    //   type: 'input',
    //   prop: 'activity_number',
    //   placeholder: global.$t('请输入最小活跃人数'),
    //   rule: [],
    // },
  ],
  // [
  //   {
  //     // label: global.$t('统计时间'),
  //     type: 'date-picker',
  //     prop: 'statistical_time_start',
  //     maxlength: '20',
  //     placeholder: global.$t('开始时间'),
  //     pair: true,
  //     rule: [],
  //   },
  //   {
  //     type: 'date-picker',
  //     prop: 'statistical_time_end',
  //     maxlength: '20',
  //     pair: true,
  //     placeholder: global.$t('截止时间'),
  //     rule: [],
  //   },
  // ],

  {
    slot: 'submitSlot'
  }
]);

const emit = defineEmits('search');
const AgentFormRef = ref(null);
const { run: searchReq, loading } = useRequest(
  (params) => {
    const inte_region_id = Cookies.get('agent_inte_region_id');
    const inte_currency_id = Cookies.get('agent_inte_currency_id');
    params = {
      CACHE: true,
      inte_region_id,
      inte_currency_id,
      ...params
    };

    // 截止时间包含当天 #20488
    if (params.register_time_end) {
      params.register_time_end = dayjs(params.register_time_end).format('YYYY-MM-DD') + ' 23:59:59';
    }
    return agentlist(params);
  },
  {
    manual: false,
    onSuccess(result) {
      result.forEach((item) => {
        item.currency_name = item.currency.name;
        item.region_name = item.region.name;
      });
      emit('search', result);
    }
  }
);

const doSearch = () => {
  const params = {
    username: AgentFormRef.value.data.username,
    deposit_money_min: AgentFormRef.value.data.deposit_money_min,
    deposit_money_max: AgentFormRef.value.data.deposit_money_max,
    tt: new Date().getTime() // 防止 接口缓存
  };
  params[AgentFormRef.value.data.counts] = AgentFormRef.value.data.mincounts;
  if (AgentFormRef.value.data.type === 'statistical') {
    params.statistical_time_start = AgentFormRef.value.data.time_start;
    params.statistical_time_end = AgentFormRef.value.data.time_end;
  } else {
    params.register_time_start = AgentFormRef.value.data.time_start;
    params.register_time_end = AgentFormRef.value.data.time_end;
  }

  // Object
  //   .keys(params)
  //   .map((key) => (params[key] instanceof Date) && (params[key] = dateFormat('YYYY-MM-DD', params[key])));

  searchReq(params);
};

defineExpose({
  loading,
  doSearch
});
</script>

<style lang="scss" scoped>
.agent-form-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px 30px 8px;
  margin-top: 20px;
  text-align: left;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin: 0 0 20px;
    text-align: left;
  }

  :deep(.el-form-item):last-of-type .el-form-item__content {
    display: flex;
  }

  :deep(.config-form-wrap-group) {
    justify-content: flex-start;

    .el-form-item {
      flex-grow: 0;
    }
  }
}

.query-btn {
  margin-left: 10px;
  height: 45px;
  width: 100px;
  align-self: flex-start;
}

:deep(.icon-money-prefix) {
  margin-left: 8px;
  width: 16px;
  height: 16px;
  fill: var(--font-color-525152);
}

:deep(.el-date-editor--date) {
  .el-icon-date {
    color: var(--font-color-525152);
  }
}
</style>
