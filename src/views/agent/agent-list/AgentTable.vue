<script lang="jsx">
import { inject, defineComponent, ref } from 'vue';
import Table from '@/components/Table/index.vue';
import AdjustDialog from './AdjustDialog.vue';

export default defineComponent({
  props: ['data', 'onSearch'],
  setup(props, { attrs }) {
    const global = inject('global');
    const subConfig = inject('subConfig');
    const tableColumns = [
      {
        prop: 'username',
        label: global.$t('代理账号'),
        minWidth: 120,
        formatter: ({ username }) => <el-tooltip class="item" effect="dark" content={username} placement="bottom">
          <span class="user-wrap-username">{username}</span>
        </el-tooltip>,
      },
      {
        prop: 'region_name',
        label: global.$t('地区'),
        minWidth: 100,
        showCurrency: subConfig.isCurrency,
      },
      {
        prop: 'currency_name',
        label: global.$t('货币'),
        minWidth: 100,
        showCurrency: subConfig.isCurrency,
      },
      {
        prop: 'created_at',
        label: global.$t('注册时间'),
        minWidth: 120,
      },
      {
        prop: 'member_counts',
        label: global.$t('总注册人数'),
        minWidth: 120,
      },
      {
        prop: 'deposit_money_member_counts',
        label: global.$t('总存款人数'),
        minWidth: 120,
      },
      {
        prop: 'deposit_money',
        label: global.$t('总存款'),
        minWidth: 120,
        formatter: (row) => {
          const data = row.deposit_money;
          return <span v-money={data}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'draw_money',
        label: global.$t('总取款'),
        minWidth: 100,
        formatter: (row) => {
          const data = row.draw_money;
          return <span v-money={data || '0.00'}>{data || 0}</span>;
        },
      },
      {
        prop: 'total_bet',
        label: global.$t('总投注'),
        minWidth: 120,
        formatter: (row) => {
          const data = row.total_bet;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'win_or_losss',
        label: global.$t('总盈亏'),
        minWidth: 120,
        formatter: (row) => {
          const data = row.win_or_losss;
          return <span v-money={data}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'rate',
        label: global.$t('佣金比列'),
        minWidth: 100,
        formatter: (row) => (`${row.rate}%`),
      },
      {
        prop: 'operation',
        label: global.$t('操作'),
        slot: 'default',
        minWidth: 110,
        fixed: 'right',
        formatter: (row) => (
          <el-button
            size="mini"
            onClick={() => handleClick(row)}
          >
            {global.$t('佣金调整')}
          </el-button>
        ),
      },
    ];
    const newColumns = tableColumns.filter((item) => item.showCurrency !== false);
    const isShowAdjustDialog = ref(false);
    const adjustTarget = ref({});

    function handleClick(row) {
      // console.log(row);
      isShowAdjustDialog.value = true;
      adjustTarget.value = row;
      console.log(row, 'row');
    }

    return () => (
      <div className="agent-table-wrap">
        <Table {...props} {...attrs} columns={newColumns} stripe />
        <AdjustDialog onSearch={props.onSearch} target={adjustTarget.value} v-model={isShowAdjustDialog.value} />
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.agent-table-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  margin-top: 20px;
  border-radius: 6px;
  padding: 30px;

  :deep(.el-table .el-button) {
    min-height: 25px;
    font-size: 12px;
  }

  :deep(.user-wrap-username) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>
