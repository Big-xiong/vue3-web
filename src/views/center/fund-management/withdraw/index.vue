<template>
  <div class="widthdraw-wrap">
    <div v-if="showPage">
      <div class="center-right-wrap-title">
        <h2>
          <i class="el-icon-arrow-left" @click="showPage = false"></i>
          <span>{{ $t('收币地址') }}</span>
        </h2>
      </div>
      <DigAddress @choseAddress="choseAddress" />
    </div>
    <div v-show="!showPage">
      <div class="center-right-wrap-title">
        <h2>{{ $t('取款') }}</h2>
      </div>
      <div class="widthdraw-wrap-inner">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('银行卡')" name="first"></el-tab-pane>
          <el-tab-pane :label="$t('数字货币')" name="second" v-if="dicts?.siteinfo?.cost_manage?.dig_withdraw_status === 1">
            <template v-slot:label>
              {{ $t('数字货币') }}
              <svg-icon class="widthdraw-wrap-tag" name="digital" />
            </template>
          </el-tab-pane>
        </el-tabs>

        <Bank v-if="activeName === 'first'" ref="bankRef" :siteinfo="dicts?.siteinfo"
          :withDrawLimitInfo="withDrawLimitInfo" :activeId="userBankId" @checkWithdraw="state => isWithdraw = state"
          @feeList="updateFeeList" />
        <Digital v-else ref="digRef" :siteinfo="dicts?.siteinfo" :withDrawLimitInfo="withDrawLimitInfo"
          @feeList="updateFeeList" @checkWithdraw="state => isWithdraw = state" @chooseAddress="chooseAddress"
          @resetProtocolAddress="resetProtocolAddress" />

        <TotalMoney />
        <div class="widthdraw-wrap-fees">
          <p class="title">
            <svg-icon name="tips"></svg-icon>
            <span>{{ $t('扣除费用提醒') }}</span>
          </p>
          <p>
            {{ $t('1.取款手续费') }}：
            <span v-money="feeList[0].money"></span>
          </p>
          <p>
            {{ $t('2.流水未完成行政费') }}：
            <span v-money="feeList[1].money">¥0</span>
          </p>
          <p>
            {{ $t('3.优惠流水未完成扣除费') }}：
            <span v-money="feeList[2].money">¥0</span>
          </p>
          <p class="money">
            {{ $t('实际到账金额') }}
            <span v-money="feeList[3].money"></span>
          </p>
        </div>

        <el-button class="widthdraw-wrap-commit" type="primary" style="width: 300px;" :loading="commitLoading"
          :disabled="!isWithdraw" @click="showPassDia">{{ $t('确认提交') }}</el-button>
        <p class="widthdraw-wrap-commit-tips">{{ $t('取款流水验证有1-3分钟数据延迟，3-5分钟提款到账') }}</p>
      </div>
    </div>

    <ValidateIdentity v-if="showValidateDia" :showValidateDia="showValidateDia" @closeValidateDia="closeValidDia"
      @closeDia="showValidateDia = false" />

    <!-- 流水稽查 -->
    <widthdrawDia v-if="dialogWidthdrawVisible" v-model="dialogWidthdrawVisible"
      @closeWidthdrawDia="dialogWidthdrawVisible = false" :errorText="dataInfo.errorText" />

    <Dialog :title="$t('资金密码')" v-model="secretDia" width="500px" :confirmText="$t('确认')" :cancelText="$t('取消')"
      blockBtn center contentPadding="40px" @onConfirm="commitQk" @close="secretDia = false"
      @onClose="secretDia = false" :showBtn="false">
      <div class="secretDia-inner">
        <PasswordInput ref="pwdRef" @input="getVal" />
        <p class="widthdraw-wrap-forget">
          <span @click="fogetPassword">{{ $t('忘记资金密码？') }}</span>
        </p>
        <div class="layout-flex-center widthdraw-wrap-test" v-if="dataInfo.DetectionSave">
          <i class="el-icon-loading" />
          <span class="saveing">{{ $t('安全检测中...') }}</span>
        </div>
        <div class="layout-flex-center widthdraw-wrap-test" v-else>
          <svg-icon name="safe" class="safe" />
          <span>{{ $t('安全设置检测成功！无需短信校验') }}</span>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { useTimeout } from '@/utils/hooks';

import {
  rechargeflow, canwithdraw, withdrawlimitinfo, withdraw,
} from '@/api/center';
import { withdrawcheckemail } from '@/api/user';

