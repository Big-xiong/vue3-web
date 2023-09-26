<script lang="jsx">
import Table from '@/components/Table/index.vue';
import Detail from './Detail.vue';

export default defineComponent({
  setup(props, { emit, attrs }) {
    const global = inject('global');
    const tableColumns = reactive([
      {
        prop: 'start_date',
        label: global.$t('日期'),
        width: 210,
        slot: 'default',
        formatter: (row) => <span>{row.start_date} - {row.end_date}</span>,
      },
      {
        prop: 'valid_members',
        minWidth: 100,
        label: global.$t('有效会员'),
      },
      {
        prop: 'child_commission',
        minWidth: 120,
        label: global.$t('下级抽佣'),
      },
      {
        prop: 'bet',
        label: global.$t('总投注'),
        width: 120,
        formatter: (row) => {
          const data = row.bet;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'win',
        label: global.$t('派彩'),
        width: 120,
        formatter: (row) => {
          const data = row.win;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'bonus',
        width: 120,
        label: global.$t('红利'),
        formatter: (row) => {
          const data = row.bonus;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'platform_fee',
        label: global.$t('平台费'),
        width: 120,
        formatter: (row) => {
          const data = row.platform_fee;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'profit',
        label: global.$t('纯利'),
        width: 120,
        formatter: (row) => {
          const data = row.profit;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'rate',
        label: global.$t('佣金费率'),
        width: '100',
        slot: 'default',
        formatter: (row) => <span>{row.rate * 100}%</span>,
      },
      {
        prop: 'commission',
        label: global.$t('佣金'),
        width: 120,
        formatter: (row) => {
          const data = row.commission;
          return <span v-money={data || '0.00'}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'status',
        label: global.$t('操作'),
        slot: 'default',
        fixed: 'right',
        width: 110,
        formatter: (row) => {
          const { status } = row;
          return (
            <el-button size="mini" onClick={() => showDetail(row)}>
              {global.$t('每日详情')}
            </el-button>
          );
        },
      },
    ]);
    const show = ref(false);
    const start = ref('');
    const end = ref('');
    function showDetail(row) {
      show.value = true;
      start.value = row.start_date;
      end.value = row.end_date;
    }
    return () => (
      <div class="table-wrap">
        <header>
          <i class="el-icon-warning-outline" /><span>{global.$t('佣金计算公式：总投注-总派彩-总红利-平台费=纯利*佣金比例=佣金')}</span>
        </header>
        <Table columns={tableColumns} {...props} {...attrs} stripe pageUpdate={(page) => emit('pageUpdate', { page })} />
        <Detail start={start.value} end={end.value} v-model={show.value} />
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.table-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;

  header {
    color: var(--font-color-F84545);
    text-align: right;
    margin-bottom: 20px;

    i {
      margin-right: 10px;
    }
  }
}
</style>
