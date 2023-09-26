<template>
  <div class="financial-wrap">
    <div class="layout-flex-center">
      <div
        class="financial-wrap-transfer"
        v-loading="allLoading"
      >
        <Form
          :columns="columns"
          ref="formRef"
          label-position="top"
        >
          <template #arrow>
            <!-- <img
              class="financial-wrap-transfer-arrow"
              :src="$getSrc('/src/assets/images/center/transfer/exchange@2x.png')"
              @click="handleArrowFlip"
            /> -->
            <svg-icon
              name="exchange"
              class="financial-wrap-transfer-arrow"
              @click="handleArrowFlip"
            />
          </template>
        </Form>
        <el-button
          type="primary"
          block
          :loading="transLoading"
          style="width: 100%;"
          @click="handleSubmit"
        >{{ $t('确认转账') }}</el-button>
      </div>
      <div
        class="layout-flex-center financial-wrap-money"
        v-loading="moneyLoading"
      >
        <div class="layout-flex-center financial-wrap-money-item">
          <div class="layout-flex-center">
            <h2 v-money="moneyData?.financing_money"></h2>
            <p>{{ $t('钱包总资产(元)') }}</p>
          </div>
          <div class="layout-flex-center">
            <h2 v-money="moneyData?.max_profit"></h2>
            <p>{{ $t('最高收益(元)') }}</p>
          </div>
        </div>
        <div class="layout-flex-center financial-wrap-money-item">
          <h2 v-money="moneyData?.all_profit"></h2>
          <p>{{ $t('历史累计收益(元)') }}</p>
        </div>
        <div class="layout-flex-center financial-wrap-money-item">
          <h2 v-money="moneyData?.month_profit"></h2>
          <p>{{ $t('本月累计收益(元)') }}</p>
        </div>
        <div class="layout-flex-center financial-wrap-money-item">
          <h2 v-money="moneyData?.week_profit"></h2>
          <p>{{ $t('本周累计收益(元)') }}</p>
        </div>
        <div class="layout-flex-center financial-wrap-money-item">
          <h2 v-money="moneyData?.day_profit"></h2>
          <p>{{ $t('昨日收益(元)') }}</p>
        </div>
      </div>
    </div>
    <p class="layout-flex-center financial-wrap-tips">
      <img
        src="/src/assets/images/center/accountSafe/tips.png"
        alt
      />
      <span>{{ $t(`收益会在每天下午6点准时发放哦`) }}</span>
    </p>
  </div>
  <Record :refreshData="refreshData" />
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { moneywallet, allmoneytype, moneytrans } from '@/api/center';
import Form from '@/components/Form/index.vue';
import Record from './components/Record.vue';

const global = inject('global');
const refreshData = ref(false);

const formRef = ref(null);
const firstOption = { label: global.$t('主账户'), value: 0, key: 0 };

const columns = reactive([
  [{
    label: global.$t('账户选择'),
    type: 'select',
    prop: 'from_platform_id',
    list: [],
    value: 'value',
    optionLabel: 'label',
    defaultValue: '0',
    slot: 'arrow',
    width: '140px',
    block: true,
    placeholder: global.$t('账户选择'),
  },
  {
    type: 'select',
    prop: 'to_platform_id',
    value: 'value',
    list: [],
    optionLabel: 'label',
    defaultValue: firstOption.value,
    width: '140px',
    placeholder: global.$t('账户选择'),
  }],
  {
    type: 'input',
    input: 'number',
    prop: 'money',
    children_prefix: (h) => h('span', { style: { paddingLeft: '8px', lineHeight: '45px' } }, '¥'),
    placeholder: global.$t('转入金额'),
    rule: [{
      required: true,
      message: global.$t('请输入转入金额'),
      trigger: 'blur',
    }],
  },
]);
const { data: allData, loading: allLoading } = useRequest(allmoneytype, {
  onSuccess: (res) => {
    let arr = [];
    arr = Object.keys(res).map((item) => ({
      label: res[item], value: item * 1, key: item * 1,
    }));
    formRef.value.data.from_platform_id = 0;
    formRef.value.data.to_platform_id = arr[0].value;
    columns[0][0].list = [firstOption, ...arr];
    columns[0][1].list = [firstOption, ...arr];
    // columns[0].list.push(res)
  },
});
const arrowflip = ref('0');
let isFilp = false;
function handleArrowFlip() {
  arrowflip.value = arrowflip.value === '0' ? '180deg' : '0';
  isFilp = arrowflip.value === '180deg';
}
const { run: transRun, loading: transLoading } = useRequest(moneytrans, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('转账成功'));
    refreshData.value = true;
  },
});
function handleSubmit() {
  formRef.value.form.validate((valid) => {
    if (valid) {
      // console.log(formRef.value.data);
      const { to_platform_id, from_platform_id, money } = formRef.value.data;
      transRun({
        money,
        from_platform_id: isFilp ? to_platform_id : from_platform_id,
        to_platform_id: isFilp ? from_platform_id : to_platform_id,
      });
    } else {
      return false;
    }
  });
}
// 获取金额
const { data: moneyData, loading: moneyLoading } = useRequest(moneywallet);

</script>

<style lang="scss" scoped>
.financial-wrap {
  font-size: 14px;
  border-radius: 0 0 10px 10px;
  padding: 30px 28px;
  border: 1px solid var(--border-color-e2e2e2);
  border-top: 0;
  box-sizing: border-box;

  > .layout-flex-center {
    align-items: flex-start;
  }

  &-transfer {
    width: 320px;

    &-arrow {
      transform: rotate(v-bind(arrowflip));
      width: 22px;
      height: 22px;
      display: block;
      margin: 10px auto -10px;
      cursor: pointer;
      position: absolute;
      right: -30px;
    }
  }

  &-money {
    flex-wrap: wrap;
    position: relative;
    padding-left: 200px;
    margin: 30px 0 0 40px;
    flex: 1;

    &-item {
      border: 1px solid var(--border-color-000-2);
      width: 170px;
      height: 126px;
      margin: 0 0 20px 20px;
      border-radius: 6px;
      flex-direction: column;
      box-sizing: border-box;

      &:first-child {
        position: absolute;
        width: 200px;
        height: 270px;
        top: 0;
        left: 0;
        margin-left: 0;
        text-align: center;

        > div {
          height: 40%;
          flex-direction: column;
        }
      }

      h2 {
        font-size: 21px;
        color: var(--font-color-f5f5f5);
        font-weight: 500;
        font-family: var(--font-family);
        margin: 0;
        line-height: 2;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: var(--font-color-999);
        text-align: center;
      }
    }
  }

  &-tips {
    justify-content: flex-end;
    font-size: 12px;
    color: var(--font-color-999);
    margin: 10px 0 0;

    img {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
  }

  :deep(.el-form-item__content) {
    flex-direction: column;
  }
}

:deep(.config-form-wrap-group) {
  .el-form-item:first-child {
    margin-right: 40px;
  }
}
</style>
