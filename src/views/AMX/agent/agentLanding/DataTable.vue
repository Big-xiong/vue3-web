<template>
  <div class="agent-data-list">
    <div class="data-content">
      <div class="title">
        <div class="top">
          <span />{{$t('详细数据分析报表')}}<span />
        </div>
        <div class="down">
          {{$t('盈利数据、大数据报表等给合伙人精确分析盈利数据')}}
        </div>
      </div>
      <div class="table-content">
        <div class="left">
          <div class="list">
            <p class="name"> {{$t('会员统计')}} </p>
            <p class="subtitle"> {{$t('注册会员和有效会员随时查看')}} </p>
            <UserStat />
          </div>
          <div class="list">
            <p class="name"> {{$t('会员盈利数据')}} </p>
            <p class="subtitle"> {{$t('会员盈利情况一目了然')}} </p>
            <UserProfit />
          </div>
          <div class="list">
            <p class="name"> {{$t('会员报表')}} </p>
            <p class="subtitle"> {{$t('会员动态一清二楚')}} </p>
            <UserReport />
          </div>
          <div class="list">
            <p class="name">{{$t('代理提现便捷')}}</p>
            <p class="subtitle">{{$t('代理每月提现方便快捷')}}</p>
            <img
              class="agent-icon"
              :src="$getSrc('/src/current_project/assets/images/agentLanding/dltx.png')"
              alt="')"
            >
          </div>
        </div>
        <div class="right">
          <img
            :src="$getSrc('/src/current_project/assets/images/agentLanding/device.png')"
            alt="')"
          >
          <p class="dl-mobile">{{$t('代理移动端')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserStat from './components/UserStat.vue';
import UserProfit from './components/UserProfit.vue';
import UserReport from './components/UserReport.vue';
</script>

<style scoped lang="scss">
.agent-data-list {
  width: 100%;

  .data-content {
    width: 1200px;
    margin: 0 auto;

    .title {
      height: 175px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .top {
        font-size: 32px;
        margin-top: 60px;
        margin-bottom: 15px;
        color: var(--theme-color);

        // span {
        //   width: 80px;
        //   height: 6px;
        //   background: #2f2f2f;
        //   border-radius: 2px;
        //   display: inline-block;
        //   position: relative;
        //   top: -8px;
        //   margin: 0 10px;
        // }
      }

      .down {
        font-size: 18px;
        color: var(--font-color-fff-6);
      }
    }
  }

  .table-content {
    width: 1200px;
    height: 610px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      flex-wrap: wrap;
      width: 810px;
      height: 100%;
      margin-right: 10px;

      .list {
        width: 400px;
        height: 300px;
        display: inline-block;
        background: var(--bg-color-282828);
        margin-right: 10px;
        margin-bottom: 10px;

        .name {
          font-size: 18px;
          color: var(--font-color-000);
          text-align: center;
          margin: 30px 0 15px;
        }

        .subtitle {
          font-size: 14px;
          text-align: center;
          color: var(--font-color-fff-6);
        }

        .chart {
          text-align: center;
        }
      }

      & > .list:nth-child(2),
      & > .list:nth-child(4) {
        margin-right: 0;
      }
    }

    .right {
      width: 380px;
      height: 100%;
      background: var(--bg-color-282828);
      border-radius: 4px;
      text-align: center;

      img {
        width: 282px;
        margin-top: 33px;
      }

      .dl-mobile {
        font-size: 18px;
        color: var(--font-color-000);
        margin: 0;
      }
    }
  }
}

.agent-icon {
  width: 126px;
  display: block;
  margin: 49px auto 0;
}
</style>
