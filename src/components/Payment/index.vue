<template>
  <div v-loading="loading" class="deposit">
    <!-- <div
        v-if="hideKefu"
        class="addon"
        @click="$openKefu"
      >
        <p>{{ $t('非人民币存款请联系在线客服') }}</p>
        <svg-icon
          class="pointer"
          name="service"
        />
    </div>-->
    <div class="deposit-body" v-if="!loading">
      <div class="payments">
        <!-- <PaymentItem
                      v-for="(item, index) in payments"
                      :key="index"
                      :data="item"
                      :class="{ active: payment && payment.id === item.id }"
                      @change="onPaymentSelected(item,index)"
        />-->
        <PaymentType v-if="payTypeData.length" :data="payTypeData" @change="onPaymentSelected" />
        <!-- <div
                v-if="
                  !hideOperation && (
                    $projectName !== 'chashao' &&
                    $projectName !== 'chobet' &&
                    !aoMenUi.includes($projectName) &&
                    $projectName !== '10046')
                "
                class="tips"
                @click="showDepositTips"
              >
        <svg-icon name="info" />-->
        <!-- {{ $t('存款操作说明') }} -->
        <!-- </div> -->
      </div>
      <div v-if="[11, 15, 16].includes(payType) && payment" class="form-tips-top">
        <h2>{{ $t('协议') }}</h2>
        <span v-for="(item, index) in protocolList" :key="index" :class="{ 'active': chosePtotocol === item.protocol }"
          @click="handleProtocol(item.protocol)" v-show="displayProtocol.includes(item.type)">{{ item.title }}</span>
      </div>
      <div class="deposit-form">
        <!--  -->
        <!-- 支付宝转网银-6 网银转账-2 -->
        <!-- <div
                      v-if="payment && [2, 6].indexOf(payment.id) !== -1"
                      class="card"
        >-->
        <!-- 修改了逻辑 -->
        <!-- 收款银行卡和支付方式绑定，
                    所以每次切换支付方式时都需要调用接口更新收款银行卡信息。
        如果返回为空则当前支付方式不需要收款银行卡-->
        <div v-if="bankAccount" class="card">
          <h2>{{ $t('公司收款账户') }}</h2>
          <BankAccount :data="bankAccount" :payment="payment" />
          <p>{{ $t('温馨提示：每次存款前请先查询公司最新的收款账户，收款账户我们将会随时变更，如果您存款到我们已经取消的收款账户，那么我们将无法为您添加存款额度。') }}</p>
        </div>
        <!-- <div v-if="qrCodeUrl" class="card">
          <h2>{{  $t('收款二维码')  }}</h2>
          <img :src="qrCodeUrl" alt style="width: 200px;" />
          <p>
            {{  $t('温馨提示')  }}：
            <br />
            1.{{  $t('扫码后请及时付款，付款成功后后请点击完成付款金额将确保及时为您充值成功')  }}；
            <br />
            2.{{  $t('充值成功后不要再次使用本次二维码充值，充值后我们无法为您增加相应额度')  }}
            <br />
            3.{{  $t('如充值后5分钟未到账额度请联系在线客服！')  }}
            <br />
          </p>
        </div> -->
        <div class="information">
          <h2>{{ $t('存款金额') }}</h2>
          <ul class="form-ul">
            <li v-if="thirdPayMsg.money">
              <div class="yt-label">
                <p>{{ $t('油条充值金额') }}：{{ thirdPayMsg.product_name }}</p>
              </div>
            </li>
            <li>
              <el-input v-model="money" size="big" class="amount" :disabled="
                !paymentInfo.is_suit_money ||
                thirdPayMsg.busi_pay_type === '1'
              " :placeholder="
  $t('最低存款金额{0}，最高存款金额{1}', [
    _priceFormat(paymentInfo.min_money),
    _priceFormat(paymentInfo.max_money)
  ])
