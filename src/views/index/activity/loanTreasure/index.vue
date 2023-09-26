<template>
  <div id="loanTreasure">
    <div class="top">
      <img src="/src/views/index/activity/loanTreasure/assets/jiedaibao_banner.jpg" alt />
    </div>

    <!-- 借贷规则 -->
    <div class="lendingRules">
      <img src="/src/views/index/activity/loanTreasure/assets/jiedaibao_bg.jpg" alt />
      <div class="rules">
        <div />
        <table>
          <tr class="rules-title">
            <th>{{ $t(`会员等级`) }}</th>
            <th>{{ $t(`借贷区间（元）`) }}</th>
            <th>{{ $t(`分期天数`) }}</th>
            <th>{{ $t(`存款比例`) }}</th>
            <th>{{ $t(`流水倍数`) }}</th>
          </tr>
          <tr class="rules-content" v-for="(item, index) in condition_setting" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.condition.borrow_money.min }}-{{ item.condition.borrow_money.max }}</td>
            <td>{{ item.condition.stages_days.min }}-{{ item.condition.stages_days.max }}</td>
            <td>{{ item.condition.deposite_scale.min }}:{{ item.condition.deposite_scale.max }}</td>
            <td>{{ item.condition.flow }}</td>
          </tr>
        </table>

        <p :style="{
          'background-color': condition_setting.length % 2 === 1 ? 'rgba(225,228,255,1)' : '#D3D8FF'
        }">
          {{ $t(`备注：流水倍数=存款金额+借贷金额`) }}
        </p>
      </div>
      <div class="pic">
        <img src="/src/views/index/activity/loanTreasure/assets/jiedaibao_rule_bg.png" alt />
        <p>{{ $t(`借贷规则`) }}</p>
      </div>
    </div>

    <!-- 活动申请 -->
    <div class="activity">
      <div class="activity-center">
        <div class="activity-top">
          {{ $t(`活动申请`) }}
        </div>
        <div class="activity-pic">
          <div class="item-pic">
            <div :class="step >= 1 ? 'active' : ''" />
            <p>{{ $t(`借贷金额`) }}</p>
          </div>
          <img src="/src/views/index/activity/loanTreasure/assets/jeidaibao_arrow.png" alt="" class="arrow" />
          <div class="item-pic">
            <div :class="step >= 2 ? 'active' : ''" />
            <p>{{ $t(`存款金额`) }}</p>
          </div>
          <img src="/src/views/index/activity/loanTreasure/assets/jeidaibao_arrow.png" alt="" class="arrow" />
          <div class="item-pic">
            <div :class="step >= 3 ? 'active' : ''" />
            <p>{{ $t(`分期天数`) }}</p>
          </div>
          <img src="/src/views/index/activity/loanTreasure/assets/jeidaibao_arrow.png" alt=" " class="arrow" />
          <div class="item-pic">
            <div :class="step >= 4 ? 'active' : ''" />
            <p>{{ $t(`活动申请`) }}</p>
          </div>
        </div>

        <div class="lendingAmount">
          <div v-if="step === 1" class="form-item">
            <label class="form-item-label">{{ $t(`借贷金额`) }}</label>
            <div class="form-item-content">
              <input v-model="num1" :disabled="isDisabled" :placeholder="ph1" @change="changeMoney" />
            </div>
          </div>
          <div v-if="step === 2" class="form-item">
            <label class="form-item-label">{{ $t('存款金额') }}</label>
            <div class="form-item-content">
              <input v-model="num2" type="number disabled" disabled :placeholder="$t('请填写存款金额')"
                style="background-color: #ddd" />
            </div>
          </div>
          <div v-if="step === 3" class="form-item">
            <label class="form-item-label">{{ $t('分期天数') }}</label>
            <div class="form-item-content">
              <input v-model="num3" :placeholder="ph2" @change="changeDay" />
            </div>
          </div>
          <div v-if="step === 4" class="form-item">
            <p>{{ $t('借贷金额') }}：{{ num1 }}{{ $t('元') }}</p>
            <p>{{ $t('存款金额') }}：{{ num2 }}{{ $t('元') }}</p>
            <p>
              {{ $t('分期天数') }}：{{ num3 }}{{ $t('天') }}<span>{{ $t('每日还款') }}{{ num }}{{ $t('元') }}</span>
            </p>
          </div>
          <div v-if="step === 5" class="form-item">
            <p>{{ $t('距离申请结束时间') }}</p>
            <p>{{ timeRemaining }}</p>
            <p>{{ $t('您已经申请活动，请尽快完成活动要求') }}</p>
          </div>
          <div v-if="step === 6" class="form-item">
            <p>{{ $t('借贷金额') }}：{{ active.money }}{{ $t('元') }}</p>
            <p>{{ $t('分期天数') }}：{{ active.day }}{{ $t('天') }}</p>
            <p>{{ $t('已还款金额') }}：{{ history[0].borrow_money }}</p>
          </div>
          <router-link v-if="!isLogin" :to="{ name: 'register' }" class="calculatorBtn">
            {{ $t(`立即注册`) }}
          </router-link>
          <div v-if="isLogin && btnShow" class="calculatorBtn" @click="next">
            {{ btnText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 活动细则 -->
    <div class="rulesActivities">
      <div class="rulesActivitiesContent">
        <div>{{ $t(`活动细则`) }}</div>
        <p>1. {{ $t('本活动无法与返水等其他活动共享') }}</p>
        <p>2. {{ $t(`{0}所有二星及以上会员均可享受，自开始申请，7天为一周期，每周可参与一次。`, [$t(subConfig.title)]) }}</p>
        <p>3. {{ $t(`会员如果申请500元借贷，根据会员等级如果是二星会员需要存款500元，到账一共1000元。如果是钻石会员只需要存款400元，一共到账900元。`) }}</p>
        <p>4. {{ $t(`分期天数指的如果会员选择1天内还款，系统会在申请活动的24小时后收回贷款金额。如果会员选择3天内还款，那么系统会在申请活动的每24小时收回贷款金额的1/3，分三次全额收回。`) }}</p>
        <p>5. {{ $t(`会员参与活动期间无法发起提现，直到系统自动收回贷款金额或者玩家成功申请破产。`) }}</p>
        <p>6. {{ $t(`贷款期间不影响存款，但是系统还是会按照贷款金额和还款天数来计算每日还款金额并自动扣减。`) }}</p>
        <p>{{ $t(`如果客户账户余额不足参与本金的{0}%可以去活动页面申请破产保护，即可免除一切还款。如果会员完成活动时为盈利状态，公司将抽取盈利部分的{1}%作为借贷佣金。`, [((detailData && detailData.rule_setting.money_noenough * 1) || 0), ((detailData && detailData.rule_setting.profite_rate * 1) || 0)]) }}</p>
        <p>8. {{ $t(`本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，一经发现我们将保留冻结帐户以及没收所有余额的权利。`) }}</p>
        <p>9. {{ $t(`{0}拥有最终解析权。`, [$t(subConfig.title)]) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, ref, computed, watch, onBeforeUnmount,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

import { paytype } from '@/api/center';
import {
  joinborrow, borrowjoinrecord, specialdetail, brokeapply,
} from '@/api/activity';

const $route = useRoute();
const $router = useRouter();
const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');
const { app, user } = $store.state;

const activityId = ref('');
const types = ref([]);
const history = ref([]);
const merchant_no = import.meta.env.VITE_APP_MERCHANT_NO;
const isLogin = computed(() => user?.isLogin);
const memberLevel = ref([]);

const detailData = ref([]);
const condition_setting = ref([]);
const condition = ref({});
const ph1 = ref($t('您尚未达到本活动的参与要求，暂时无法进行活动申请')); // 第一个占位input
const ph2 = ref($t('您尚未达到本活动的参与要求，暂时无法进行活动申请')); // 第二个占位input
const isDisabled = ref(true); // 会员等级与活动设置等级不一致无法输入金额
const btnShow = ref(true); // 是否隐藏按钮
const btnText = ref($t('下一步')); // 是否隐藏按钮
const step = ref(1); // 存款步骤 5: 进行中, 6: 申请成功
const num = ref('');
const num1 = ref('');
const num2 = ref('');
const num3 = ref('');
const timeRemaining = ref(''); // 剩余时间
const tickTimerHandle = ref('');
const status = ref(0); // 用户活动状态  0: 未申请, 1: 进行中, 2: 申请成功, 3: 申请失败, 4: 成功还贷, 5: 已破产
const active = ref({});

// 获取payTypes borrowjoinrecord
const initialData = () => {
  paytype().then((res) => {
    types.value = res;
  });
  borrowjoinrecord().then((res) => {
    history.value = res.data;
  });
};

const tickTime = (endDay, newDay) => {
  const hours = endDay.diff(newDay, 'hour') % 24;
  const minutes = endDay.diff(newDay, 'minute') % 60;
  const seconds = endDay.diff(newDay, 'second') % 60;
  timeRemaining.value = `${hours < 10 ? `0${hours}` : hours}小时${minutes < 10 ? `0${minutes}` : minutes}分${seconds < 10 ? `0${seconds}` : seconds
    }秒`;
};

// 获取优惠详情
const getDetail = () => {
  specialdetail({
    merchant_no,
    id: activityId.value,
  }).then((res) => {
    window.sessionStorage.setItem('loanTreasure', JSON.stringify(res));
    detailData.value = res;
    condition_setting.value = res.condition_setting.map((val) => {
      if (val.level === user?.userInfo.level) {
        isDisabled.value = false;
        condition.value = val.condition;
        const { borrow_money, stages_days } = val.condition;
        ph1.value = `您的等级可以申请${borrow_money.min}~${borrow_money.max}元`;
        ph2.value = `您的会员等级可以分期${stages_days.min}-${stages_days.max}天`;
      }
      return {
        ...val,
        name: memberLevel.value[val.level] ? global.$t(memberLevel.value[val.level].name) : '',
      };
    });
    condition_setting.value.sort((a, b) => a.level - b.level);
    // 记录用户是否已申请活动
    history.value.forEach((ele) => {
      let newDay = dayjs(new Date());
      const endDay = dayjs(ele.act_end_time);
      // 活动进行中
      if (newDay - endDay < 0) {
        if (ele.status === 1) {
          // 已参与活动
          btnShow.value = false;
          status.value = 1;
          step.value = 5;
          tickTimerHandle.value = setInterval(() => {
            newDay = dayjs(new Date());
            tickTime(endDay, newDay);
          }, 1000);
        }
        if (ele.status === 2) {
          // 已破产
          active.value = ele;
          status.value = 2;
          step.value = 6;
          btnText.value = $t('申请破产');
        }
      }
    });
  });
};

// 输入贷款金额
const changeMoney = () => { };

// 输入贷款天数
const changeDay = () => {
  const { min, max } = condition.value.stages_days;
  this.num3 < min && (this.num3 = min);
  this.num3 > max && (this.num3 = max);
};

// 跳转存款
const goDeposit = () => {
  $router.push({
    name: 'centerDeposit',
    query: { name: types.value[0].name === $t('客服支付') ? types.value[1].name : types.value[0].name },
  });
};

// 活动申请
const goActive = () => {
  joinborrow({
    merchant_no,
    id: activityId.value,
    money: num1.value,
    day: num3.value,
  }).then(() => {
    global
      .$alert($t('活动申请成功'), {
        confirmButtonText: $t('确定'),
        center: true,
      })
      .then(() => {
        goDeposit();
      });
  });
};

// 申请破产
const goBroke = () => {
  brokeapply({
    id: activityId.value,
  }).then(() => {
    global.$alert($t('破产申请成功'), {
      confirmButtonText: $t('确定'),
      center: true,
    });
  });
};

// 下一步
const next = () => {
  // 判断用户是否有权限参加活动
  if (!condition.value) {
    global.$alert($t('尊敬的用户，当前由于您尚未达到本活动的参与要求，暂时无法进行活动申请，多游戏才能参与更多的活动哦~'), {
      confirmButtonText: $t('确定'),
      center: true,
    });
    return;
  }
  const { min, max } = condition.value.deposite_scale;
  switch (step.value) {
  case 1:
    if (!num1.value) {
      return global.$alert($t('尊敬的用户，请先输入贷款金额'), {
        confirmButtonText: $t('确定'),
        center: true
      });
    }
    if (num1.value < condition.value.borrow_money.min * 1 || num1.value > condition.value.borrow_money.max * 1) {
      return global.$alert(`输入的金额需在${condition.value.borrow_money.min}-${condition.value.borrow_money.max}之间`, {
        confirmButtonText: $t('确定'),
        center: true
      });
    }
    // 计算存款金额
    num2.value = (num1.value * max).toFixed(2);
    step.value += 1;
    break;

  case 2:
    step.value += 1;
    break;

  case 3:
    if (!num3.value) {
      return global.$alert($t('尊敬的用户，请先输入还款天数'), {
        confirmButtonText: $t('确定'),
        center: true
      });
    }
    num1.value = parseInt(num1.value, 10).toFixed(2);
    num.value = (num1.value / num3.value).toFixed(2);
    step.value += 1;
    btnText.value = $t('申请活动');
    break;

  case 4:
    goActive();
    break;

  case 5:
    goDeposit();
    break;

  case 6:
    goBroke();
    break;
  default:
    break;
  }
};

onMounted(() => {
  activityId.value = $route.query.id || '';
  $store.dispatch('user/getUserInfo');
  $store.dispatch('app/getDict', ['memberlevellist']);

  if (isLogin.value) {
    initialData();
  }
});
watch(
  () => app?.dicts?.memberlevellist,
  (newval) => {
    if (newval.length > 0) {
      memberLevel.value = newval;
      getDetail();
    }
  },
);
onBeforeUnmount(() => {
  window.clearInterval(tickTimerHandle.value);
});
</script>

<style src="./style.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

input {
  outline: none;
  border: none;
  background: none;
  font-size: 16px;
}
</style>
