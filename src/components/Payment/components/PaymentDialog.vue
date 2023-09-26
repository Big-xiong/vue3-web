<template>
  <div class="pay-dialog">
    <el-dialog title v-model="dialogVisible" width="500px" :modal-append-to-body="false" :show-close="true" center>
      <!-- 支付风控提示 -->
      <template v-if="order?.is_tips && showTip">
        <h2>{{  $t('支付提醒')  }}</h2>
        <p>{{  $t('请问您当前存款遇到问题吗？客服小姐姐协助您解决哟！')  }}</p>
        <div class="buttons">
          <el-button type="primary" @click="onPay">{{  $t('继续支付')  }}</el-button>
          <el-button @click="onContact">{{  $t('联系客服')  }}</el-button>
        </div>
      </template>
      <template v-else>
        <!-- 新订单 -->
        <template v-if="status === 0">
          <div class="icon">
            <img v-lazy="icons[payType]" />
          </div>
          <h2>{{  payment.name  }}</h2>
          <p v-if="payType === 4">{{  $t('QQ钱包支付，存款要输入绑定的卡号按提示操作即可存款成功')  }}</p>
          <p v-else>{{  $t('请在新打开的支付页面完成支付')  }}</p>
          <div class="buttons">
            <el-button type="primary" @click="onPay">{{  $t('去支付')  }}</el-button>
            <el-button @click="onCancel">{{  $t('关闭')  }}</el-button>
          </div>
        </template>

        <!-- 支付中 -->
        <template v-if="status === 1">
          <div class="icon">
            <svg-icon name="processing" />
          </div>
          <div v-if="payType === 2 || payType === 6 || payType === 12 || payType === 13 || payType === 14">
            <h2>{{  $t('您的交易正在处理中')  }}</h2>
            <p>{{  $t('您的存款系统正在处理中，请您耐心等待')  }}</p>
            <p class="time-desc" style="margin-top: 20px;">{{  secondToDate(datatimer)  }}</p>
          </div>
          <div v-else>
            <h2 style="margin-top: 20px;">{{  payment.name  }}</h2>
            <p v-lang:en="`padding:0 75px`">{{  $t('您是否完成存款，完成存款点击已完成支付哦')  }}</p>
            <!-- <p>{{ $t('请在新打开的支付页面完成支付') }}</p> -->
            <p class="time-desc" style="margin-top: 20px;">{{  secondToDate(datatimer)  }}</p>
          </div>
          <div class="buttons">
            <el-button
              v-if="(payType === 2 || payType === 6 || payType === 12 || payType === 13 || payType === 14) && showButton"
              type="primary" @click="gorecorddeposit" v-lang:en="`padding:0`">{{  $t('查看交易记录')  }}</el-button>
            <el-button v-if="payType !== 2 && payType !== 6 && payType !== 12 && payType !== 13 && payType !== 14"
              type="primary" @click="onFinishPay" v-lang:en="`padding:0`">{{  $t('已完成支付')  }}</el-button>
            <el-button @click="onContact" v-lang:en="`padding:0`">{{  $t('支付遇到问题')  }}</el-button>
          </div>
        </template>
      </template>

      <!-- 支付成功 -->
      <template v-if="status === 2 || status === 4">
        <div v-if="status === 2" class="icon">
          <i class="el-icon-success" />
        </div>
        <div v-else class="icon">
          <img v-lazy="icons[payType]" />
        </div>
        <h2 style="margin-top: 12px;">{{  payment.name  }}</h2>
        <p v-if="status === 2" :html="$t('您的转账信息已提交成功,请耐心等待财务审核，审核完成后，我们会立刻打款到您的账户')" />
        <p v-else>{{  payment.name  }}{{  $t(`支付成功，正在为您上分`)  }}</p>
        <div class="buttons">
          <el-button type="primary" @click="onContinue">{{  $t('您的转账信息已提交成功,请耐心等待财务审核，审核完成后，我们会立刻打款到您的账户')  }}</el-button>
          <el-button @click="onRetrunHome">{{  $t('查看交易记录')  }}</el-button>
        </div>
      </template>

      <!-- 支付失败 -->
      <template v-if="status === 3">
        <div class="icon">
          <i class="el-icon-warning" style="color: #FF6666" />
        </div>
        <h2 style="margin-top: 20px;">{{  payment.name  }}</h2>
        <p>{{  $t('失败原因')  }}:{{  reasonForFailure  }}</p>
        <div class="buttons">
          <el-button type="primary" @click="$openKefu">{{  $t('支付遇到问题')  }}</el-button>
          <el-button @click="onCancel">{{  $t('取消')  }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- <form
              id="actform"
              style="display:none;"
              name="actform"
              :method="order.form.type"
              :action="order.form.url"
              target="_blank"
            >
              <input
                v-for="(val, key) in order.form.form"
                :key="key"
                :name="key"
                type="hidden"
                :value="val"
              >
              <button
                id="actformBtn"
                type="submit"
              >
                {{ $t('提交') }}
              </button>
        </form>-->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { paymentIcons as icons } from '@/config/payment';
import { checkorder } from '@/api/center';

const PAY_STATUS = {
  NEW: 0,
  PAYING: 1,
  SUCCESS: 2,
  FAIL: 3,
  FINSHE: 4,
};

export default defineComponent({
  props: ['order', 'payment', 'initStatus', 'modelValue'],
  data() {
    return {
      icons,
      // imgSrc: ["zaixian.png", "wangyin.png", "weixin.png", "QQ.png", "zfb.png", "zfb.png","wangyin.png","wangyin.png","","wangyin.png"],
      customerServiceUrl: '',
      types: [],
      status: PAY_STATUS.NEW,
      reasonForFailure: '',
      pay: true,
      timer: null,
      datatimer: 900,
      showTip: true,
    };
  },
  computed: {
    payType() {
      return this.payment && this.payment.id;
    },
    dialogVisible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
    showButton() {
      return !this.$route.path.includes('affiliate');
    },
  },
  created() {
    if ([2, 6, 12, 13, 14].includes(this.payType)) {
      this.status = PAY_STATUS.PAYING;
      // this.timer = setInterval(() => {
      //   this.datatimer--
      //   if (this.datatimer <= 0) {
      //     this.onCancel()
      //   }
      // }, 1000)
      this.timerAction();
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    onPay() {
      // if (this.order.pay_url) {
      //   window.open(this.order.pay_url, '_blank')
      // } else {
      //   document.getElementById('actformBtn').click()
      // }
      this.status = PAY_STATUS.PAYING;
      this.timerAction();
      this.showTip = false;
    },
    // 支付遇到问题，在线客服
    onContact() {
      // window.open(this.customerServiceUrl, '_blank')
      this.$openKefu();
    },
    onRetrunHome() {
      this.$emit('cancel');
      this.$store.dispatch('user/getUserInfo');
      window.localStorage.removeItem('thirdPayMsg');
    },
    secondToDate(result) {
      // var h = Math.floor(result / 3600);
      const m = Math.floor(((result / 60) % 60));
      const s = Math.floor((result % 60));
      return m + this.$t('分钟') + s + this.$t('秒');
    },
    timerAction() {
      this.datatimer = 900;
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.datatimer -= 1;
        if (this.datatimer <= 0) {
          this.onCancel();
        }
      }, 1000);
    },
    gorecorddeposit() {
      this.$router.push({
        name: 'centerDepositRecord',
      });
      this.onCancel();
    },
    onCancel() {
      this.$emit('cancel');
    },
    onContinue() {
      this.$emit('cancel');
      this.$store.dispatch('user/getUserInfo');
      window.localStorage.removeItem('thirdPayMsg');
    },
    async onFinishPay() {
      const { pay_status } = await checkorder({
        trade_no: this.order.trade_no,
      });
      // const pay_status = 2
      if (pay_status === 1) {
        // 未支付
        this.reasonForFailure = this.$t('未支付');
        this.status = PAY_STATUS.FAIL;
      } else if (pay_status === 2) {
        // 已支付
        if (this.payType === 2 || this.payType === 6 || this.payType === 12 || this.payType === 13 || this.payType === 14) {
          // 如果是线下转账
          this.status = PAY_STATUS.SUCCESS;
        } else {
          // 如果是在线支付
          // this.$router.push({
          //   path: '/center/saveMoney/paySuccess',
          //   query: {
          //     id: this.order.trade_no
          //   }
          // })
          this.status = PAY_STATUS.FINSHE;
        }
        this.$store.dispatch('user/getUserInfo');
        window.localStorage.removeItem('thirdPayMsg');
      } else if (pay_status === 4) {
        this.status = PAY_STATUS.FAIL;
        // TODO: 接口未返回错误信息
      } else {
        this.reasonForFailure = this.$t('未支付');
        this.status = PAY_STATUS.FAIL;
      }
    },
    onFailConfirm() {
      this.$emit('cancel');
    },
  },
});
</script>

