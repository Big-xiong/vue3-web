<template>
  <div class="info-wrap">
    <div class="info-menu">
      <div
        v-for="menu in menus"
        :key="menu.id"
        :class="menu.id === currentId ? 'menu-item selected' : 'menu-item'"
        @click="onHandleMenu(menu.id)"
      >
        {{ menu.title }}
      </div>
    </div>
    <div class="info-content">
      <div class="content-header">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/header.png" class="header-title-img" alt="" />
        </div>
      </div>
      <div class="content-item">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/one-title.png" class="header-img" alt="" />
        </div>
        <div class="header-list">
          <div class="list-item">
            {{ $t('火币网站为：www.huobi.com/zh-cn，如无法开启，建议使用VPN') }}
          </div>
          <div class="list-item">
            {{ $t('注册之后，需要实名验证才可以购买USDT。') }}
          </div>
          <div class="list-item">
            {{ $t('请购买与存款页面所相对应的USDT类型，如在存款页面选择ERC20则购买时也选择ERC20，不同类型转账将导致失败。') }}
          </div>
          <div class="list-item">
            {{ $t('若交易所的内容有所变更，一切以交易所官方信息为准。') }}
          </div>
          <div class="list-item">
            {{ $t('操作时请尽快完成充值，以免长时间未完成操作导致二维码失效。') }}
          </div>
          <div class="list-item">
            {{ $t('请勿多次取消交易，否则触发网站风控，当日无法交易。') }}
          </div>
          <div class="list-item">
            {{
              $t(
                '本教程为热门交易所功能介绍，不负责担保任何交易结果，使用中若遇到操作、账户类的问题，请联系交易所客服获取专业协助。'
              )
            }}
          </div>
          <div class="list-item green">
            {{ $t('转出时需支付少量手续费，请在买币前联系币安客服了解手续费数量。') }}
          </div>
        </div>
      </div>
      <div class="content-item">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/two-title.png" class="header-img" alt="" />
        </div>
        <div class="content-imgs">
          <el-carousel
            :autoplay="false"
            arrow="always"
            class="steps"
            height="478px"
            indicator-position="outside"
            @change="onCarouselChange('two', $event)"
          >
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/1-1.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/1-2.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/1-3.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/1-4.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/1-5.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/1-6.png" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content-desc">
          {{ twoTitle }}
        </div>
      </div>
      <div class="content-item">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/three-title.png" class="header-img" alt="" />
        </div>
        <div class="content-imgs">
          <el-carousel
            :autoplay="false"
            arrow="always"
            class="steps"
            height="478px"
            indicator-position="outside"
            @change="onCarouselChange('three', $event)"
          >
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-1.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-2.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-3.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-4.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-5.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-6.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/2-7.png" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content-desc">
          {{ threeTitle }}
        </div>
      </div>
      <div class="content-item">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/four-title.png" class="header-img" alt="" />
        </div>
        <div class="content-imgs">
          <el-carousel
            :autoplay="false"
            arrow="always"
            class="steps"
            height="478px"
            indicator-position="outside"
            @change="onCarouselChange('four', $event)"
          >
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-1.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-2.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-3.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-4.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-5.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-6.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-7.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-8.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/3-9.png" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content-desc">
          {{ fourTitle }}
        </div>
      </div>
      <!-- <div v-show="!['10062', '10029', '10063', '10064'].includes(projectName)" class="content-item"> -->
      <div class="content-item">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/five-title.png" class="header-img" alt="" />
        </div>
        <div class="content-imgs">
          <el-carousel
            :autoplay="false"
            arrow="always"
            class="steps"
            height="478px"
            indicator-position="outside"
            @change="onCarouselChange('five', $event)"
          >
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/4-1.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/4-2.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/4-3.png" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content-desc">
          {{ fiveTitle }}
        </div>
      </div>
      <div class="content-item">
        <div>
          <img src="/src/current_project/assets/images/activity/huobiInfo/six-title.png" class="header-img" alt="" />
        </div>
        <div class="content-imgs">
          <el-carousel
            :autoplay="false"
            arrow="always"
            class="steps"
            height="478px"
            indicator-position="outside"
            @change="onCarouselChange('six', $event)"
          >
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-1.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-2.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-3.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-4.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-5.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-6.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-7.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-8.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-9.png" alt="" />
            </el-carousel-item>
            <el-carousel-item>
              <img src="/src/current_project/assets/images/activity/huobiInfo/5-10.png" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="content-desc">
          {{ sixTitle }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import subconfig from '@current/config';

// 10001  10029商户无需判断 bug#19725 bug#19726
// const projectName = import.meta.env.VITE_APP_PROJECT_NAME;

export default defineComponent({
  data() {
    return {
      title: subconfig.title,
      menus: [
        {
          id: 1,
          title: $t('交易所介绍')
        },
        {
          id: 2,
          title: $t('注册账号及认证')
        },
        {
          id: 3,
          title: $t('购买USDT')
        },
        {
          id: 4,
          title: $t('平台USDT充值')
        },
        {
          id: 5,
          title: $t('平台USDT提现')
        },
        {
          id: 6,
          title: $t('USDT兑换人民币')
        }
      ],
      currentId: 1,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      six: 0
    };
  },
  computed: {
    twoTitle() {
      let str = '';
      switch (this.two) {
        case 0:
          str = $t('注册-步骤1/3：登入首页https://www.huobi.com,点击右上角[注册]。');
          break;
        case 1:
          str = $t('注册-步骤2/3: 选择「手机号」或者「邮箱」注册，填写完毕输入密码，点击注册。');
          break;
        case 2:
          str = $t('注册-步骤3/3：完成后，显示提示弹窗[注册成功]！');
          break;
        case 3:
          str = $t('认证-步骤1/3：点击右上角[头像]，进入[账户＆安全]或[身份认证]。');
          break;
        case 4:
          str = $t('认证-步骤2/3: 账户安全-绑定资金密码，谷歌/邮箱验证，防钓鱼验证，安全设备。');
          break;
        case 5:
          str = $t('认证-步骤3/3：身份认证-上传您的身份证信息，进行面部识别，完成实名认证完成认证之后，即可开启购买USDT功能。');
          break;
        default:
          break;
      }
      return str;
    },
    threeTitle() {
      let str = '';
      switch (this.three) {
        case 0:
          str = $t(
            `购买-步骤1/7: 进入${this.title}官网，点击[虚拟币充值]获取USDT存款地址与存入USDT数量，获取协议ERC20或TRC20 。`
          );
          break;
        case 1:
          str = $t('购买-步骤2/7: 买币请先点击右下方帮助联系客服，确认提现手续费完成后左上方点击[买币]。');
          break;
        case 2:
          str = $t('购买-步骤3/7：选择[自选交易]，[购买]，[USDT]，输入想购买数量，点击[购买USDT]。');
          break;
        case 3:
          str = $t('购买-步骤4/7：输入购买USDT数量（存入USDT数量+手续费），确认金额，支付方式，点击[立即购买] 。');
          break;
        case 4:
          str = $t(
            '购买-步骤5/7: 进入[购买USDT]页面，确认付款信息，进入银行/支付宝/微信，完成转账后，点击[我已完成转账，下一步]。'
          );
          break;
        case 5:
          str = $t('购买-步骤6/7：弹出确认视窗，确认后点击[确认]，过程大约3-5分钟。');
          break;
        case 6:
          str = $t('购买-步骤7/7：完成之后，订单页面显示[订单已完成]。');
          break;
        default:
          break;
      }
      return str;
    },
    fourTitle() {
      let str = '';
      switch (this.four) {
        case 0:
          str = $t('充值-步骤1/9: 点击右上角[资产]，点击进入[币币账户]页面。');
          break;
        case 1:
          str = $t('充值-步骤2/9: 请先绑定您要转出USDT的地址，点击[提币地址管理]。');
          break;
        case 2:
          str = $t('充值-步骤3/9：选择[币种]，[链名称]，输入[提币地址]，点击添加。');
          break;
        case 3:
          str = $t('充值-步骤4/9：手机获取验整码，输入后点击[确定]。');
          break;
        case 4:
          str = $t('充值-步骤5/9: 完成绑定提币地址。');
          break;
        case 5:
          str = $t('充值-步骤6/9：点击USDT币种最右边的操作[提币]，输入[提币地址]，[链名称]，[数量]，确认[手续费]，点击提币。');
          break;
        case 6:
          str = $t('充值-步骤7/9：收到短信，即是完成转出，大约5-10分钟。');
          break;
        case 7:
          str = $t('充值-步骤8/9: 点击总资产折合右侧进入[财务记录]页面。');
          break;
        case 8:
          str = $t('充值-步骤9/9：选择[提币记录]，即可看到历史交易记录。');
          break;
        default:
          break;
      }
      return str;
    },
    fiveTitle() {
      let str = '';
      switch (this.five) {
        case 0:
          str = $t('提现-步骤1/3：点击右上角[钱包]，点击进入[币币账户]页面。');
          break;
        case 1:
          str = $t('提现-步骤2/3: 点击USDT，右边[充币]，选择链名称，获取充币地址。');
          break;
        case 2:
          str = $t(`提现-步骤3/3：在${this.title}网站，输入地址，选择协议，添加您的USDT 提现地址。`);
          break;
        default:
          break;
      }
      return str;
    },
    sixTitle() {
      let str = '';
      switch (this.six) {
        case 0:
          str = $t('兑换-步骤1/10: 请先绑定收款账户：点击右上角[头像]，进入[法币设置] 。');
          break;
        case 1:
          str = $t('兑换-步骤2/10: 点击[+添加收款方式]，添加银行卡/支付宝/微信信息。');
          break;
        case 2:
          str = $t('兑换-步骤3/10：选择收款方式，银行卡/支付宝/微信。');
          break;
        case 3:
          str = $t('兑换-步骤4/10：添加收款方式，输入姓名，账户信息，点击[完成设置]，即可开始兑换人民币。');
          break;
        case 4:
          str = $t('兑换-步骤5/10: 主页左上方点击[买币]，选择[自选交易]，[出售]，[USDT]，选择出售方式，点击[出售USDT]。');
          break;
        case 5:
          str = $t('兑换-步骤6/10：弹出确认视窗，输入要出售的USDT数量，确认后点击[下单]。');
          break;
        case 6:
          str = $t('兑换-步骤7/10：进入[出售USDT]页面，等候付款人操作。');
          break;
        case 7:
          str = $t(
            '兑换-步骤8/10: 当付款人向您打款，请到您的银行卡/支付宝/微信确认是否收到款项，如果收到，点击[确认收款并放行]。'
          );
          break;
        case 8:
          str = $t('兑换-步骤9/10：弹出确认视窗，输入资金密码，确认后点击[确认放行]，兑换过程大约3-5分钟。');
          break;
        case 9:
          str = $t('兑换-步骤10/10：确认之后，订单状态变成已完成，恭喜您完成兑换人民币！');
          break;
        default:
          break;
      }
      return str;
    }
  },
  created() {
    window.scrollTo(0, 0);
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll);
    });
    // if (['10062', '10029', '10063', '10064'].includes(projectName)) {
    //   this.menus.splice(4, 1);
    // }
  },
  methods: {
    onCarouselChange(key, index) {
      this[key] = index;
    },
    onHandleMenu(id) {
      if (id === 1) {
        window.scrollTo(0, 0);
      } else if (id === 2) {
        window.scrollTo(0, 880);
      } else if (id === 3) {
        window.scrollTo(0, 1660);
      } else if (id === 4) {
        window.scrollTo(0, 2440);
      } else if (id === 5) {
        window.scrollTo(0, 3220);
      } else if (id === 6) {
        // if (['10062', '10029', '10063', '10064'].includes(projectName)) {
        //   window.scrollTo(0, 3220);
        // } else {
        //   window.scrollTo(0, 4000);
        // }
        window.scrollTo(0, 4000);
      }
    },
    handleScroll() {
      let scrollTopE = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let _id = 1;
      if (scrollTopE >= 0 && scrollTopE <= 650) {
        _id = 1;
      } else if (scrollTopE > 650 && scrollTopE <= 1400) {
        _id = 2;
      } else if (scrollTopE > 1400 && scrollTopE <= 2200) {
        _id = 3;
      } else if (scrollTopE > 2200 && scrollTopE <= 3000) {
        _id = 4;
      } else if (scrollTopE > 3000 && scrollTopE <= 3800) {
        // if (['10062', '10029', '10063', '10064'].includes(projectName)) {
        //   _id = 6;
        // } else {
        //   _id = 5;
        // }
        _id = 5;
      } else {
        _id = 6;
      }
      if (this.currentId !== _id) {
        this.currentId = _id;
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.info-wrap {
  background: #0a1974;
  .info-menu {
    margin: 0;
    width: 160px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateY(-50%);
    margin-top: 54px;
    z-index: 89;
    margin-left: -750px;
    .menu-item {
      margin-bottom: 12px;
      width: 162px;
      height: 52px;
      background: #1051d8;
      border-radius: 5px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 52px;
      cursor: pointer;
      &.selected {
        background: #04cd75;
      }
    }
  }
  .info-content {
    padding-top: 80px;
    padding-bottom: 10px;
    width: 1050px;
    margin: 0 auto;
    .content-header {
      .header-title-img {
        width: 537px;
        height: 60px;
      }
    }
    .content-item {
      margin-top: 40px;
      margin-bottom: 100px;
      .header-img {
        width: 1078px;
        height: 100px;
      }
      .content-imgs {
        margin-top: 50px;
      }
      .content-desc {
        margin-top: 40px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }
      .header-list {
        margin-top: 38px;
        padding: 0 18px;
        .list-item {
          position: relative;
          text-align: left;
          margin-top: 12px;
          background: #030c5e;
          border-radius: 5px;
          line-height: 52px;
          padding-left: 60px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          &.green {
            color: #04cd75;
            &::before {
              background: #04cd75;
            }
          }
          &::before {
            content: '';
            display: block;
            position: absolute;
            width: 6px;
            border-radius: 3px;
            height: 6px;
            background: #ffffff;
            left: 30px;
            top: 50%;
            margin-top: -3px;
          }
        }
      }
    }
  }
}
.steps {
  margin: 0 auto;
  margin-left: -20px;
  width: 1090px;
  :deep(.el-carousel__indicators--outside) {
    display: none;
  }
  :deep(.el-carousel__indicator--horizontal .el-carousel__button) {
    width: 12px;
    height: 12px;
    background: #cccccc;
    padding: 0;
    border-radius: 50%;
    margin: 30px 4px;
  }
  :deep(.el-carousel__arrow) {
    background-color: transparent;
    color: #fff;
    font-size: 32px;
  }
  :deep(.el-icon-arrow-left),
  :deep(.el-icon-arrow-right) {
    background-color: rgba(255, 255, 255, 0.1);
    width: 48px;
    height: 100px;
    line-height: 100px;
    border-radius: 4px;
  }
  img {
    height: 100%;
  }
}
</style>
