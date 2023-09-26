<template>
  <div id="usdt-detail" :style="{ backgroundImage: `url(${$getSrc('/src/assets/images/activity/usdt/bg1.png')})` }">
    <img src="/src/views/index/activity/usdt/img/title.png" alt="" />
    <el-button type="btn" class="btn-join" @click="$openKefu()">
      {{ $t('立即参与') }}
    </el-button>
    <img src="/src/views/index/activity/usdt/img/title2.png" class="tit02" alt="" />
    <p class="tips">
      {{
        $t(
          '任意金额，完成USDT虚拟币首存即可领取存款金额的40%额外红利，25倍流水提款。'
        )
      }}
    </p>
    <div class="table">
      <div class="head">
        <span>{{ $t('首次存款金额') }}</span>
        <span>{{ $t('红利百分比') }}</span>
        <span>{{ $t('红利上限') }}</span>
        <span>{{ $t('流水倍数') }}</span>
      </div>
      <div class="body">
        <span>≥100</span>
        <span>40%</span>
        <span>1888USDT</span>
        <span>{{ $t('（本金+红利）X25') }}</span>
      </div>
    </div>
    <p class="tips02">
      {{ $t('*计价单位：USDT。本活动会员可依据当前星级任选一档位参与') }}
    </p>
    <div class="bot" :style="{ backgroundImage: `url(${$getSrc('/src/assets/images/activity/usdt/bg2.png')})` }">
      <img src="/src/views/index/activity/usdt/img/title3.png" class="tit03" alt="" />
      <div class="bot-tips">
        <p>
          <img
            src="/src/views/index/activity/usdt/img/text-bg.png"
            class="tit03"
            alt=""
          /><span>{{
            $t('本活动每位玩家仅可参与一次，并且只有首次存款USDT可以申请礼金。')
          }}</span>
        </p>
        <p>
          <img
            src="/src/views/index/activity/usdt/img/text-bg.png"
            class="tit03"
            alt=""
          /><span>{{ $t('完成存款后联系客服领取红利。') }}</span>
        </p>
        <p>
          <img
            src="/src/views/index/activity/usdt/img/text-bg.png"
            class="tit03"
            alt=""
          /><span>{{
            $t(
              '此优惠仅限会员≥1级以上用户参与，如发现个人或团体合谋套利，网站有权扣除套利所得。'
            )
          }}</span>
        </p>
        <p>
          <img
            src="/src/views/index/activity/usdt/img/text-bg.png"
            class="tit03"
            alt=""
          /><span>{{
            $t(
              '本优惠每位玩家，每账户信息（姓名，手机），支付方式（卡号，银行户名）及IP地址只能享有一次优惠，一旦确认为套利玩家，立即没收盈利和本金。'
            )
          }}</span>
        </p>
        <p>
          <img
            src="/src/views/index/activity/usdt/img/text-bg.png"
            class="tit03"
            alt=""
          /><span>{{ $t('本活动最终解释权归本公司所有。') }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#usdt-detail {
  background-repeat: no-repeat;
  background-position: center top;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  button{
    border: none;
    outline: none;
  }
  .btn-join {
    width: 250px;
    height: 60px;
    background: #f3753e;
    border-radius: 10px;
    font-size: 26px;
    color: #fff;
    &:hover {
      border: none;
    }
  }
  .tit02 {
    margin-top: 592px;
  }
  .tips {
    font-size: 28px;
    color: #fff;
    margin: 50px 0 70px;
  }
  .table {
    width: 1200px;
    .head {
      height: 70px;
      background: linear-gradient(90deg, #e04943 0%, #0665fe 100%);
    }
    .body {
      height: 70px;
      background: #15249b;
    }
    .head,
    .body {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        flex: 1;
        border-right: 1px solid #0a0b6e;
        font-size: 22px;
        color: #fff;
        height: 70px;
        line-height: 70px;
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
  .tips02 {
    font-size: 20px;
    color: #358bd9;
    margin-top: 30px;
  }
  .bot {
    height: 497px;
    background-position: center top;
    width: 100%;
    background-repeat: no-repeat;
    margin-top: 128px;
    padding-top: 66px;
  }
  .bot-tips {
    width: 1200px;
    margin: 70px auto 0;
    counter-reset: count;
    p {
      display: flex;
      align-items: flex-start;
      font-size: 20px;
      color: #fff;
      line-height: 28px;
      justify-content: flex-start;
      text-align: left;
      margin-bottom: 15px;
      position: relative;

      &:before {
        content: counters(count, '') ' ';
        counter-increment: count;
        position: absolute;
        left: 7px;
        font-size: 20px;
      }
      span {
        flex: 1;
        margin-left: 9px;
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
    };
  },
  methods: {},
});
</script>
