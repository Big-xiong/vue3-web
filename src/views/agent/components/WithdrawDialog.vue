<script lang="jsx">
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref, defineComponent, watch, withDirectives, resolveDirective,
} from 'vue';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import { withdraw } from '@/api/agent';
import BankIcon from './BankIcon.vue';

export default defineComponent({
  components: { BankIcon },
  props: {
    modelValue: Boolean,
  },
  setup(props, { emit }) {
    const global = inject('global');
    const $store = inject('store');
    const { agent } = $store.state;
    const FormRef = ref(null);
    const moneyDirective = resolveDirective('money');

    const columns = reactive([
      {
        prop: 'withdraw_money',
        type: 'input',
        placeholder: global.$t('请输入提现金额，最低100'),
        label: global.$t('提现金额'),
        children_prefix: (h) => withDirectives(h('span', { style: { paddingLeft: '8px' } }), [[moneyDirective, '']]),
        rule: [
          {
            required: true,
            trigger: 'blur',
            message: global.$t('请输入提现金额，最低100'),
            type: 'number',
            min: 100,
            transform(value) {
              return Number(value);
            },
            validator: (rule, value, callback) => {
              if (!value || value < 100) {
                console.log(global);
                callback(
                  new Error(global.$t(`请输入提现金额，最低100`)),
                );
              } else {
                callback();
              }
            },
          },
        ],
      },
      {
        prop: 'user_bank_id',
        type: 'select',
        label: global.$t('提现卡号'),
        placeholder: global.$t('请选择提现银行卡'),
        list: [],
        renderOption(item, h) {
          return h('div', {
            style: 'display: flex; align-items: center; height: 34px',
            class: 'bank-wrap',
          }, [
            h(BankIcon, {
              bankCode: item.icon_code?.toLowerCase(),
            }),
            h('span', `${item.bank_name}（${item.card_no.slice(-4)}）`),
            h('i', {
              style: {
                display: FormRef.value?.data?.user_bank_id === item.id ? 'block' : 'none',
                marginLeft: 'auto',
              },
              class: 'el-icon-check',
            }),
          ]);
        },
        rule: [{
          required: true,
          trigger: 'change',
          message: global.$t('请选择提现银行卡'),
        }],
      },
    ]);

    watch(() => agent.userInfo, () => {
      columns[1].list = agent.userInfo?.agent_bank.map((item) => ({
        ...item,
        value: item.id,
        label: `${item.bank_name}（${item.card_no.slice(-4)}）`,
      }));
    });

    const { run: postWithdraw, loading } = useRequest(
      (params) => withdraw(params),
      {
        manual: true,
        onSuccess() {
          global.$message.success(global.$t('提现申请成功，正在审核中'));
          emit('update:modelValue', false);
        },
      },
    );
    function onSubmit() {
      FormRef.value.form.validate(async (valid) => {
        if (valid) {
          console.log(FormRef.value.data);
          await postWithdraw({ ...FormRef.value.data });
          $store.dispatch('agent/getUserInfo');
        }
      });
    }

    return () => <div className="withdraw-dialog-wrap">
      <Dialog
        v-model={props.modelValue}
        width="500px"
        confirmLoading={loading.value}
        showCancelBtn={false}
        footerBtnWidth={'100%'}
        confirmText={global.$t('申请提现')}
        contentPadding={'0 40px'}
        onOnConfirm={onSubmit}
        titleBottomBorder
        onClose={() => emit('update:modelValue', false)}
        title={global.$t('代理提现申请')}
        blockBtn
      >
        <div className="withdraw-form-wrap">
          <Form ref={FormRef} label-position="top" columns={columns} />
        </div>
      </Dialog>
    </div>;
  },
});

</script>

<style lang="scss" scoped>
.withdraw-form-wrap {
  margin-top: 20px;
}

:deep(.el-select),
:deep(.el-input__inner) {
  width: 100%;
}

:deep(.wrap-money-integer) {
  display: none;
}
</style>
