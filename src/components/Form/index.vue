<script lang="jsx">
import {
  h, ref, reactive, defineComponent, watch, inject,
} from 'vue';

const Component = ({
  data, prop, value, type, width, slot, optionLabel, renderOption, ...args
}) => {
  const global = inject('global');
  const config = {
    style: { width },
    ...args,
  };
  const childrens = [].concat(...Object.entries(args).filter((item) => item[0].startsWith('children'))
    .map((item) => {
      const [child, slotName] = item[0].split('_') ?? [];
      return [...item, slotName];
    }));
  const slots = {};
  if (childrens.length) {
    let num = 0;
    childrens.forEach((s, i) => {
      if (num && num % 2 === 0) {
        slots[childrens[i]] = () => childrens[i - 1](h);
        num = 0;
      } else {
        num += 1;
      }
    });
  }
  switch (type) {
  case 'input':
  case 'password':
  case 'textarea':
  case 'number':
    return <el-input v-model={data[prop]} type={args[type] ?? type} v-slots={slots} {...config} />;
  case 'date-picker':
    return <el-date-picker v-model={data[prop]} type={args[type] ?? 'date'} {...config} />;
  case 'cascader':
    // return <el-cascader v-model={data[prop]} options={args.list} {...config} />;
    return (
      <el-cascader v-model={data[prop]} options={args.list} {...config} v-slots={{ default: (node) => (renderOption ? renderOption(node) : node.data[config.props.label]) }} />
    );
  case 'select':
    // console.log('=-=========', args.list);
    return (
      <el-select v-model={data[prop]} {...config} noDataText={args?.noDataText ?? global.$t('无数据')} popperAppendToBody={false}>
        {args?.list?.length && args?.list?.map((option, index) => <el-option
          key={option[value]}
          {...option}
          label={option[optionLabel ?? option.label] || option.label}
          value={option[value] || option.value}>
          {renderOption?.(option, h)}
        </el-option>)}
      </el-select>
    );
  default:
  }
};

export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    flexWrap: {
      type: Boolean,
      default: true,
    },
  },
  emit: ['onChange'],
  setup(props, ctx) {
    // 拍平成一维数组进行逻辑处理
    const columns = [].concat(...props.columns);
    // 声明form组件实例
    const form = ref(null);
    // 根据columns prop动态生成响应式数据供双绑使用
    const data = reactive(
      // 目前只用到2层
      columns.flat(2).filter((item) => item.prop)
        .reduce((curr, next) => ((curr[next.prop] = next.defaultValue ?? ''), curr), {}),
    );
    // 目前只用到2层
    // 提供placeholder = label的初始值设定功能
    columns.forEach((item) => {
      if (['label'].includes(item.placeholder)) item.placeholder = item.label;
    });
    // 动态获取每行的rules配置
    const rules = columns.flat(2).filter((item) => item.rule)
      .reduce((curr, next) => {
        next.rule.forEach((child) => {
          // 提供placeholder = label | placeholder的初始值设定功能
          if (['label', 'placeholder'].includes(next.placeholder)) child.message = next[child.placeholder];
        });
        curr[next.prop] = next.rule;
        return curr;
      }, {});

    watch(props.columns, () => {
      const newColumns = props.columns.flat(2).filter((item) => item.prop)
        .reduce((curr, next) => ((curr[next.prop] = data[next.prop] ?? next.defaultValue), curr), {});
      for (const key in newColumns) {
        data[key] = newColumns[key];
      }
    });
    // 当data数据变动时，抛出onChange事件
    watch(data, () => {
      ctx.emit('onChange', data);
    });
    // 刷新组件的key，Select场景使用比较多
    const updateKey = ref(0);
    // 当传入的prop columns变动时，更新刷新组件的key
    watch(props, () => {
      updateKey.value = new Date().getTime();
    });
    // Vue3抛出组件内容供外部使用
    ctx.expose({
      data,
      form,
    });

    function renderFormComponent(formItem, index) {
      const {
        label, prop, ...args
      } = formItem;
      if (!args.type) {
        return ctx.slots?.[args.slot]?.();
      }
      return (
        <el-form-item key={index} label={label} prop={prop} block={false}>
          <Component {...args} data={data} prop={prop} />
          {ctx.slots?.[args.slot]?.()}
        </el-form-item>
      );
    }

    function renderPair(formItem, index) {
      const {
        label: pairLabel, prop: pareProps, slot,
      } = formItem[0];
      return (
        <el-form-item key={index} label={pairLabel} prop={pareProps}>
          <div className="config-form-wrap-pair">
            {formItem.map(({
              label, prop, block = false, ...args
            }, childIndex) => (
              <>
                <Component {...args} data={data} prop={prop} />
                {childIndex === 0 && <div className="line" />}
              </>
            ))}
          </div>
          {ctx.slots?.[slot]?.()}
        </el-form-item>
      );
    }

    function renderFromItem(formItem, index) {
      if (Array.isArray(formItem)) {
        const pairItems = formItem.filter((item) => item.pair);
        if (pairItems.length === 2) {
          return renderPair(pairItems, index);
        }

        return (
          <div className="config-form-wrap-group">
            {formItem.map((subFormItem, subIndex) => renderFromItem(subFormItem, subIndex))}
          </div>
        );
      }

      return renderFormComponent(formItem, index);
    }

    const labelFontSize = ctx.attrs['label-font-size'];
    const labelColor = ctx.attrs['label-color'];

    return () => (
      <el-form class={{ 'config-form-wrap': true, 'flex-wrap': props.flexWrap }} ref={form} model={data} rules={rules} {...ctx.attrs}>
        {props.columns.map((item, index) => renderFromItem(item, index))}
      </el-form>
    );
  },
});
</script>

<style lang="scss" scoped>
.config-form-wrap {
  &.flex-wrap {
    .config-form-wrap-group {
      flex-wrap: wrap;
    }
  }

  &:not(.el-form--label-top) {
    :deep(.el-form-item) {
      align-items: center;
      justify-content: flex-start;

      .el-form-item__label {
        width: 90px;
        line-height: 1.2;
        font-size: v-bind(labelfontsize);
        color: v-bind(labelcolor);
        font-weight: 300;
      }
    }
  }

  &.el-form--label-top {
    .config-form-wrap-group {
      align-items: flex-end;

      .el-form-item {
        flex: 1;
      }
    }
  }

  &-group {
    display: flex;
    align-items: flex-start;
    width: 100%;

    &:only-child {
      .el-form-item {
        flex: initial;
        margin-right: 20px;
      }
    }

    .el-form-item {
      &:not(:last-child) {
        margin-right: 20px;
      }

      &[block="true"] {
        flex: auto;
        max-width: 100%;
        width: 100%;
      }
    }

    :deep(.el-form-item__content) {
      display: flex;
    }
  }

  :deep(.el-textarea__inner) {
    border-color: var(--border-color-e2e2e2);
  }

  :deep(.el-input__count) {
    background-color: transparent;
  }

  &-pair {
    width: 420px;
    height: 45px;
    border: 1px solid var(--border-color-e2e2e2);
    box-sizing: border-box;
    border-radius: 6px;
    flex: none;
    display: flex;
    align-items: center;

    :deep(.el-input__inner) {
      border-color: transparent !important;
      background-color: transparent !important;
      text-align: center;
    }

    :deep(.start-date) {
      .el-input__prefix {
        width: 45px;
      }
    }

    :deep(.end-date) {
      .el-input__prefix {
        .el-input__icon {
          display: none;
        }
      }
    }

    .line {
      width: 10px;
      height: 1px;
      background-color: var(--font-color-999);
    }
  }
}
</style>
