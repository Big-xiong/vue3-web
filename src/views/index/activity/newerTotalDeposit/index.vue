<template>
  <div id="active-detail">
    <div id="xsc">
      <div class="bg1"></div>
      <div class="bg2"></div>
      <div class="bg3"></div>
      <div class="bg4"></div>
      <div class="wrap">
        <div class="slogan">
          <p>{{ $t('业界首创 取款无流水要求') }}</p>
        </div>
        <ul>
          <li class="nologin">
            <p class="nologin-need">
              <span>{{ detail?.gift }}</span
              >/18888
            </p>
            <p class="nologin-title">{{ $t('首存7天内存款成功的金额均计入首存金额') }}</p>
            <div class="nologin-bar">
              <i :style="{ width: per ? per : '46px' }"></i>
              <span v-if="!user.islogin">{{ $t('尚未登录') }}</span>
              <span v-if="user.islogin && !detail.gift">{{ $t('尚未存款') }}</span>
            </div>
            <div>
              <span>{{ $t('首存金额 ') }}{{ detail.deposit }}</span>
              <span class="right">{{ $t('有效投注 ') }}{{ detail.betSum }}</span>
            </div>
            <p class="tips">{{ $t('提示：存款≥100元立赠10%优惠金，存多送多，最高18888元') }}</p>
            <button v-if="detail.gift > 0" @click="getGift">{{ $t('立即领取') }}</button>
            <button v-else v-login @click="$router.push({ name: 'centerDeposit' })">{{ $t('立即存款') }}</button>
          </li>
        </ul>

        <div class="promo-tips">
          <p>{{ $t('7 天内累积存款 100 元及以上，且有效投注额满 10 倍流水，') }}</p>
          <p>{{ $t('立赠存款的 10%，存多送多，最高赠送 18888 元。') }}</p>
          <div>
            <span>{{ $t('7天累积存款') }}<br />{{ $t('满100元及以上') }}</span
            ><span>{{ $t('投注') }}<br />{{ $t('10倍流水') }}</span
            ><span>{{ $t('最高赠') }}<br />{{ $t('18888元') }}</span>
          </div>
          <p class="sample">{{ $t('举例：') }}</p>
          <ul class="sample-box">
            <li>・ 会员A首次存款800元，7天内投注满8000，即可领取80元优惠金；</li>
            <li>・ 会员B首次存款800元，继续存款800元，7天内累计投注满16000，则可领取160元优惠金；</li>
            <li>・ 会员C想要领取18888元，仅需7天内累积存款满188880元且有效投注额满1888800，即可领取；</li>
          </ul>
        </div>

        <div class="rules-tips">
          <p>{{ $t('1. 此活动仅限网站从未存款过的新会员参与；') }}</p>
          <p>{{ $t('2. 活动无需报名，首次存款成功后即可参与活动优惠；') }}</p>
          <p>{{ $t('3. 除VR厅、BBIN厅、AGIN多台百家乐及特惠游戏外的所有游戏均可参与活动优惠；') }}</p>
          <p>{{ $t('4. 首存成功的7天内，累计存款满100元及以上，且有效投注额满存款的10倍流水，即可申请活动优惠金，存款') }}</p>
          <p>{{ $t('越多赠送的优惠金越多，最高赠送18888元；') }}</p>
          <p>{{ $t('5. 首存成功的7天内，若会员未投注或未申请优惠，视为放弃此优惠；') }}</p>
          <p>{{ $t('6. 首存成功的7天内，一旦提款成功，不再累计首存优惠和有效投注额，提款成功之前获得的优惠金仍可申请；') }}</p>
          <p>{{ $t('7. 优惠金申请审核通过后，金额自动到账，无需流水可立即取款；') }}</p>
          <p>{{ $t('8. 此优惠会员首存7天内仅可申请一次；') }}</p>
          <p>{{ $t('9. 7天指非自然周，从首存金额成功到账后开始倒计时，如:会员首存成功时间为周六12:59:59，则到期日为次') }}</p>
          <p>{{ $t(' 周六 12:59:59；') }}</p>
          <p>{{ $t('10. 此优惠与洗码优惠可共享；') }}</p>
          <p>{{ $t('11. 同一IP，同一台设备、同一联系方式、同一银行卡只能有一个账户参与活动。如有违规套利者将取消获奖资') }}</p>
          <p>{{ $t(' 格，严重舞弊者尊博有权在不事先通知的情况下作封号处理或扣除相关获利。') }}</p>
          <p>{{ $t('12. 该活动的有效时间以官网通知为准，尊博保留最终解释权。') }}</p>
          <div>{{ $t('注: 新会员参与本次活动，即视为同意本活动条款。') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { newerTotalDeposit, newerRegSent } from '@/api/activity';

const $store = inject('store');
const { user } = $store.state;
const $route = useRoute();

const detail = ref({});
const per = ref(0);

const getDetail = () => {
  newerTotalDeposit({
    id: $route.query.id || '',
  }).then((res) => {
    console.log(res.sent);
    detail.value = res.sent;
    per.value = (res.sent.gift / 18888) * 100 + '%';
  });
};

const getGift = () => {
  newerRegSent({ id: $route.query.id || '' }).then((res) => {
    console.log(res);
    getDetail();
  });
};

onMounted(() => {
  getDetail();
});
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#xsc {
  background: #151413;

  .bg1 {
    height: 482px;
    background-image: url('./img/firstDeposit01.jpg');
    background-size: 100% 100%;
  }

  .bg2 {
    height: 510px;
    background-image: url('./img/firstDeposit02.jpg');
    background-size: 100% 100%;
  }

  .bg3 {
    height: 614px;
    background-image: url('./img/firstDeposit03.jpg');
    background-size: 100% 100%;
  }

  .bg4 {
    height: 600px;
    background-image: url('./img/firstDeposit04.jpg');
    background-size: 100% 100%;
  }

  .wrap {
    width: 1200px;
    position: absolute;
    top: 86px;
    left: 50%;
    margin-left: -600px;

    .slogan {
      width: 736px;
      height: 422px;
      margin: 40px 0 0 240px;
      padding-top: 260px;
      background: no-repeat -8px 0/736px auto;
      background-image: url('./img/youhui_fuli@2x.png');

      p:first-of-type {
        font-size: 25px;
        color: #e9e9e9;
        text-align: center;
        letter-spacing: 0.65em;
      }
    }

    ul {
      li {
        width: 894px;
        margin: auto;
        position: relative;

        .tips {
          font-size: 20px;
          color: #ee5027;
          text-align: center;
          margin-bottom: 30px;
        }

        .go-promo {
          width: 228px;
          height: 50px;
          display: inline-block;
          border: 1px solid #bd9767;
          border-radius: 30px;
          text-align: center;
          line-height: 50px;
          color: #c1a565;
          font-size: 24px;
          position: absolute;
          top: 305px;
          left: 50%;
          margin-left: -114px;

          &:hover {
            color: #e2c48d;
            border-color: #e2c48d;
          }
        }

        &.nologin {
          width: 704px;
          height: 464px;
          padding: 0 90px 0 100px;
          box-sizing: content-box;
          background-image: url('./img/pop-nologin.png');
          background-size: 100% auto;
          position: relative;

          .nologin-need {
            position: absolute;
            font-size: 26px;
            color: #5d5747;
            top: 101px;
            right: 77px;

            span {
              color: #e2c48d;
            }
          }

          .nologin-bar {
            position: absolute;
            top: 140px;
            left: 84px;
            width: 733px;
            height: 46px;
            background: #5d5747;
            border-radius: 15px 25px 25px 15px;
            padding: 0;
            text-align: center;

            i {
              position: absolute;
              width: 26px;
              height: 46px;
              background: linear-gradient(270deg, #f8cd81 0%, #8b703d 100%);
              border-radius: 11px;
              top: 0;
              left: 0;
            }

            span {
              text-align: center;
              color: #1e1e1e;
              font-size: 24px;
              line-height: 46px;
              font-weight: bold;
            }
          }

          .nologin-title {
            height: 48px;
            line-height: 48px;
            font-size: 22px;
            color: #ecd08e;
            text-align: center;
          }

          div {
            padding: 155px 12px 0 10px;
            margin-bottom: 75px;
            text-align: left;

            span {
              color: #9d8b68;
              font-size: 18px;

              &.right {
                float: right;
              }
            }
          }

          button {
            display: inline-block;
            text-align: center;
            line-height: 46px;
            color: #d99576;
            font-size: 16px;
            font-weight: bold;
            width: 160px;
            height: 50px;
            border-radius: 4px;
            border: 2px solid #d99576;

            &:hover {
              color: #e2c48d;
              border-color: #e2c48d;
            }
          }
        }

        &.no-save {
          height: 464px;

          .nologin-title {
            padding-top: 8px;
            height: 48px;
            line-height: 48px;
            font-size: 22px;
            color: #ecd08e;
            text-align: center;
          }

          div {
            padding: 155px 108px 0 108px;
            margin-bottom: 75px;

            span {
              color: #9d8b68;
              font-size: 18px;

              &.right {
                float: right;
              }
            }
          }

          a {
            width: 228px;
            height: 50px;
            display: inline-block;
            border: 1px solid #bd9767;
            border-radius: 30px;
            text-align: center;
            line-height: 50px;
            color: #c1a565;
            font-size: 24px;
            background: #191919;
            margin-left: 333px;

            &:hover {
              color: #e2c48d;
              border-color: #e2c48d;
            }
          }
        }

        &.commonbg {
          width: 704px;
          height: 464px;
          padding: 0 90px 0 100px;

          .time-box {
            font-size: 23px;
            color: #ecd08e;
            text-align: center;
            line-height: 45px;

            span {
              font-size: 26px;
              color: #d75e4f;
            }
          }

          .title-box {
            text-align: right;
            font-size: 26px;
            color: #ecd08e;
            margin: 40px 0 10px;

            span {
              color: #6f5d3c;
              font-size: 26px;
            }
          }

          .process-box {
            width: 714px;
            height: 40px;
            background: #474545;
            border-radius: 20px;
            position: relative;

            .process-promo {
              min-width: 105px;
              height: 40px;
              border-radius: 20px;
              background: #958d7e;
              line-height: 40px;
              text-align: center;

              .lock {
                width: 16px;
                height: 40px;
                display: inline-block;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAoCAYAAAD32nqhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUUwRDI5NzFBRDFFMTFFOTlDRDVFMzRFQjZCRjA4NjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUUwRDI5NzJBRDFFMTFFOTlDRDVFMzRFQjZCRjA4NjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RTBEMjk2RkFEMUUxMUU5OUNENUUzNEVCNkJGMDg2NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RTBEMjk3MEFEMUUxMUU5OUNENUUzNEVCNkJGMDg2NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmNA+nMAAAIFSURBVHja7FXLSiNBFE09uhOjGBwVzShGYUZUhoALHztduHThD8zCpaC48xvcKIy4cT1f4A8II7h1EWEG1CA+QERmFsFH0tXdZVXnXrlpfAVn4SIXDkVX7jl16z4qTGudeI/xxDutIfARBOTm6krarAIgAVaYET/bLAHAJ2soCdkB4B6NLiQkKuxLQnYBKMIAGmDJKh4ZhozklJNsaun9MrrgJNOzjLFO0+rXqnK3fX60v+V75VtyJY0CGHrSEFK5oYkNIWS+fFf6Wbm/OTJ6X1Pp1u/9wxMjxcLuoq4OT40AirjZgfyMkM7kv6vT5euLwz8QbqGzd/D3p67cj+7+b1OXJwc7NJGcJjDZ1DwWhsGZIR/biBD22+6baMZJxFHVJEmayxjPhEFQAiInSQzIvgvJVFiFxzzohOasSnLhBEZ6gIFoTblry6i1cbCITooJaGZ+FyBeoQIRWtuzOS6cz5zzTHduZFpXnSMz1Qk4F20J6fQZv77S38vDeATSkNZsDiwh09Ez/+TgCJk1futGYA47mMO9OJJfM/BDHvsY70EIqMeQE5UMx7Qew1YOOBnTekyhCIcPz1fe3puOrvp5tJVtV/Fi4dcS6XX5RCv7QLT+ZViVhE1MjCJ9TocpJFdVQPaoAHXyXngTAyKiUEDFBMQzr3IYe5mjJLLG33tD4H8IPAgwALNt0lpGdkwLAAAAAElFTkSuQmCC)
                  no-repeat 50%;
              }

              span {
                font-size: 22px;
                color: #000;
                vertical-align: top;
              }
            }

            .process-promo-cny {
              margin-top: 5px;
              text-align: center;
              font-size: 20px;
              color: #edc383;
            }

            .process-amount {
              width: 21px;
              height: 40px;
              border-radius: 20px;
              background: -webkit-gradient(linear, left top, right top, from(#eab663), to(#fff2d2));
              background: linear-gradient(-270deg, #eab663, #fff2d2);
              position: absolute;
              top: 0;
              left: 0;
              line-height: 40px;
              text-align: center;
              font-size: 22px;
              color: #000;
            }

            .process-amount-cny {
              margin-top: 5px;
              text-align: center;
              font-size: 20px;
              color: #edc383;
            }
          }

          .promo-amount {
            font-size: 18px;
            color: #e2c48d;
            margin: 35px 0 65px;
            text-indent: 1em;

            .right {
              float: right;
              font-size: 18px;
              color: #9d8b68;
            }

            .amount {
              font-size: 22px;
              color: #edc383;
            }
          }

          p {
            font-size: 16px;
            color: #d75e4f;
            text-align: center;

            &.grap {
              width: 100%;
              height: 21px;
            }
          }

          .btn-box {
            margin-top: 30px;

            a {
              width: 228px;
              height: 50px;
              display: inline-block;
              border: 1px solid #bd9767;
              border-radius: 30px;
              text-align: center;
              line-height: 50px;
              color: #c1a565;
              font-size: 24px;

              &:nth-of-type(2) {
                margin: 0 9px;
              }

              &.active {
                background: -webkit-gradient(linear, left top, right top, from(#eab663), to(#fff2d2));
                background: linear-gradient(-270deg, #eab663, #fff2d2);
                color: #000;
              }

              &.gray {
                background: -webkit-gradient(linear, left top, right top, from(#514f4f), to(#626161));
                background: linear-gradient(-270deg, #514f4f, #626161);
                color: #757474;
                border: none;
              }

              &.btn:hover {
                color: #e2c48d;
                border-color: #e2c48d;
              }
            }
          }
        }
      }
    }

    .promo-tips {
      width: 929px;
      height: 473px;
      margin: 30px 0 0 135.5px;
      background-image: url('./img/promo-bg.png');
      padding-top: 80px;
      box-sizing: content-box;

      p {
        font-size: 20px;
        color: #9d8b68;
        text-align: center;

        &:first-of-type,
        &:nth-of-type(2) {
          line-height: 35px;
        }
      }

      div {
        margin: 180px 0 0 180px;
        text-align: left;

        span {
          display: inline-block;
          width: 120px;
          height: 50px;
          text-align: center;
          font-size: 16px;
          line-height: 24px;
          color: #e9e9e9;

          &:first-of-type {
            width: 130px;
          }

          &:nth-of-type(2) {
            margin: 0 103px;
          }
        }
      }

      .sample {
        font-size: 20px;
        color: #9d8b68;
        text-align: left;
        line-height: 30px;
        text-indent: 3em;
        margin-top: 35px;
      }

      .sample-box li {
        font-size: 16px;
        color: #9d8b68;
        line-height: 30px;
        text-indent: 2.2em;
        text-align: left;
      }
    }

    .rules-tips {
      width: 892px;
      height: 553px;
      margin: 30px 0 0 154px;
      padding: 51px 50px 0;
      text-align: left;
      background-image: url('./img/rules-bg.png');

      div,
      p {
        font-size: 16px;
        color: #9d8b68;
        line-height: 30px;
      }

      div {
        margin-top: 12px;
      }
    }
  }
}
</style>