import PasswordInput from '@/components/PasswordInput/index.vue';
import BindMobile from '@/components/BindMobile/index.vue';
import Dialog from '@/components/Dialog/index.vue';
import BindEmail from '@/components/BindEmail/index.vue';
import ValidateIdentity from '@/components/ValidateIdentity/index.vue';
import Bank from './components/Bank.vue';
import Digital from './components/Digital.vue';
import widthdrawDia from './components/widthdrawDia.vue';
import DigAddress from './components/DigAddress.vue';
import TotalMoney from './components/TotalMoney.vue';

const activeName = ref('first');
const $store = inject('store');
const global = inject('global');
const dialogWidthdrawVisible = ref(false);
const phoneBindTipVisible = ref(false);
const showPage = ref(false);
const allowSubmit = ref(false);
const userBankId = ref(null);
const showValidateDia = ref(false);
const showDigWithdraw = ref(true); // true允许数字货币取款
const feeList = ref([
  { money: '0.00', title: global.$t(`手续费`) },
  { money: '0.00', title: global.$t(`行政费`) },
  { money: '0.00', title: global.$t(`扣除优惠`) },
  { money: '0.00', title: global.$t(`最后可取`) },
]);
const dataInfo = reactive({
  ticker: 0,
  DetectionSave: true,
  tips: [
    global.$t(`手续费：取款时根据取款金额收取的手续费`),
    global.$t(`行政费：领取红利产生未达标的流水按照比例扣除的费用`),
    global.$t(`扣除优惠：领取红利之后未达标流水要求时申请取款需要扣除的红利金额`),
    global.$t(`最后可取：扣除手续费、行政费和优惠之后可以取款的总金额`),
  ],
  errorText: '',
  dialogPhoneBindTipVisible: false,
});
const tipsInfo = reactive({
  isError: true,
  icon: 'el-icon-warning',
  title: global.$t(`安全提示`),
  tips: global.$t(`尊敬的会员为了您的资金安全，建议您先绑定手机号`),
});

useTimeout(() => {
  dataInfo.DetectionSave = false;
}, 3000);

const { user, app } = $store.state;
const { dicts } = app;

$store.dispatch('app/getDict', 'siteinfo').then(() => {
  const { withdraw_setting, cost_manage } = dicts?.siteinfo ?? {};
  if (withdraw_setting) phoneDialog(withdraw_setting);
});

const max = 4;
const isForget = ref(false);

const dialogPhoneBindTipVisible = ref(false);
// 检查流水稽核
const { run: canwithdrawRun } = useRequest(canwithdraw, {
  manual: true,
  onError(error) {
    dataInfo.errorText = error;
    dialogWidthdrawVisible.value = true;
  },
});

// tab
function handleClick() {
  feeList.value[0].money = '0.00';
  feeList.value[1].money = '0.00';
  feeList.value[2].money = '0.00';
  feeList.value[3].money = '0.00';
}

// 用来区分是否从save方法过来的关闭事件
let isSave = false;
async function onCancel() {
  dialogPhoneBindTipVisible.value = false;
  const pass = await checkEmail();
  if (pass) {
    !isSave && checkLock(dicts?.siteinfo?.withdraw_setting);
  } else {
    global.$dialog({ tpl: 'TipsDialog', icon: 'error', tips: global.$t('您没有设置资金密码，为了保障资金安全请设置资金密码') });
  }
}

// 提示框保存
function save(e) {
  isSave = true;
  if (!isForget?.value) {
    dialogPhoneBindTipVisible.value = false;
    phoneBindTipVisible.value = true;
  } else {
    global.$router.push({ name: 'centerProfile' });
  }
}

async function bind() {
  const pass = await checkEmail();
  if (pass) {
    checkLock(dicts?.siteinfo?.withdraw_setting);
  }
}

function bindCancel() {
  checkEmail();
}

onMounted(() => {
  // dialogPhoneBindTipVisible.value = true;
});

const isShowBindEmail = ref(false);

function bindEmailSuccess() {
  isShowBindEmail.value = false;
  checkLock(dicts?.siteinfo?.withdraw_setting);
}

// 忘记密码
function fogetPassword() {
  if (
    user?.userInfo?.is_valid_mobile !== 2
    && user?.userInfo?.is_valid_email !== 2
    && user?.userInfo?.is_pass_answer !== 2
  ) {
    global.$dialog({
      tpl: 'TipsDialog', icon: 'error', tips: global.$t('您未绑定手机号、邮箱、密保问题请在个人资料页面绑定'), type: 1,
    });
    // tipsInfo.tips = global.$t(`您未绑定手机号、邮箱、密保问题请在个人资料页面绑定`);
    // isForget.value = true;
    // dialogPhoneBindTipVisible.value = true;
  } else {
    showValidateDia.value = true;
  }
}

