<script>
import { withDirectives, resolveDirective } from 'vue';
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';

export default {
  name: 'Table',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  setup(props, ctx) {
    const renderColumns = (columns) => columns.map((column) => {
      const { slot, ...args } = column;
      return h(ElTableColumn, args, ctx.slots[slot] ?? null);
    });
    const data = reactive({
      key: 1,
      isReRender: true,
      columns: [],
    });

    watchEffect(() => {
      data.key += 1;
      data.columns = renderColumns(props.columns);
    });

    const pageProps = {
      background: true,
      layout: 'prev, pager, next',
      'current-page': 1,
      ...(props.pageProps ?? {}),
    };

    const tableRef = ref(null);

    const vLoading = resolveDirective('loading');
    return () => h('div', { key: data.key, class: 'config-table-wrap', ref: tableRef }, [
      withDirectives(h(
        ElTable,
        {
          data: props.data,
          style: { width: '100%' },
          ...ctx.attrs,
          'element-loading-background': `var(--main-bg-color-fff)`,
          'custom-loading': true,
        },
        data.columns,
      ), [[vLoading, ctx.attrs.loading]]),
      props?.total > props?.pageSize
        ? h(
          'div',
          { class: 'page-wrap' },
          h(ElPagination, {
            ...pageProps,
            total: props.total ?? 0,
            'current-page': ctx.attrs.current_page || props.current,
            'page-size': props.pageSize,
            onCurrentChange(page) {
              data.isReRender = false;
              pageProps['current-page'] = page;
              const top = tableRef.value.offsetTop - 165;
              document.documentElement.scrollTop = top;
              ctx.attrs.pageUpdate?.(page);
            },
          }),
        )
        : null,
    ]);
  },
};
</script>

<style lang="scss" scoped>
.el-table[custom-loading=true] {
  :deep(.el-loading-mask) {
    opacity: 0.7;
    z-index: 30 !important;
  }
}

:deep(.el-table__row) {
  &.hover-row td {
    background: var(--bg-color-353435);
  }
}
</style>