" @blur="handleMoney">
                <template #prefix>
                  <span>{{ $store?.state?.user?.currencySymbol || $store?.state?.agent?.currencySymbol }}</span>
                </template>
              </el-input>

              <span v-if="[11, 15, 16].includes(payType) && ticker && payment.channel" class="tips-ticker">
                <svg-icon name="info" />
                {{ $t('参考汇率') }}：1{{ payment.channel }}={{ ticker }}CNY
              </span>
            </li>
            <li class="usdt-offline" v-if="payType === 26">
              <span>{{ $t('参考汇率') }}：1USDT={{ paymentInfo.ticket_rate }}CNY</span>
              <span>{{ $t('充值') }}<em>{{ money ? (money / paymentInfo.ticket_rate).toFixed(2) : '0.00'
              }}</em>USDT</span>
            </li>
            <!-- 快捷金额 -->
            <li v-if="moneys.length">
              <label>{{ $t('快捷金额：') }}</label>
              <div class="chips">
                <Chip v-for="(item, index) in moneys" :key="index" :index="index" :amount="item" :length="moneys.length"
                  :tips="moneyTips[index]" :class="{ selected: money === item }" @select="selectAmount" />
              </div>
            </li>

            <DigitalOffline v-model:hash="hash" :qrCodeUrl="paymentInfo.pay_qrcode_url"
              v-if="payType === 26 && paymentInfo.pay_qrcode_url" :methodInfo="paymentInfo" />

            <li v-if="[2, 6, 12, 13, 14].includes(payment?.id)">
              <!-- <li> -->
              <template v-if="[12, 13, 14].includes(payment?.id)">
                <el-input v-if="qrCodeUrl && payment.id === 12" v-model="alipayName"
                  :placeholder="$t('请输入您的微信昵称，转账时请备注会员账号')" />
                <el-input v-else-if="qrCodeUrl && payment.id === 13" v-model="alipayName"
                  :placeholder="$t('请输入您的支付宝昵称，转账时请备注会员账号')" />
                <el-input v-else-if="!qrCodeUrl && payment.id === 14" v-model="alipayName"
                  :placeholder="$t('请输入支付宝真实姓名')" />
              </template>
              <el-input v-else v-model="realName" :placeholder="
                payment.id === 6
                  ? $t('请输入支付宝账户名')
                  : $t('请输入转账银行真实姓名')
              " />
            </li>

            <!-- 需求1072 支付类型为网银在线且渠道类型为网银 根据后台配置要求输入真实姓名 -->
            <template v-if="payment && payment.is_realname === 1">
              <li>
                <el-input v-model="realname" :placeholder="$t('请输入真实姓名')" />
              </li>
            </template>

            <!-- 选择银行 -->
            <li v-if="paymentInfo.is_need_bank_code && banks.length && !qrCodeUrl">
              <el-select v-model="bankId" :placeholder="$t('选择银行')">
                <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"
                  :disabled="item.disabled">
                  <BankItem :bank="item" :class="{ selected: bankId === item.id }" />
                </el-option>
              </el-select>
            </li>

            <!-- 优惠申请 -->
            <li v-if="activities.length && money">
              <el-select v-model="activityId" :placeholder="$t('优惠申请')" @change="onActivityChange">
                <el-option v-for="item in activities" :key="item.value" :label="item.name" :value="item.id"
                  :disabled="item.disabled">
                  {{ item.name }}
                  <span v-show="allGameCate && allGameCate[item.game_type]">
                    {{
                        `/ ${(allGameCate && allGameCate[item.game_type]) || ''}`
                    }}
                  </span>
                </el-option>
              </el-select>
            </li>
            <li v-if="money && showTips">
              <div class="form-tips">
                <i class="el-icon-s-opportunity" />
                <!-- {{ $t('流水要求：流水倍数{0}，有效投注额{1}', [_priceFormat($route.params.table.flow), _priceFormat((Number($route.params.table.recharge_money) + Number($route.params.table.gift_money)) * $route.params.table.flow)]) }} -->
                <!-- {{ activity && activity.id ? $t('流水要求：流水倍数{0}，有效投注额{1}', [_priceFormat(activity.flow), _priceFormat(activity.flow * money * (1 + 0.3))]) : $t('未选择活动') }} -->
                <!-- <span v-if="$route.params.table">{{$t('流水要求：流水倍数')}}{{$route.params.table.flow}}，{{$t('有效投注额')}}{{_priceFormat((Number($route.params.table.recharge_money)+Number($route.params.table.gift_money))*$route.params.table.flow)}}</span>
                <span v-else>{{activity&&activity.id?$t('流水要求：流水倍数')+activity.flow+'，'+$t('有效投注额')+(activity.type===14?_priceFormat(activity.flow*money*JSON.parse(activity.benefit_setting)?.proportion/100??0):_priceFormat(activity.flow*money*(1+JSON.parse(activity.benefit_setting)?.proportion/100??0))):$t('未选择活动')}}</span>-->
                <span>
                  <template v-if="activity && activity.id">{{ $t('流水要求：流水倍数') + this.flowRate + ',' + $t('有效投注额') +
                      this.flowMoney
                  }}</template>
                  <template v-else>{{ $t('未选择活动') }}</template>
                </span>
              </div>
            </li>
            <li>
              <p v-if="[11, 15, 16].includes(payType) && money" class="ticker">
                {{ $t(`预计支付`) }}
                <i>{{ (money / ticker).toFixed(2) }}</i>
                {{ payment.channel }}{{ $t(`（实际到账金额以支付汇率计算）`) }}
              </p>
              <el-button class="submit" type="primary" :disabled="isNextDisabled" :loading="submiting"
                @click="onSubmit">{{ $t('确认提交') }}
              </el-button>
            </li>
            <li v-if="[11, 15, 16].includes(payType) && payment && payment.pc_banner" class="dc-wrap">
              <img :src="payment.pc_banner" alt @click="go" style="width: 100%;" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 支付弹框 -->
    <PaymentDialog ref="paymentDialog" class="payDialog" v-model="dialogVisible" :payment="payment" :order="order"
      :init-status="
        payType === 2 ||
          payType === 6 ||
          payType === 11 ||
          payType === 15 ||
          payType === 16 ||
          payType === 12 ||
          payType === 13 ||
          payType === 14
          ? 2
          : 0
      " @cancel="onCancel" />
    <DepositTeach ref="depositTeach" :payments="payments" />
    <form v-if="!!order" id="actform" style="display: none;" name="actform" :method="order.form.type"
      :action="order.form.url" target="_blank">
      <input v-for="(val, key) in order.form.form" :key="key" :name="key" type="hidden" :value="val" />
      <button id="actformBtn" type="submit">{{ $t('提交') }}</button>
    </form>
    <!-- 避免浏览器拦截 -->
    <a id="link" href="test" target="_blank" style="display: none;" />
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import {
  // bankcardlist,
  preferentialactivity,
  paytype,
  // paysubtype,
  order,
  merchantbank,
  // allorderstatus,
  // checkorder,
  allbanklist,
  banklist,
  // quickmoneylist,
  // depositinfo
  paymethodinfo,
  getprotocol,
  getticker,
  activityalltype,
  activity_require,
} from '@/api/center';
import { getAllGameCates, getroulettedeposite } from '@/api/game';
import PaymentType from './components/PaymentType.vue';
import BankAccount from './components/BankAccount.vue';
import Chip from './components/Chip.vue';
import BankItem from './components/BankItem.vue';
import PaymentDialog from './components/PaymentDialog.vue';
import DepositTeach from './components/DepositTeach.vue';
import DigitalOffline from './components/DigitalOffline.vue';
import { priceFormat } from '@/utils/index';