<style lang="scss" scoped>
$iconSize: 70px;

.pay-dialog {
  :deep(.el-dialog__header) {
    margin: 0 auto;
    border-bottom: none;
    background: #282828;
    box-shadow: none;
    border-radius: 10px 10px 0 0;
  }

  :deep(.el-dialog__body) {
    margin: 0 auto;
    padding: 0 20px 20px;
    background: var(--bg-color-282828);
    box-shadow: none;
    border-radius: 10px;
    text-align: center;

    .icon {
      width: $iconSize;
      height: $iconSize;
      display: inline-block;
      margin: 20px 0;

      img {
        width: 100%;
      }

      .el-icon-success {
        color: var(--theme-color);
      }

      i {
        font-size: $iconSize;
      }

      .svg-icon {
        width: $iconSize;
        height: $iconSize;
        fill: var(--theme-color) !important;
      }
    }

    h2 {
      font-size: 20px;
      color: var(--theme-color);
      margin-bottom: 20px;
    }

    p {
      color: var(--font-color-000);
      opacity: 0.6;
      font-size: 16px;

      &.time-desc {
        color: var(--font-color-f66);
      }
    }

    .buttons {
      padding: 30px 0;
      width: 200px;
      margin: 0 auto;

      .el-button {
        width: 100%;
        margin: 20px 0 0;
      }
    }
  }

  // .infoBtn {
  //   width: 220px;
  //   height: 43px;
  //   background-color: white;
  //   margin-top: 11px;
  //   border-radius: 3px;
  //   font-size: 15px;
  //   margin-left: 0;
  //   background: white;
  //   border:1px solid rgba(225,225,225,1);
  // }

  // .blackBtn {
  //   display: block;
  //   font-size: 15px;
  //   font-weight: bold;
  //   color: rgba(243, 203, 117, 1);
  //   width: 220px;
  //   height: 43px;
  //   background: linear-gradient(90deg, rgba(45, 41, 30, 1) 0%, rgba(20, 18, 13, 1) 100%);
  //   border-radius: 3px;
  // }

  // img {
  //   margin-top: 45px;
  // }

  // h2 {
  //   margin-top: -20px;
  //   font-size: 20px;
  //   margin-bottom: 10px;
  //   font-size: 18px;
  //   font-family: PingFangSC-Semibold;
  //   font-weight: 600;
  //   color: rgba(51, 51, 51, 1);
  // }

  // p {
  //   margin-bottom: 40px;
  //   text-align: center;
  //   opacity: 1;
  //   font-size: 13px;
  // }
  // }
}
</style>