const { data: withDrawLimitInfo } = useRequest(withdrawlimitinfo);
function updateFeeList(arr) {
  arr.forEach((item, index) => {
    feeList.value[index].money = item;
  });
}
const secretDia = ref(false);

const digRef = ref(null);
const bankRef = ref(null);
const { run: commitRun, loading: commitLoading } = useRequest(withdraw, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('提交成功'));
  },
});

function chooseAddress(show) {
  showPage.value = show;
}

function choseAddress(data) {
  showPage.value = false;
  nextTick(() => {
    const { id, address, protocol } = data;
    digRef.value.form.address = address;
    digRef.value.form.protocol = protocol;
    digRef.value.form.user_dig_wallet_id = id;
  });
}

function resetProtocolAddress() {
  nextTick(() => {
    digRef.value.form.address = '';
    digRef.value.form.user_dig_wallet_id = '';
  });
}

const isWithdraw = ref(false);

const pwdRef = ref(null);
function showPassDia() {
  if (user?.userInfo?.is_pay_password !== 2) {
    // 未设置资金密码
    global.$dialog({
      tpl: 'TipsDialog',
      icon: 'error',
      tips: global.$t('您没有设置资金密码，为了保障资金安全请设置资金密码'),
    });
    return;
  }
  secretDia.value = true;

  nextTick(() => {
    pwdRef.value.focus();
  });
}

// 获取密码
const pay_password = ref('');

function commitQk() {
  const [service_charge, administrative_charge, discounts, money] = feeList.value.map((item) => item.money);
  commitRun({
    Loading: true,
    ...bankRef?.value?.form,
    ...digRef?.value?.form,
    pay_password: pay_password.value,
    user_bank_id: userBankId.value ?? user?.userInfo?.user_bank[0]?.id,
    money,
    discounts,
    service_charge,
    administrative_charge,
  });
  secretDia.value = false;
  pay_password.value = '';
}

function getVal(data) {
  pay_password.value = data;
  // secretDia.value = false;
  if (data.length === 6) {
    commitQk();
  }
}

async function checkEmail() {
  const result = await withdrawcheckemail();
  if (result.need_bind && user.userInfo?.is_valid_email === 1) {
    isShowBindEmail.value = true;
  }

  return !result.need_bind;
}

async function phoneDialog(_setting) {
  if (_setting?.need_mobile) {
    // 配置了需要绑定，但是用户没有手机号
    if (Number(_setting?.need_mobile) === 1 && user?.userInfo.is_valid_mobile === 1) {
      dialogPhoneBindTipVisible.value = true;
    } else {
      const pass = await checkEmail();
      if (pass) {
        checkLock(_setting);
      }
    }
  }
}

function checkLock(_setting) {
  if (_setting?.deposit_flow) {
    // deposit_flow 存款流水要求 2(不许取款弹框) 1(允许发起取款)， bonus_flow 红利流水要求 2（不许取款弹框）1否(允许发起取款)
    // 不用判断这个了，你只要判断undone_flow大于0就弹窗提醒就行了(fire_hot)
    // if (Number(_setting?.deposit_flow) === 2 || Number(_setting?.bonus_flow) === 2)
    rechargeflow().then((res) => {
      // 已完成流水, 未完成流水 满足要求了undone_flow就是0
      const { done_flow, undone_flow } = res;
      if (undone_flow > 0) {
        const msg = {
          title: global.$t('温馨提醒'),
        };
        global.$dialog({
          tpl: 'TipsLock',
          msg,
          done_flow,
          undone_flow,
        });
      } else {
        otherDialog();
      }
    });
  }
}

function otherDialog() {
  $store.dispatch('user/getUserInfo').then(() => {
    if (user?.userInfo?.is_pay_password) {
      if (user?.userInfo?.is_pay_password !== 2) {
        // 未设置资金密码
        global.$dialog({ tpl: 'TipsDialog', icon: 'error', tips: global.$t('您没有设置资金密码，为了保障资金安全请设置资金密码') });
      } else {
        canwithdrawRun();
      }
    }
  });
}

function closeValidDia() {
  showValidateDia.value = false;
  // if (!secretDia.value)
  global.$dialog({ tpl: 'MoneyPasswordSet', title: global.$t('重置密码'), showOldPass: false });
}

</script>