// let user = null;

export default defineComponent({
  name: 'Deposit',
  setup() {
    const $store = inject('store');
    const { user } = $store.state;
    return $store;
  },
  components: {
    PaymentType,
    BankAccount,
    Chip,
    BankItem,
    PaymentDialog,
    DepositTeach,
    DigitalOffline,
  },
  props: {
    hideKefu: {
      type: Boolean,
      defualt: false,
    },
    isAgent: {
      type: Boolean,
      defualt: false,
    },
    hideOperation: {
      type: Boolean,
      defualt: false,
    },
  },
  data() {
    return {
      loading: true,
      hash: '',
      payTypeData: [],
      // 所有的支付方式
      payments: [],
      // 当前选中的支付方式
      payment: null,
      // 当前选中的支付方式Id
      payType: 1,
      // 游戏类型
      allGameCate: {},
      // 快捷金额列表
      moneys: [],
      // 快捷金额文字展示列表
      moneyTips: [],
      // 存款金额
      money: '',
      // 银行列表
      banks: [],
      // 当前选中银行
      bank: null,
      // 当前选中银行的id
      bankId: '',
      // 优惠列表
      activities: [],
      // 当前选中优惠
      activity: null,
      // 当前选中优惠的id
      activityId: '',
      // 当前选中的索引
      activeindex: 0,
      // 真实姓名（支付宝用
      realName: '',
      alipayName: '',
      realname: '', // 需求1071 1072根据后台配置展示真实姓名输入框
      // 提交中
      submiting: false,
      // 流水倍数
      flow: 1,
      // 流水提示
      flowText: '',
      // 是否有客服存款
      haskefupay: false,
      // 收款账号
      bankAccount: null,
      // orderData: {
      //   money: '',
      //   bank: null,
      //   bankName: '',
      //   alipayName: null,
      //   activityId: null,
      //   pay_method_id: null
      // },
      // paymentInfo: {
      //   min_money: 0,
      //   max_money: 1000,
      //   // 是否开启随意金额1=开启，2=不开启
      //   suit_money: 1,
      //   // 是否开启快捷金额1=开启，2=不开启
      //   is_need_bank_code: 2,
      //   h5_quick_money: ''
      // },
      paymentInfo: {
        min_money: 0,
        max_money: 1000,
        // 是否开启随意金额1=开启，2=不开启
        is_suit_money: 1,
        // 是否开启快捷金额1=开启，2=不开启
        is_need_bank_code: 2,
        quick_money_list: '',
      },
      // 存款订单
      order: null,
      // 订单弹窗
      dialogVisible: false,
      // 第三方支付（油条
      thirdPayMsg: {
        product_name: '',
        busi_pay_type: '',
      },
      // 数字货币协议列表
      protocolList: [],
      chosePtotocol: '',
      // 虚拟币汇率
      ticker: '',
      qrCodeUrl: '',
      // aoMenUi:['takchun', 'Gdh', 'Js3', 'Mgm8', 'Wns1', 'Cod8', 'Xpj28', 'Yh8', 'Yl0', 'ybh']
      aoMenUi: [
        'takchun',
        '10012',
        '10013',
        'mgm8',
        '10006',
        '10020',
        '10011',
        '10007',
        '10009',
        '10010',
        '10008',
        '10014',
        '10018',
        '10019',
        '10016',
        '10034',
        '10057',
      ],
      moneyType: '',
      showTips: false,
      displayProtocol: [],
      currencySymbol: '',
      uid: '',
      flowRate: '0',
      flowMoney: '0',
    };
  },
  watch: {
    money: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.activity = null;
          this.activityId = '';
          this.getActivities();
          this.flowCalculation();
        }
      },
      immediate: true,
    },
    activity: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.flowCalculation();
        }
      },
      immediate: true,
    },
  },
  computed: {
    isNextDisabled() {
      if (this.payType === 26 && this.paymentInfo.hash_switch === 1) {
        return !this.money || !this.hash;
      }
      return !this.money;
    },
  },
  mounted() {
    // this.moneyType = user.currencySymbol;
    // this.getPaytypes()
    // 处理油条存款
    // console.log(this.$route.query);
    if (+this.$route.query.busi_pay_type === 1) {
      localStorage.setItem('thirdPayMsg', JSON.stringify(this.$route.query));
      this.thirdPayMsg = this.$route.query;
    }
    if (
      !this.$route.query.busi_pay_type
      && localStorage.getItem('thirdPayMsg')
    ) {
      this.thirdPayMsg = JSON.parse(localStorage.getItem('thirdPayMsg'));
    }
    Promise.all([
      this.getPaytypes(),
      // this.getMerchantBank(),
      this.getAllBanklist(),
      // this.getActivities(),
      this.getAllGames(),
    ]).then(() => {
      this.loading = false;
      this.paymentsShow = !this.payment;
    });
    const store = inject('store');
    const { user, agent } = store.state;
    this.uid = store.state.user.userInfo?.id ?? '';
    this.currencySymbol = agent.currencySymbol || user.currencySymbol || '';
  },
  methods: {
    _priceFormat(price = 0) {
      if (Number.isNaN(price)) price = 0;
      return this.currencySymbol + priceFormat(price);
    },
    // // 获取支付渠道列表
    getPaytypes() {
      // const self = this;
      return paytype({
        busi_pay_type: this.thirdPayMsg
          ? this.thirdPayMsg.busi_pay_type
          : this.$route.query.busi_pay_type || '',
      }, this.isAgent).then((res) => {
        this.payTypeData = res;
        // // console.log(res)
        // this.payments = res
        // this.payments.map((item, i) => {
        //   if (item.name === this.$t('客服支付')) {
        //     this.haskefupay = true
        //     this.payments.splice(i, 1)
        //   }
        // })
        // this.onPaymentSelected(res[0])
        // // setTimeout(() => {
        // //   self.paymentSwitch(0);
        // // }, 300)
      });
    },
    // 获取渠道信息
    getDepositInfo() {
      // const data = {
      //   pay_type: this.payType
      // }
      // depositinfo(data).then(res => {
      //   this.paymentInfo = res
      //   this.moneys = res.pc_quick_money
      // })
      const { pay_method_id } = this.payment;
      const data = {
        pay_method_id,
      };
      paymethodinfo(data, this.isAgent).then((res) => {
        this.paymentInfo = {
          pay_method_id,
          ...res,
        };
        this.moneyTips = res.quick_money_exchange_list;
        this.moneys = res.quick_money_list;
        this.qrCodeUrl = res.pay_qrcode_url;
        this.displayProtocol = res?.support_protocol ?? [];
      });
    },
    // 获取渠道银行
    getBanklist() {
      const data = {
        pay_type: this.payType,
        pay_method_id: this.payment.pay_method_id,
      };
      banklist(data, this.isAgent).then((res) => {
        this.banks = res;
        // let list = JSON.parse(JSON.stringify(res))
        const allList = JSON.parse(JSON.stringify(this.allBanksForPayOnline));
        this.banksForPayOnline = [];
        allList.forEach((item) => {
          // list.forEach(sub => {
          //   if (sub.id === item.id) {
          //     item.isDisabled = false;
          //     item.name =
          //       `<div style='position: relative;'>
          //     <div style="display: ${
          //       item.isDisabled ? "block" : "none"
          //     };height: 44px;
          //     position: absolute;
          //     width: 100%;
          //     padding: 0 16px;
          //     text-align: right;">
          //     <div style='position: absolute;
          //     right: 16px;
          //     bottom: 10px;
          //     color: #999;
          //     background: #eee;
          //     padding: 0 5px;
          //     height: 18px;
          //     line-height: 18px;'>维护中</div>
          //     </div><img style='height: 26px;vertical-align: middle;' src='${this.getIcon(
          //       item.icon_code
          //     )}'></img><div>`;
          //     item = Object.assign(sub, item);
          //   }
          // });
          this.banksForPayOnline.push(item);
        });
      });
    },
    // 获取所有银行列表
    getAllBanklist() {
      return allbanklist(this.isAgent).then((res) => {
        this.allBanks = res;
        const list = JSON.parse(JSON.stringify(res));
        // list.forEach(item => {
        //   // background: rgba(224,224,224,0.6);
        //   item.isDisabled = true;
        //   item.nameCN = item.name;
        //   item.name =
        //     `<div style='position: relative;'>
        //   <div style="display: ${
        //     item.isDisabled ? "block" : "none"
        //   };height: 44px;
        //   position: absolute;
        //   width: 100%;
        //   padding: 0 16px;
        //   text-align: right;">
        //   <div style='position: absolute;
        //   right: 16px;
        //   bottom: 10px;
        //   color: #999;
        //   background: #eee;
        //   padding: 0 5px;
        //   height: 18px;
        //   line-height: 18px;'>维护中</div>
        //   </div><img style='height: 26px;vertical-align: middle;' src='${this.getIcon(
        //     item.icon_code
        //   )}'></img><div>`;
        // });
        this.allBanksForPayOnline = list;
      });
    },
    getActivities() {
      this.activities = [];
      if (this.$route.params.table) {
        const table = this.$route.params.table;
        this.activities.push({
          id: '',
          flow: 1,
          name: this.$t('大转盘-存款'),
          table,
        });
      } else if (!this.isAgent) {
        return preferentialactivity({ money: parseFloat(this.money) }).then((res) => {
          this.activities = [
            {
              id: '',
              flow: 1,
              name: this.$t('不参与优惠活动'),
            },
          ];
          Object.keys(res).forEach((item) => {
            this.activities.push(res[item]);
          });
          // this.activities = this.activities.concat(res);
        });
      }
    },
    getAllGames() {
      return getAllGameCates({ ISAGENT: true }).then((res) => {
        this.allGameCate = res;
      });
    },
    getMerchantBank() {
      const { pay_method_id } = this.payment;
      merchantbank({
        pay_method_id,
      }, this.isAgent).then((res) => {
        this.bankAccount = res;
      });
    },
    initData() {
      this.money = '';
      this.bank = null;
      this.bankId = '';
      this.activity = null;
      this.activityId = '';
      this.realName = '';
      this.alipayName = '';
      this.realname = '';
      if (this.thirdPayMsg.money) {
        this.money = this.thirdPayMsg.money * 1;
      }
    },
    // 快捷选择
    selectAmount(amount) {
      if (this.thirdPayMsg.money && amount * 1 < this.thirdPayMsg.money) {
        this.$message.error(this.$t('请选择大于油条充值的金额'));
        return;
      }
      this.money = amount;
      this.handleMoney();
    },
    onPaymentSelected(payment, channel) {
      const payType = (payment && payment.id) || 0;
      const loading = this.$loading();
      // console.log('payment', payment);
      // const data = {
      //   pay_type: payType
      // }
      this.initData();
      this.payment = payment;
      this.payment.channel = payment.name;
      this.payType = payType;
      this.order = null;
      Promise.all([
        this.getMerchantBank(),
        this.getDepositInfo(),
        this.getBanklist(),
        this.getProtocolList(),
      ]).then((res) => {
        loading.close();
      });
    },
    async getProtocolList() {
      if (this.payType === 11 || this.payType === 15 || this.payType === 16) {
        const res = await getprotocol({ pay_method_id: this.payment.pay_method_id }, this.isAgent);
        this.protocolList = res.map((item) => ({
          ...item,
          type: item.title === 'ERC20' ? '1' : '2',
        }));
        this.chosePtotocol = this.protocolList[0].protocol;
        this.handleTicker(this.protocolList[0].protocol);
      }
    },
    handleProtocol(val) {
      this.chosePtotocol = val;
      this.handleTicker(val);
    },
    async handleTicker(val) {
      const res = await getticker({ digital_mode_type: val, pay_method_id: this.payment.pay_method_id }, this.isAgent);
      this.ticker = res.upCoin;
    },
    onActivityChange(value) {
      const { activities } = this;
      const activity = activities.find((item) => item.id === value);
      this.activity = activity;
      this.showTips = true;
    },
    onSubmit() {
      const {
        payment,
        money,
        bankId,
        activityId,
        payType,
        realName,
        alipayName,
        thirdPayMsg,
        paymentInfo,
        bankAccount,
        chosePtotocol,
        realname,
      } = this;
      const { min_money, max_money } = paymentInfo;
      if (!money) {
        return this.$message.error(this.$t('请输入存款金额'));
        // if (paymentInfo.suit_money === 1) {
        //   return this.$message.error(this.$t('请输入存款金额'))
        // } else {
        //   return this.$message.error(this.$t('请选择存款金额'))
        // }
      }
      if (
        Number(money) < Number(min_money)
        || Number(money) > Number(max_money)
      ) {
        const msg = this.$t('最低存款金额{0}，最高存款金额{1}', [min_money, max_money]);
        return this.$message.error(msg);
      }
      if (!payment || !payment.id) {
        return this.$message.error(this.$t('请选择存款渠道'));
      } if (payment.id === 6 || payment.id === 14) {
        if (!alipayName) {
          return this.$message.error(this.$t('请输入支付宝姓名'));
        }
      } else if (payment.id === 2) {
        if (!realName) {
          return this.$message.error(this.$t('请输入转账银行真实姓名'));
        }
      }
      if (paymentInfo.is_need_bank_code === 1) {
        // if (!banks.length) {
        //   return this.$message.error(this.$t('无可用银行卡'))
        // }
        if (!bankId) {
          return this.$message.error(this.$t('选择银行'));
        }
      }

      // 需求1072 支付类型为网银在线且渠道类型为网银 根据后台配置要求输入真实姓名
      if (payment && payment.is_realname === 1) {
        if (!realname) {
          return this.$message.error(this.$t('请输入真实姓名'));
        }
      }

      const data = {
        pay_type: payType,
        domain: window.location.host,
        user_bank_id: bankId,
        alipay_name: alipayName,
        real_name: realName,
        bank_name: realName,
        money: parseFloat(money),
        activity_id: activityId,
        remark: bankAccount && bankAccount.rand_num,
        recive_bankaccount_id: bankAccount && bankAccount.id,
        pay_method_id: paymentInfo.pay_method_id,
        busi_pay_type: thirdPayMsg.busi_pay_type || '',
        busi_trade_no: thirdPayMsg.busi_trade_no || '',
        busi_notify_url: thirdPayMsg.busi_notify_url || '',
        digital_mode_type: chosePtotocol,
        realname,
      };

      if (this.payType === 26) {
        data.recharge_hash = this.hash;
        data.conin_amount = this.money;
        data.ticket_rate = this.paymentInfo.ticket_rate;
        data.recive_wallet_hash = this.paymentInfo.recive_wallet_hash;
      }

      this.submiting = true;
      order(data, this.isAgent)
        .then((res) => {
          if (this.$route.params.table) {
            getroulettedeposite({
              trade_no: this.$route.params.table.trade_no,
            }).then((result) => {
              this.$message({
                message: result.msg,
              });
            });
          }
          this.order = res;
          this.submiting = false;
          if (this.order.pay_url) {
            // window.open(this.order.pay_url, '_blank')
            const a = document.getElementById('link');
            a.href = this.order.pay_url;
            a.click();
          } else {
            document.getElementById('actformBtn')?.click?.();
          }
          this.dialogVisible = true;
          this.$refs.paymentDialog.onPay();
        })
        .catch((err) => {
          // this.$message.error(err)
          this.submiting = false;
        });
    },
    flowCalculation() {
      if (this.activityId && this.money) {
        activity_require({
          uid: this.uid,
          id: this.activityId,
          money: this.money,
        }).then((data) => {
          this.flowRate = data.flow_rate || '0';
          this.flowMoney = this._priceFormat(data.flow_money || 0);
        });
      }
    },
    onCancel() {
      this.order = null;
      this.dialogVisible = false;
    },
    showDepositTips() {
      this.$refs.depositTeach.dialogVisible = true;
      this.$refs.depositTeach.activeName = `active${this.activeindex}`;
    },
    handleMoney() {
      const max = this.money * 1 + 1;
      const min = this.money * 1;
      if (this.payType === 14) {
        this.money = (Math.random() * (max - min) + min).toFixed(2);
      }
    },
    go() {
      if (this.payment.pc_url && !this.payment.pc_url.includes('https')) {
        this.$router.push(this.payment.pc_url);
      } else if (this.payment.pc_url && this.payment.pc_url.includes('https')) {
        window.open(this.payment.pc_url);
      }
    },
  },
});
</script>

