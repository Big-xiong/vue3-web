<template>
  <div id="usdt-detail">
    <div
      class="usdt-one"
      :style="{ backgroundImage: `url(${$getSrc('/src/assets/images/activity/usdt/bg.png')})` }"
    >
      <div class="usdt-mid">
        <el-button
          type="btn"
          class="btn-join"
          v-login
          @click="$router.push({ name: 'centerDeposit' })"
        >
          {{ $t('立即参与') }}
        </el-button>
        <h2 class="usdt-tit">
          {{ $t('还没有用过数字货币吗？') }}
        </h2>
        <p class="tips">
          {{
            $t(
              '数字货币是现代社会中最有价值的发明之一，对世界经济产生了深刻影响。其主要优势之一是保证交易安全的同时 还能快速稳定地转移资金。'
            )
          }}
        </p>
        <div class="usdt-items">
          <div>
            <img
              src="/src/views/index/activity/usdtInfo/img/img1.png"
              alt=""
            />
            <div class="info">
              <p class="tit">
                {{ $t('安全有保障') }}
              </p>
              <p class="desc">
                {{
                  $t(
                    '与银行卡等传统支付方式相比，玩家不需要给出自己的姓名或卡号即可完成数字货币交易，避免了敏感信息泄漏。'
                  )
                }}
              </p>
            </div>
          </div>
          <div>
            <img
              src="/src/views/index/activity/usdtInfo/img/img2.png"
              alt=""
            />
            <div class="info">
              <p class="tit">
                {{ $t('交易速度快') }}
              </p>
              <p class="desc">
                {{
                  $t(
                    '数字货币所采用的区块链技术具有去中心化特点，不需要清算中心机构来处理数据，交易时间将被缩短'
                  )
                }}
              </p>
            </div>
          </div>
          <div>
            <img
              src="/src/views/index/activity/usdtInfo/img/img3.png"
              alt=""
            />
            <div class="info">
              <p class="tit">
                {{ $t('高度匿名性') }}
              </p>
              <p class="desc">
                {{
                  $t(
                    '不由央行或当局发行，不受银行监管，玩家可以随心所欲地使用存放在自己数字钱包里的资金'
                  )
                }}
              </p>
            </div>
          </div>
        </div>
        <h2 class="usdt-tit">
          {{ $t('USDT泰达币优势') }}
        </h2>
        <p class="tips">
          {{
            $t(
              '泰达币（Tether）也被称为USDT，其价值与美元对等，1USDT=1美元。作为最稳定且保值的币种，在数字货币中 独占鳌头'
            )
          }}
        </p>
        <div class="usdt-items usdt-items02">
          <div>
            <img
              src="/src/views/index/activity/usdtInfo/img/img4.png"
              alt=""
            />
            <div class="info">
              <p class="tit">
                {{ $t('安稳') }}
              </p>
              <p class="dot">
                {{ $t('匿名买卖') }}
              </p>
              <p class="dot">
                {{ $t('不受银行监管') }}
              </p>
              <p class="dot">
                {{ $t('价格稳定') }}
              </p>
            </div>
          </div>
          <div>
            <img
              src="/src/views/index/activity/usdtInfo/img/img5.png"
              alt=""
            />
            <div class="info">
              <p class="tit">
                {{ $t('易用') }}
              </p>
              <p class="dot">
                {{ $t('交易快速到账') }}
              </p>
              <p class="dot">
                {{ $t('24小时随时交易') }}
              </p>
              <p class="dot">
                {{ $t('交易额度无上限') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="usdt-two">
      <div class="usdt-mid">
        <h2 class="usdt-tit">
          {{ $t('知名虚拟交易平台列示') }}
        </h2>
        <div class="usdt-platform-info">
          <div class="platform-item">
            <div class="platform-title">
              <img class="huobi-img" src="/src/views/index/activity/usdtInfo/img/huobi-icon.png" alt=""/>
              <span>{{ $t('火币') }}</span>
            </div>
            <p class="platform-desc">
              {{ $t('火币提供全快捷的USDT泰达币交易服务，以及实时价格行情，上百种数字货币的交易及投资，是稳定高效的数字货币交易平台。') }}
            </p>
            <div class="platform-btn">
              <el-button
                type="btn"
                class="btn-look"
                @click="$router.push({ name: 'huobiInfo' })"
              >
                {{ $t('查看教程') }}
              </el-button>
            </div>
          </div>
          <div class="platform-item">
            <div class="platform-title">
              <img class="bian-img" src="/src/views/index/activity/usdtInfo/img/bian-icon.png" alt=""/>
              <span>{{ $t('币安') }}</span>
            </div>
            <p class="platform-desc">
              {{ $t('币安是全球领先的数字货币交易平台，提供比特币、莱特币、以太坊、BNB、USDT等主流数字货币交易。') }}
            </p>
            <div class="platform-btn">
              <el-button
                type="btn"
                class="btn-look"
                @click="$router.push({ name: 'bianInfo' })"
              >
                {{ $t('查看教程') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="usdt-two" style="background-color: #03329c">
      <div class="usdt-mid">
        <h2 class="usdt-tit">
          {{ $t('优惠活动') }}
        </h2>
        <div class="usdt-active">
          <div @click="$router.push({ name: 'usdt' })">
            <div>
              <img src="/src/views/index/activity/usdtInfo/img/img7.png" alt="" />
            </div>
            <p>{{ $t('USDT40%大让利') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#usdt-detail {
  * {
    box-sizing: border-box
  }
  p {
    margin: 0;
  }
  h2{
    margin: 0;
    margin-bottom: 18px;
    font-weight: 400;
  }
  :deep(.el-button){
    border: none;
    outline: none;
    &:hover{
      color: #fff !important;
      background-color: #06cd75 !important;
    }
    &:focus{
      background-color: #06cd75 !important;
    }
  }
  .usdt-mid {
    width: 1200px;
    margin: 0 auto;
  }
  .usdt-one {
    height: 1679px;
    background-position: center top;
    background-repeat: no-repeat;
    text-align: left;
    padding-top: 408px;
    .btn-join {
      width: 250px;
      height: 60px;
      background: #06cd75;
      border-radius: 4px;
      font-size: 20px;
      color: #fff;
      margin-bottom: 229px;
      &:hover {
        border: 0;
      }
    }

    .tips {
      font-size: 24px;
      color: #fff;
      line-height: 29px;
      margin: 15px 0 26px;
    }
    .usdt-items {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 44px;
      &.usdt-items02 > div {
        width: 585px;
        height: 290px;
      }
      > div {
        position: relative;
        width: 378px;
        height: 240px;
        .info {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          .tit {
            font-size: 28px;
            color: #fff;
            padding: 48px 0 0 24px;
          }
          .desc {
            color: #c7d8ff;
            font-size: 18px;
            line-height: 1.5;
            padding: 50px 24px 0;
          }
          .dot {
            font-size: 24px;
            color: #fff;
            margin: 0 0 29px 24px;
            display: block;
            &:nth-child(2) {
              margin-top: 29px;
            }
            &:before {
              content: '';
              border-width: 6px;
              border-style: solid;
              width: 0;
              height: 0;
              display: inline-block;
              margin-right: 11px;
              border-color: transparent transparent transparent #06cd75;
            }
          }
        }
      }
    }
  }
  .usdt-tit {
    font-size: 34px;
    color: #fff;
    position: relative;
    padding-bottom: 18px;
    &:after {
      content: '';
      position: absolute;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #0e54d3 0%, #06cb76 100%);
      left: 0;
      bottom: 0;
    }
  }
  .usdt-two {
    background-color: #03105a;
    padding: 60px 0 80px;
    .usdt-tit:after {
      left: 50%;
      margin-left: -30px;
    }
    .usdt-tags {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 35px 0 55px;
      span {
        width: 200px;
        height: 60px;
        background: #0f51d5;
        border-radius: 6px;
        margin: 0 10px;
        font-size: 20px;
        color: #fff;
        text-align: center;
        line-height: 60px;
        &:last-child {
          background-color: #06cd75;
        }
      }
    }
  }
  .usdt-active {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 50px;
    > div {
      width: 1200px;
      height: 420px;
      background: #022078;
      border-radius: 10px;
      padding: 20px;
      &:hover img {
        transform: scale(1.1);
      }
      div {
        width: 100%;
        height: 300px;
        border-radius: 6px;
        overflow: hidden;
        img {
          transition: 0.3s;
          width: 100%;
        }
      }
      p {
        font-size: 22px;
        color: #fff;
        margin-top: 30px;
        text-align: left;
      }
    }
  }
  .tab-bd {
    font-size: 0;
    text-align: left;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 146px;
      height: 56px;
      font-size: 16px;
      color: #fff;
      text-align: center;
      transform: translateY(17px);
      line-height: 36px;
      transition: 0.3s;
      cursor: pointer;
      &:last-child {
        margin-left: -30px;
      }
      &.active {
        position: relative;
        z-index: 2;
        transform: translateY(13px);
        line-height: 48px;
      }
    }
  }
  .tab-hd {
    height: 640px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    z-index: 3;
    .head {
      padding: 30px 0 0 146px;
      font-size: 18px;
      margin-bottom: 40px;
      color: #333;
      div {
        display: flex;
        align-items: center;
        h3 {
          font-weight: bold;
        }
      }
      img {
        width: 26px;
        margin-right: 4px;
      }
      p {
        font-size: 16px;
        color: #333;
        text-align: left;
        margin: 8px 0 0 30px;
      }
    }
  }
}
.steps {
  width: 1000px;
  margin: 0 auto;
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
    color: #666;
    font-size: 43px;
  }
  img {
    height: 100%;
  }
}
.usdt-platform-info {
  margin-top: 60px;
  display: flex;
    .platform-item {
      width: 586px;
      background: #022078;
      border-radius: 8px;
      padding: 45px 60px 53px;
      font-family: Lantinghei SC;
      color: #FFFFFF;
      &:first-child {
        margin-right: 30px;
      }
      .platform-title {
        font-size: 33px;
        font-weight: 600;
        line-height: 52px;
        img {
          vertical-align: middle;
          margin-top: -12px;
          margin-right: 25px;
        }
        .huobi-img {
          width: 40px;
          height: 60px;
        }
        .bian-img {
          height: 50px;
          width: 50px;
        }
      }
      .platform-desc {
        margin-top: 40px;
        font-size: 24px;
        font-weight: 200;
        line-height: 42px;
        text-align: left;
      }
      .platform-btn {
        margin-top: 36px;
        .btn-look {
          width: 250px;
          height: 60px;
          background: #06cd75;
          border-radius: 4px;
          font-size: 20px;
          color: #fff;
          &:hover {
            border: 0;
          }
        }
      }
    }
}
</style>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      mainbanner: '',
      detail: {},
      active: 0,
      pc: [
        '第一步：在首页点击进入存款页面',
        '第二步：在存款页面选择数字货币-USDT支付进行存款'
      ],
      h5: [
        '第一步：注册登录账号，可以在我的页面点击取款',
        '第二步：进入取款页面选择数字货币-USDT支付进行存款'
      ],
      pcActive: 0,
      h5Active: 0
    }
  },
  methods: {
    tab(i) {
      this.active = i
    },
    pcslide(i) {
      this.pcActive = i
    }
  }
})
</script>
