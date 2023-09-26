<script lang="jsx">
import Table from '@/components/Table/index.vue';

export default defineComponent({
  setup(props, { attrs }) {
    const global = inject('global');
    const $store = inject('store');
    const { agent } = $store.state;
    const tableColumns = reactive([
      {
        prop: 'created_at',
        label: global.$t('账变时间'),
        width: 180,
        slot: 'default',
        formatter: (row) => <span>{row.created_at}</span>,
      },
      {
        prop: 'type',
        minWidth: 100,
        label: global.$t('账变类型'),
        slot: 'default',
        formatter(row) {
          return <span>{agent.memberAccountType[row.type]}</span>;
        },
      },
      {
        prop: 'money',
        minWidth: 120,
        label: global.$t('账变金额'),
        formatter(row) { return (<span v-money={row.money}></span>); },
      },
      {
        prop: 'before_money',
        label: global.$t('操作前余额'),
        width: 180,
        formatter(row) {
          return (<div>
            <div>{global.$t('总')}<span v-money={Number(row.before_money) + Number(row.before_commission_money)}></span></div>
            <div style="margin: -18px 0;">{global.$t('代')}<span v-money={row.before_money}></span></div>
            <div>{global.$t('佣')}<span v-money={row.before_commission_money}></span></div>
          </div>
          );
        },
      },
      {
        prop: 'after_money',
        label: global.$t('操作后余额'),
        width: 180,
        formatter(row) {
          return (<div>
            <div>{global.$t('总')}<span v-money={Number(row.after_money) + Number(row.after_commission_money)}></span></div>
            <div style="margin: -18px 0;">{global.$t('代')}<span v-money={row.after_money}></span></div>
            <div>{global.$t('佣')}<span v-money={row.after_commission_money}></span></div>
          </div>
          );
        },
      },
      {
        prop: 'before_commission_loss',
        label: global.$t('帐变前累积结余'),
        formatter(row) {
          return <span v-money={row.before_commission_loss}></span>;
        },
      },
      {
        prop: 'after_commission_loss',
        label: global.$t('帐变后累积结余'),
        formatter(row) {
          return <span v-money={row.after_commission_loss}></span>;
        },
      },
      {
        prop: 'username',
        label: global.$t('代充帐号'),
      },
      {
        prop: 'mark',
        label: global.$t('备注'),
        formatter: ({ mark }) => <el-tooltip class="item" effect="dark" content={mark} placement="left">
          <span style="cursor:pointer;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{mark}</span>
        </el-tooltip>,
      },
    ]);

    return () => (<div class="table-wrap">
      <header>
        <span>{global.$t('帐变总计 ')}</span>
        <i v-money={attrs?.stat?.money ?? 0}></i>
      </header>
      <Table columns={tableColumns} {...props} {...attrs} stripe />
    </div>);
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
    margin-bottom: 20px;
    font-size: 24px;
    color: var(--font-color-000);
    text-align: left;

    span {
      color: var(--font-color-999);
      font-size: 14px;
    }

    i {
      font-style: normal;
    }
  }
}
</style>