<style lang="scss" scoped>
.widthdraw-wrap {
  font-size: 14px;
  color: var(--font-color-999);
  background-color: var(--bg-color-282828);

  .center-right-wrap-title {
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--center-title-border-color-e2e2e2);
    border-radius: 10px 10px 0 0;
    position: relative;

    &::after {
      content: '';
      height: 20px;
      position: absolute;
      left: 0;
    }

    h2 {
      margin: 0;
      text-indent: 30px;
      font-size: 20px;
      font-weight: 600;
      color: var(--font-color-000);
      border-left: 1px solid var(--theme-color);

      i {
        text-indent: 0;
        margin: 0 10px 0 -10px;
        cursor: pointer;
      }
    }
  }

  &-inner {
    padding: 30px;

    .el-tabs {
      margin-bottom: 30px;
    }
  }

  .el-tabs {
    margin-top: -30px;

    :deep(.el-tabs__header) {
      margin: 0;

      .el-tabs__nav-wrap::after {
        content: none;
      }

      .el-tabs__nav {
        height: 80px;
        line-height: 80px;
      }

      .el-tabs__item {
        // padding: 0 40px 0 0 !important;
        // padding-right: 0;
        // margin-right: 40px;
        font-size: 20px;
        color: var(--font-color-0a0a0a);

        &.is-active {
          color: var(--font-color-333);
        }
      }
    }
  }

  &-title {
    font-size: 16px;
    color: var(--font-color-000);
    font-weight: 500;
    line-height: 30px;
    margin: 20px 0 10px;
  }

  &-tips {
    font-size: 16px;
    line-height: 30px;
    color: var(--font-color-000);

    i {
      color: var(--theme-color);
      font-size: 18px;
      margin-right: 10px;
    }

    &-p p {
      margin: 0;
    }
  }

  &-forget {
    font-size: 14px;
    color: var(--font-color-999);
    margin: 20px 0;

    span {
      cursor: pointer;
    }
  }

  &-tag {
    position: absolute;
    width: 22px;
    height: 22px;
    margin-left: 5px;
  }

  &-fee {
    width: 550px;
    margin: 0 0 20px;

    >div {
      position: relative;

      &:last-child {
        &:after {
          content: '';
          position: absolute;
          width: 24px;
          height: 16px;
          top: 0;
          left: 100%;
          margin-left: -10px;
          background: url('@/assets/images/center/widthdraw/get.png') no-repeat;
          background-size: 100% auto;
        }

        h2 {
          color: var(--theme-color);
        }
      }
    }

    h2 {
      color: var(--font-color-666);
      font-size: 20px;
      font-weight: 500;
      display: block;
      margin: 0;
    }

    p {
      margin: 0;
    }
  }

  :deep(.ank-card-list-wrap-item) {
    background: none !important;
  }

  :deep(.widthdrawDia-wrap) {
    .el-table::before {
      content: none;
    }

    .el-dialog__footer {
      padding-left: 35px;
      padding-right: 35px;
    }

    .el-dialog-title {
      border-bottom: 0;
    }
  }

  :deep(.bindMobile-wrap) {
    .dialog-footer-inline-btn {
      flex-direction: row-reverse;
    }
  }

  &-test {
    margin: 20px 0 0;
    justify-content: flex-start;

    .svg-icon {
      color: var(--font-color-00d477);
      fill: var(--font-color-00d477);
      margin-right: 5px;
      width: 16px;
      height: 24px;
    }
  }

  .widthdraw-wrap-fees {
    font-size: 14px;
    color: var(--font-color-fff-6, var(--font-color-000));
    line-height: 20px;
    margin-bottom: 30px;

    .money {
      font-size: var(--font-color-fff-8, var(--font-color-999));
      margin-top: 26px;
      opacity: 1;

      span {
        color: var(--theme-color);
      }
    }

    .title {
      display: flex;
      align-items: center;
      opacity: 1;
      margin-top: 15px;

      .svg-icon {
        margin-right: 4px;
        width: 12px;
        height: 12px;
      }
    }

    p {
      margin: 0;
      padding: 0;
      height: 26px;
      opacity: 0.4;
    }
  }

  .widthdraw-wrap-commit-tips {
    font-size: 12px;
    color: var(--font-color-fff-4, var(--font-color-999));
    margin-top: 10px;
  }
}

.secretDia-inner {
  :deep(.cells) {
    justify-content: space-between;
  }
}

.widthdraw-wrap-test {

  span {
    color: var(--font-color-000);
  }
}
</style>
