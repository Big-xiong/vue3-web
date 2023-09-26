<template>
  <div class="everyday-wrap" v-loading="listLoading">
    <Dialog cenrer :showConfirmBtn="false" :showCancelBtn="false" v-model="show" width="560px" @close="handleClose"
      v-if="everylist && everylist.length">
      <div class="gift">
        <img :src="$getSrc('/src/assets/images/everyday/everyday-gift@2x.png')" />
      </div>
      <div class="layout-flex-center item" v-for="(item, index) in everylist" :key="index">
        <div class="info">
          <p class="name">{{ $t(item.name) }}</p>
          <p v-if="item.name === '每日签到'">{{ $t('每日存款') }}{{ item.recharge_amount }}{{ $t('元') }}{{ item.required_flow
          }}{{ $t('倍流水奖励') }}{{ item.reward_amount.min }}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
          <p v-if="item.name === '任意投注'">{{ $t('每日参与任意投注') }}{{ item.daily_bet_amount }}{{ $t('次，奖励') }}{{
              item.reward_amount.min
          }}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
          <p v-if="item.name === '累计投注金额' || item.name === '累计充值'">{{ item.name }}{{ $t('到达') }}{{
              item.cumulative_bet_amount || item.daily_cumulative_recharge
          }}{{ $t('元') }}{{ $t('奖励') }}{{
    item.reward_amount.min
}}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
          <p v-if="item.name === '完成全部任务'">{{ $t('完成每日任务，奖励') }}{{ item.reward_amount.min }}-{{ item.reward_amount.max
          }}{{ $t('元') }}</p>
        </div>
        <el-button type="primary" :disabled="item.status === 2" :class="{ 'un-finished': item.status === 0 }"
          class="btn" @click="dutyAction(item, index)">{{ item.status === 1 ? '领取' : (item.msg || '已领取') }}</el-button>
      </div>
      <div v-if="showResult" class="result">
        <img :src="$getSrc('/src/assets/images/everyday/hongbao@2x.png')" />
        <div class="text">
          <h2>
            {{ money }}
            <small>{{ $t('元') }}</small>
          </h2>
          <p>
            {{ text }}
            <br />
            {{ $t('已存入你的钱包') }}
          </p>
        </div>
        <i class="el-icon-circle-close" @click="showResult = false" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { dailytasks, getreward } from '@/api/home';
import Dialog from '@/components/Dialog/index.vue';

const global = inject('global');
const showResult = ref(false);
const money = ref('');
const text = ref('');
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:show']);
const { run: listRun, data: everylist, loading: listLoading } = useRequest(dailytasks, {
  manual: false,
});

const { run: drawRun } = useRequest(getreward, {
  manual: true,
  onSuccess(res, params) {
    console.log(params);
    text.value = `恭喜您获得“${everylist.value[params[0].step - 1].name}”红包`;
    money.value = res.money;
    showResult.value = true;
    listRun();
  },
});
function dutyAction(item, index) {
  const { msg, status } = item;
  if (status === 0) {
    if (msg.indexOf(global.$t('充值')) !== -1) {
      global.$router.push({ name: 'centerDeposit' });
    } else if (msg.indexOf(global.$t('游戏')) !== -1) {
      global.$router.push('/');
    }
    emit('update:show', false);
  } else if (status === 1) {
    drawRun({ step: index + 1 });
  }
}

function handleClose() {
  emit('update:show', false);
}

</script>

<style lang="scss" scoped>
.everyday-wrap {
  :deep(.el-dialog) {
    background: linear-gradient(180deg, #264db9 0%, #162d97 100%);
    border-radius: 10px;

    .el-dialog__close {
      &::before {
        color: var(--font-color-fff);
        font-size: 32px;
        font-weight: 300;
      }
    }
  }

  .gift {
    width: 414px;
    height: 130px;
    text-align: center;
    margin: 30px auto 20px;
    position: relative;

    img {
      width: 100%;
      height: 232px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .item {
    background-color: var(--bg-color-fff);
    margin-bottom: 10px;
    border-radius: 2px;
    padding: 13px 20px;

    .info {
      flex: 1;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: var(--font-color-999);

      &.name {
        font-size: 18px;
        color: var(--bg-color);
        margin-bottom: 4px;
      }
    }

    .el-button {
      background-color: var(--bg-color-e12937);
      color: var(--font-color-fff);
      border-radius: 3px;
      border: 0;
    }
  }

  .result {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 375px;
    text-align: center;

    img {
      display: block;
      width: 100%;
    }

    .el-icon-circle-close {
      color: var(--theme-color);
      font-size: 30px;
      margin-top: 15px;
    }

    .text {
      position: absolute;
      top: 270px;
      left: 50%;
      width: 240px;
      margin-left: -120px;
      text-align: center;
      color: var(--theme-color);
      line-height: 24px;
      font-size: 18px;

      h2 {
        font-size: 36px;
        font-weight: 600;
        color: var(--font-color-eecc8e);
        margin-bottom: 10px;

        small {
          font-size: 18px;
          font-weight: normal;
          color: var(--theme-color);
        }
      }
    }
  }
}
</style>
