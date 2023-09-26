<script lang="jsx">
import {
  inject, defineComponent, ref, watch, onMounted,
} from 'vue';
import Table from '@/components/Table/index.vue';
import PreviewImage from './PreviewImage.vue';
import ApplyOmit from './ApplyOmit.vue';

export default defineComponent({
  components: { PreviewImage, ApplyOmit },
  props: ['data', 'total', 'onDialogClose'],
  setup(props, { attrs }) {
    const global = inject('global');
    const $store = inject('store');
    const { agent } = $store.state;
    const subConfig = inject('subConfig');

    onMounted(() => {
      $store.dispatch('agent/getOmitStatusList');
    });

    const tableColumns = [
      {
        prop: 'username',
        label: global.$t('会员账户'),
        slot: 'default',
        minWidth: 120,
        formatter: ({ username }) => <el-tooltip class="item" effect="dark" content={username} placement="bottom">
          <span style="cursor:pointer;">{username}</span>
        </el-tooltip>,
      },
      {
        prop: 'user_region.name',
        label: global.$t('地区'),
        minWidth: 100,
        showCurrency: subConfig.isCurrency,
      },
      {
        prop: 'user_currency.name',
        label: global.$t('货币'),
        minWidth: 100,
        showCurrency: subConfig.isCurrency,
      },

      {
        prop: 'audit_status',
        label: global.$t('审核状态'),
        minWidth: 120,
        slot: 'default',
        formatter({ audit_status }) {
          return <span>{agent.omitStatusList[audit_status]}</span>;
        },
      },
      {
        prop: 'created_at',
        minWidth: 120,
        label: global.$t('新增时间'),
      },
      {
        prop: 'audit_time',
        minWidth: 120,
        label: global.$t('审核时间'),
      },
      {
        prop: 'remark',
        label: global.$t('备注'),
        width: 120,
        slot: 'default',
        formatter: ({ remark }) => <el-tooltip class="item" effect="dark" content={remark} placement="bottom">
          <span style="white-space: nowrap">{remark}</span>
        </el-tooltip>,
      },
      {
        prop: 'operation',
        label: global.$t('操作'),
        slot: 'default',
        minWidth: 90,
        fixed: 'right',
        formatter: (row) => (
          <el-button size="mini" type="primary" onClick={() => handleClick(row)}>
            {row.audit_status === 2 ? global.$t('申请') : global.$t('查看')}
          </el-button>
        ),
      },
    ];
    const newColumns = tableColumns.filter((item) => item.showCurrency !== false);
    const target = ref({});
    const isShowDialog = ref(false);

    function handleClick(row) {
      target.value = row;
      isShowDialog.value = true;
    }

    return () => <div class="member-table-wrap">
      <Table {...props} {...attrs} columns={newColumns} stripe />
      {isShowDialog.value && <ApplyOmit v-model={isShowDialog.value}
        target={target.value} onDialogClose={props.onDialogClose} />}
    </div>;
  },
});

</script>

<style lang="scss" scoped>
.member-table-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  margin-top: 20px;
  border-radius: 6px;
  padding: 30px;

  &:deep(.el-table__fixed-right),
  &:deep(.el-table__fixed) {
    &::before {
      content: inherit;
    }
  }
}
</style>