<style lang="scss">
.deposit {
  position: relative;

  p {
    margin: 0;
  }

  .el-dialog__wrapper {
    display: flex;
    align-items: center;
  }

  .addon {
    color: var(--font-color-666);
    display: flex;
    align-items: center;
    font-size: 14px;
    position: absolute;
    right: 0;
    top: -84px;
    cursor: pointer;

    svg {
      fill: var(--theme-color) !important;
      font-size: 25px;
      margin-left: 10px;
    }
  }

  .form-ul li {
    margin-bottom: 20px;

    &.usdt-offline {
      width: 500px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      em {
        font-style: normal;
        color: var(--theme-color);
      }
    }

    label {
      font-size: 14px;
      margin-bottom: 10px;
      display: block;
      color: var(--font-color-000);
    }

    .amount {
      width: 500px;
    }
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
  }
}

.deposit .el-select .el-input {
  width: 400px;
}

.information {
  .el-input {
    width: 400px;
  }

  .form-tips {
    width: 400px;
    border: 1px solid var(--theme-color);
    border-radius: 6px;
    color: var(--theme-color);
    padding: 5px 10px;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss" scoped>
.payments {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-right: 150px;
  margin-bottom: 20px;

  .payment-item {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 45px;
    cursor: pointer;
  }

  .tips {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    line-height: 40px;
    cursor: pointer;
    font-size: 14px;
    color: var(--font-color-999);

    svg {
      font-size: 25px;
      margin-right: 5px;
    }
  }
}

.form-tips-top {
  margin-bottom: 20px;

  h2 {
    font-size: 16px;
    color: var(--font-color-000);
    font-weight: 500;
    line-height: 30px;
    margin: 0 0 10px;
  }

  span {
    display: inline-block;
    width: 120px;
    height: 40px;
    border: 1px solid var(--border-color-000-2);
    border-radius: 6px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    margin-right: 10px;
    cursor: pointer;

    &.active {
      border-color: var(--theme-color);
      color: var(--theme-color);
    }
  }
}

.deposit-form {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  h2 {
    font-size: 16px;
    color: var(--font-color-000);
    font-weight: 500;
    line-height: 30px;
    margin: 0 0 10px;
  }
}

.card {
  width: 405px;
  margin-right: 35px;

  p {
    color: var(--font-color-000);
    font-size: 12px;
    padding: 30px 0;
    line-height: 20px;
    margin: 0;
  }
}

// $maxWidth: 505px;
.information {
  width: 100%;
  // padding-left: 30px;
  // li {
  //   .el-input,
  //   .el-select{
  //     width: 100%;
  //     max-width: $maxWidth;
  //   }
  // }
  // .form-tips{
  //   max-width: $maxWidth;
  // }
}

.tips-ticker {
  margin-left: 30px;

  .svg-icon {
    position: relative;
  }
}

.ticker {
  margin-bottom: 20px;

  i {
    color: var(--theme-color);
  }
}

.submit {
  width: 300px;
}
</style>
