<template>
  <div class="agent-header-wrap layout-flex-between">
    <div
      class="wallet-wrap"
      v-loading="agent.isUserInfoLoading"
    >
      <div class="layout-flex-center agent-wallet">
        <svg-icon
          name="agent-wallet"
          class="icon"
        />
        <div class="wallet-info">
          <Tooltip
            :content="$t('代理钱包')"
            :tip="$t('用来给下级转账使用的金额，无法提款。可以联系客服进行充值或者使用佣金钱包转账')"
          />
          <div
            class="currency"
            v-money="agent.userInfo?.money || 0"
          ></div>
        </div>
        <el-button
          type="primary"
          class="recharge-button"
          @click="deposit"
        >{{$t('充值')}}</el-button>
      </div>

      <div class="divider"></div>

      <div class="layout-flex-center commission-wallet">
        <svg-icon
          name="commission-wallet"
          class="icon"
        />
        <div class="wallet-info">
          <Tooltip
            :content="$t('佣金钱包')"
            :tip="$t('用来发放佣金的钱包，可以直接提款或者充值给代理钱包进行下级转账')"
          />
          <div
            class="currency"
            v-money="agent.userInfo?.commission_money * 1 || '0.00'"
          ></div>
        </div>
        <el-button
          class="withdraw-button"
          @click="isShowWithdrawDialog = true"
        >{{$t('提现')}}</el-button>
      </div>
    </div>

    <div
      class="data-viewer"
      v-loading="dataLoading"
    >
      <header>{{$t('数据概览')}}</header>
      <div class="data-item-list-wrap">
        <div
          class="data-item"
          v-for="(item, index) in data.relationList"
          :key="index"
        >
          <div class="icon-wrapper">
            <svg-icon
              :name="item.icon"
              class="icon"
            />
          </div>
          <template v-if="index < 2">
            <div class="currency">{{ item.value }}</div>
          </template>
          <template v-else>
            <div
              class="currency"
              v-money="item.value || '0.00'"
            ></div>
          </template>

          <div class="sub-text">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <WithdrawDialog v-model="isShowWithdrawDialog" />
  </div>
</template>

<script setup>
import {
  reactive, ref, inject, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { relationdata } from '@/api/agent';
import Tooltip from './Tooltip.vue';
import WithdrawDialog from './WithdrawDialog.vue';

const global = inject('global');

const isShowWithdrawDialog = ref(false);

const $store = inject('store');
const { agent } = $store.state;
if (typeof agent.userInfo?.commission_money === 'undefined') {
  $store.dispatch('agent/getUserInfo');
}

const data = reactive({
  relationList: [
    {
      icon: 'new-register',
      name: global.$t(`本月新注册(人)`),
      value: '',
    },
    {
      icon: 'active-user',
      name: global.$t(`本月活跃会员(人)`),
      value: '',
    },
    {
      icon: 'pure-profit',
      name: global.$t(`本月纯利`),
      value: '',
    },
    {
      icon: 'commission',
      name: global.$t(`本月下级抽佣`),
      value: '',
    },
    {
      icon: 'commission',
      name: global.$t(`本月佣金`),
      value: '',
    },
  ],
});

const { loading: dataLoading } = useRequest(
  () => relationdata({ date_type: 'month' }),
  {
    onSuccess: (result) => {
      data.relationList = [
        {
          icon: 'new-register',
          name: global.$t(`本月新注册(人)`),
          value: result.new_members,
        },
        {
          icon: 'active-user',
          name: global.$t(`本月活跃会员(人)`),
          value: result.active_members,
        },
        {
          icon: 'pure-profit',
          name: global.$t(`本月纯利`),
          value: result.profit * 1,
        },
        {
          icon: 'commission',
          name: global.$t(`本月下级抽佣`),
          value: result.children_commission * 1,
        },
        {
          icon: 'commission',
          name: global.$t(`本月佣金`),
          value: result.commission * 1,
        },
      ];
    },
  },
);

function deposit() {
  if (agent?.userInfo.spread_switch === 2) {
    global.$router.push('recharge');
  } else {
    global.$dialog({
      tpl: 'WarningDialog', tips: global.$t('充值请联系客服'),
    });
  }
}

</script>

<style lang="scss" scoped>
.agent-header-wrap {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 20px;
}
.wallet-wrap {
  width: 340px;
  border-radius: 6px;
  border: 1px solid var(--block-border-color);
  background-color: var(--block-bg-color);
  height: 100%;
  flex: 1;
  flex-grow: 1;
  align-items: stretch;

  .agent-wallet,
  .commission-wallet {
    display: flex;
    padding: 0 30px;
    height: calc(50% - 0.5px);

    .icon {
      width: 50px;
      height: 50px;
    }

    .wallet-info {
      margin-left: 10px;
      flex: 1;

      .currency {
        margin-top: 6px;
        width: 100px;
        white-space: pre-wrap;
        font-size: 24px;
        color: var(--font-color-000);
        text-align: left;
      }
    }

    .el-button {
      min-height: 40px;
      font-size: 14px;
      padding-left: 15px;
      padding-right: 15px;
    }
  }

  .divider {
    height: 1px;
    width: 280px;
    margin: 0 auto;
    background-color: var(--border-color-e2e2e2);
    opacity: 0.4;
  }

  .agent-wallet {
    .icon {
      fill: var(--svg-color-9367B5) !important;
    }
  }

  .commission-wallet {
    .icon {
      fill: var(--svg-color-976346) !important;
    }
  }

  .withdraw-button:hover {
    background-color: transparent;
    border-color: var(--theme-color);
    color: var(--theme-color);
  }
}

.data-viewer {
  width: 600px;
  border-radius: 6px;
  border: 1px solid var(--block-border-color);
  background-color: var(--block-bg-color);

  header {
    text-align: left;
    height: 16px;
    font-size: var(--font-size);
    color: var(--font-color-222930);
    padding: 20px 30px 10px 30px;
  }

  .data-item-list-wrap {
    min-height: 134px;
    padding-bottom: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;

    .data-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .icon-wrapper {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--bg-color-c0c0c0);
        margin-bottom: 5px;

        .icon {
          width: 50px;
          height: 50px;
        }
      }

      .currency {
        font-size: 24px;
        white-space: pre-wrap;
        color: var(--font-color-000) !important;
        line-height: 51px;
        height: 51px;
        box-sizing: border-box;
        font-family: moneyFont;
      }

      .sub-text {
        margin-top: 8px;
        font-size: 14px;
        color: var(--font-color-999);
      }
    }
  }
}
</style>
