<template>
  <div class="member-form-wrap">
    <header>{{ $t('会员列表') }}</header>
    <div class="form-wrap">
      <Form ref="MemberFormRef" :columns="memberFormColumns">
        <template #icon>
          <svg-icon name="money-prefix" />
        </template>
        <template #submitSlot>
          <el-button :loading="searchLoading" type="primary" :disabled="searchLoading" icon="el-icon-search"
            @click="doSearch">{{
                $t('查询')
            }}</el-button>
        </template>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref, watch, withDirectives, resolveDirective } from 'vue';
import dayjs from 'dayjs';
import Form from '@/components/Form/index.vue';
import { useDicts } from '@/utils/hooks';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
  searchLoading: Boolean,
  levelList: {
    type: Array,
    default: () => []
  }
});

const moneyDirective = resolveDirective('money');
const global = inject('global');
const emit = defineEmits('search');
let memberFormColumns = reactive([
  [
    {
      // label: global.$t('会员帐号'),
      type: 'input',
      prop: 'username',
      maxlength: '20',
      placeholder: global.$t('请输入会员帐号'),
      rule: []
    },
    [
      {
        // label: global.$t('存款金额'),
        type: 'input',
        prop: 'deposit_min',
        maxlength: '20',
        placeholder: global.$t('最小金额'),
        pair: true,
        rule: [],
        children_prefix: (h) => h(SvgIcon, { name: 'money-prefix' })
      },
      {
        type: 'input',
        prop: 'deposit_max',
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
        // label: global.$t('统计时间'),
        type: 'date-picker',
        prop: 'start_time',
        maxlength: '20',
        format: 'YYYY-MM-DD',
        'value-format': 'YYYY-MM-DD',
        placeholder: global.$t('开始时间'),
        pair: true,
        rule: []
      },
      {
        type: 'date-picker',
        prop: 'end_time',
        maxlength: '20',
        format: 'YYYY-MM-DD',
        'value-format': 'YYYY-MM-DD',
        pair: true,
        placeholder: global.$t('截止时间'),
        rule: []
      }
    ],

    {
      type: 'select',
      prop: 'type',
      maxlength: '20',
      placeholder: global.$t('统计时间'),
      width: '115px',
      list: [
        {
          value: 'statinfo',
          key: 1,
          label: global.$t('统计时间')
        },
        {
          value: 'first_deposit',
          key: 1,
          label: global.$t('首存时间')
        },
        {
          value: 'register',
          key: 1,
          label: global.$t('注册时间')
        }
      ],
      defaultValue: 'statinfo'
    },
    {
      // label: global.$t('会员等级'),
      type: 'select',
      prop: 'level',
      maxlength: '20',
      placeholder: global.$t('会员等级'),
      width: '145px',
      list: [],
      rule: []
    },
    { slot: 'submitSlot' }
  ]
  // [
  //   {
  //     // label: global.$t('首存时间'),
  //     type: 'date-picker',
  //     prop: 'first_deposit_start',
  //     maxlength: '20',
  //     placeholder: global.$t('开始时间'),
  //     pair: true,
  //     rule: [],
  //   },
  //   {
  //     type: 'date-picker',
  //     prop: 'first_deposit_end',
  //     maxlength: '20',
  //     pair: true,
  //     placeholder: global.$t('截止时间'),
  //     rule: [],
  //   },
  // ],
  // [
  //   {
  //     // label: global.$t('注册时间'),
  //     type: 'date-picker',
  //     prop: 'register_start',
  //     maxlength: '20',
  //     placeholder: global.$t('开始时间'),
  //     pair: true,
  //     rule: [],
  //   },
  //   {
  //     type: 'date-picker',
  //     prop: 'register_end',
  //     maxlength: '20',
  //     pair: true,
  //     placeholder: global.$t('截止时间'),
  //     rule: [],
  //   },
  // ],

  // [
  //   {
  //     type: 'select',
  //     prop: 'level',
  //     maxlength: '20',
  //     placeholder: global.$t('统计时间'),
  //     list: [{
  //       value: 1, key: 1, label: global.$t('统计时间'),
  //     }],
  //   },
  //   {
  //     // label: global.$t('会员等级'),
  //     type: 'select',
  //     prop: 'level',
  //     maxlength: '20',
  //     placeholder: global.$t('会员等级'),
  //     list: [],
  //     rule: [],
  //   },
  //   { slot: 'submitSlot' },
  // ],
]);

useDicts('agentmemberlevellist', (levelList) => {
  memberFormColumns[1][2].list = levelList.map((item) => ({
    value: item.level,
    key: item.level,
    label: item.name
  }));
  memberFormColumns = [...memberFormColumns];
});

const MemberFormRef = ref(null);

const doSearch = () => {
  const params = {
    ...MemberFormRef.value.data
  };
  // params.start_time = dateFormat('YYYY-MM-DD', params.start_time);
  // params.end_time = dateFormat('YYYY-MM-DD', params.end_time);
  // const keys = Object.keys(params);

  // keys.map((key) => {
  //   if (params[key] instanceof Date) {
  //     return params[key] = dateFormat('YYYY-MM-DD', params[key]);
  //   }
  // });

  // 截止时间包含当天 #20487
  if (params.end_time) {
    params.end_time = dayjs(params.end_time).format('YYYY-MM-DD') + ' 23:59:59';
  }

  emit('search', params);
};
</script>

<style lang="scss" scoped>
.member-form-wrap {
  background-color: var(--block-bg-color);
  border-radius: 6px;
  padding: 30px 30px 8px;

  header {
    color: var(--font-color-000);
    text-align: left;
    font-size: 20px;
    margin-bottom: 20px;
    font-weight: 600;
  }
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

// :deep(.el-select) {
//   width: ;
// }
</style>
