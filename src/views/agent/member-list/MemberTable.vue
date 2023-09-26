<script lang="jsx">
import Table from '@/components/Table/index.vue';
// import TransformDialog from './TransformDialog.vue';

export default defineComponent({
  props: ['data', 'total'],
  setup(props, { emit, attrs }) {
    const global = inject('global');
    const subConfig = inject('subConfig');
    const tableColumns = [
      {
        prop: 'username',
        label: global.$t('会员账户'),
        slot: 'default',
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
        prop: 'level',
        label: global.$t('等级'),
        minWidth: 120,
      },
      {
        prop: 'status',
        label: global.$t('状态'),
        width: 60,
        slot: 'default',
        formatter: ({ status }) => {
          let message = '';
          if (status === 1) {
            message = global.$t('正常');
          } else if (status === 2) {
            message = global.$t('冻结');
          } else {
            message = global.$t('未知');
          }
          return (
            <span>
              {message}
            </span>
          );
        },
      },
      {
        prop: 'recharge',
        label: global.$t('存款'),
        width: 120,
        slot: 'default',
        formatter: (row) => {
          const data = row.user_wallet_static.deposit_money;
          return <span v-money={data}>{data || ''}</span>;
        },
      },
      {
        prop: 'withdraw',
        label: global.$t('取款'),
        width: 120,
        slot: 'default',
        formatter: (row) => {
          const data = row.user_wallet_static.draw_money;
          return <span v-money={data}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'bet',
        label: global.$t('总投注额'),
        width: 120,
        slot: 'default',
        formatter: (row) => {
          const data = row.user_wallet_static.bet;
          return <span v-money={data}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'valid_invest',
        label: global.$t('有效投注'),
        width: 120,
        slot: 'default',
        formatter: (row) => {
          const data = row.user_wallet_static.valid_invest;
          return <span v-money={data}>{data || '0.00'}</span>;
        },
      },
      {
        prop: 'payout',
        label: global.$t('派彩'),
        minWidth: 120,
        slot: 'default',
        formatter: (row) => {
          const data = row.user_wallet_static.payout;
          return <span v-money={data}>{data || ''}</span>;
        },
      },
      {
        prop: 'bonus',
        label: global.$t('红利'),
        minWidth: 120,
        slot: 'default',
        formatter: (row) => {
          const data = row.user_wallet_static.benefit_money;
          return <span v-money={data}>{data || ''}</span>;
        },
      },
      {
        prop: 'profit',
        label: global.$t('纯利'),
        minWidth: 120,
        slot: 'default',
        formatter: ({ profit }) => <span v-money={profit}>{profit || ''}</span>,
      },
      {
        prop: 'created_at',
        label: global.$t('注册时间'),
        minWidth: 180,
        slot: 'default',
        formatter: ({ created_at }) => <span style="white-space: pre">{created_at}</span>,
      },
      {
        prop: 'first_recharge_time',
        label: global.$t('首存时间'),
        minWidth: 180,
        slot: 'default',
        formatter: ({ first_recharge_time }) => <span style="white-space: pre">{first_recharge_time}</span>
        ,
      },
      {
        prop: 'gross_profit',
        label: global.$t('下级转账'),
        slot: 'default',
        minWidth: 90,
        fixed: 'right',
        formatter: (row) => (
          <el-button size="mini"
            onClick={() => handleClick(row)}>
            {global.$t('转账')}
          </el-button>
        ),
      },
    ];

    const newColumns = tableColumns.filter((item) => item.showCurrency !== false);

    // const isShowTransformDialog = ref(false);
    // const transformTarget = ref({});

    function handleClick(row) {
      // isShowTransformDialog.value = true;
      // transformTarget.value = row;

      // bug#24781 修改为跳转到下级代充页面
      global.$router.push(`/affiliate/subordinate-charge?membername=${row.username}`);
    }
    return () => <div class="member-table-wrap">
      <Table columns={newColumns} {...props} {...attrs} stripe pageSize={20} pageUpdate={(page) => emit('pageUpdate', { page })} />
      {/* {<TransformDialog v-model={isShowTransformDialog.value}
        target={transformTarget.value}
       />  */}
    </div>;
  },
});
</script>

<style lang="scss" scoped>
.member-table-wrap {
  border: 1px solid var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  margin-top: 20px;
  border-radius: 6px;
  padding: 30px;

  :deep(.user-wrap-username) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>
