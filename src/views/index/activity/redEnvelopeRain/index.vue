<template>
  <div class="event-page"
    :style="{ 'background': `#ffa07b url(${$getSrc(`/src/assets/images/activity/${lang}/bg.png`)})no-repeat center top` }">
    <div class="section section1">
      <div class="wrap-inner">
        <div v-if="!user?.isLogin" class="login-button pointer" @click="login">
          <img :src="$getSrc(`/src/assets/images/activity/${lang}/button@2x.png`)" alt />
        </div>
        <div class="count">
          <template v-if="time > 0">
            <countdown :time="time" :transform="transformSlotProps" @end="handleCountdownEnd"
              @progress="handleCountdownProgress">
              <template v-slot="props">
                <span v-if="props.days">
                  {{  props.days  }}
                  <small>{{  $t('天')  }}</small>
                </span>
                <span v-if="props.hours">
                  {{  props.hours  }}
                  <small>{{  $t('时')  }}</small>
                </span>
                <span v-if="props.minutes">
                  {{  props.minutes  }}
                  <small>{{  $t('分')  }}</small>
                </span>
                <span>
                  {{  props.seconds  }}
                  <small>{{  $t('秒')  }}</small>
                </span>
              </template>
            </countdown>
          </template>
          <template v-else>
            <p v-lang:vi|th|en="`font-size:28px;margin-top:78px`">{{  time == 'on' ? $t('活动进行中') : $t('活动已结束')  }}</p>
          </template>
        </div>
      </div>
    </div>
    <div class="section section2">
      <div class="wrap-inner">
        <h2 class="win-list-title"
          :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/activity/${lang}/list-title@2x.png`)})` }">{{
           $t('中奖榜单')  }}</h2>
        <el-row class="win-list"
          :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/activity/${lang}/list-bg@2x.png`)})` }">
          <el-col :span="8" class="list" v-for="item in 3" :key="item">
            <dl>
              <dt>{{  $t('中奖账号')  }}</dt>
              <dd>{{  $t('中奖金额')  }}</dd>
            </dl>
          </el-col>
          <el-row class="content">
            <el-col :span="8" v-for="item in 3" :key="item" class="list">
              <Marquee :send-val="winlist[item - 1]" class="my-marquee" />
            </el-col>
          </el-row>
        </el-row>
      </div>
    </div>
    <div class="section section3">
      <div class="wrap-inner">
        <h2 class="flow-title"
          :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/activity/${lang}/flow-title@2x.png`)})` }">{{
           $t('活动流程')  }}</h2>
        <el-row class="flows">
          <el-col :span="8" v-for="(item, index) in flows" :key="index" class="step" :class="`step${index + 1}`">
            <h3 v-lang:vi|th|en="`font-size:22px;max-width: 200px;`">{{  $t('第')  }}{{  index === 0 ? $t('一') : index === 1
            ? $t('二') : $t('三')

              }}{{  $t('步')  }}</h3>
            <label>0{{  index + 1  }}</label>
            <ul>
              <li v-lang:vi|th|en="`font-size:14px;line-height: 18px;`">{{  item  }}</li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 点击领取红包效果 -->
    <RedpacketRain v-show="time === 'on'" :time="time" :activity-info="activityInfo" @changeTime="changeTime" />
  </div>
</template>

<script setup>
import {
  reactive, ref, inject, onMounted,
} from 'vue';
import {
  getRedRainInfo,
  getRedRainWinList,
} from '@/api/activity';
import RedpacketRain from './RedpacketRain.vue';
import Marquee from '@/components/Marquee.vue';

const global = inject('global');
const { user } = global.$store.state;
const { lang } = global.$store.state.app;
const activityInfo = ref({});
const flows = ref([
  global.$t('活动开始前会提前倒计时，倒计时结束后开启红包雨'),
  global.$t('每次选中到红包出现金额，将代表中奖'),
  global.$t('活动结束后将自动到账主钱包，无需手动再次领取'),
]);
const option = reactive({
  // 滚动一个条目高度的过渡时间
  moveTime: 1000,
  // 每滚动一个条目，是否需要停顿；如果为false，restTime属性将无效；
  needRestTime: false,
  // 每滚动一个条目后的停顿时间(尽量大于100，否则效果不好)，默认2000，needRestTime为true时，才有效；
  restTime: 1000,
  // 当鼠标移入和移出时，是否需要暂停和继续滚动；
  needHover: true,
  // 当滚动列表数据更新时，等待该延迟时间后，再进行滚动；
  delayTime: 3000,
  // 速度曲线【可选值： linear、ease、ease-in、ease-out、ease-in-out、cubic-bezier(n,n,n,n)】；当needRestTime为true时，才有效；
  timingFunc: 'linear',
});
const winlist = ref([]);
const time = ref('off');
onMounted(() => {
  Promise.all([
    getBasicInfo(),
    getWinlist(1),
    getWinlist(2),
    getWinlist(3),
  ]);
});
function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'seconds') formattedProps[key] = value < 10 ? `0${value}` : String(value);
    else formattedProps[key] = value;
  });

  return formattedProps;
}
function handleCountdownProgress(data) {
  if (!data.totalSeconds) {
    time.value = 'on';
  }
}
function handleCountdownEnd() {
  time.value = 'on';
}
function getBasicInfo() {
  let startTime = null;
  let endTime = null;
  const currTime = (new Date()).getTime();
  let timeType = null;
  let actEndTime = null;
  getRedRainInfo().then((data) => {
    if (!data || JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') return;
    activityInfo.value = data.benefit_setting;
    timeType = data.benefit_setting.time_limit_type;
    if (timeType * 1 === 1) { // 固定时间
      startTime = (new Date((data.start_time).replace(/-/g, '/'))).getTime();
      endTime = (new Date((data.end_time).replace(/-/g, '/'))).getTime();
    } else if (timeType * 1 === 2) { // 每日固定时间
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      startTime = (new Date((`${year}-${month}-${date} ${activityInfo.value.fixed_time_setting?.start}`).replace(/-/g, '/'))).getTime();
      endTime = (new Date((`${year}-${month}-${date} ${activityInfo.value.fixed_time_setting?.start}`).replace(/-/g, '/'))).getTime() + activityInfo.value.fixed_time_setting?.time_duration * [60, 1][activityInfo.value.fixed_time_setting?.time_duration_type * 1 - 1] * 60 * 1000;
    } else if (timeType * 1 === 3) { // 间隔时间
      const firstTime = (new Date(`${activityInfo.value.interval_time_setting.start[0]}`)).getTime();
      const subTime = currTime - firstTime;
      const per = activityInfo.value.interval_time_setting.interval * [60, 1][activityInfo.value.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
      const count = Math.ceil(subTime / per) * 1;
      startTime = firstTime + (count - 1) * per;
      endTime = firstTime + (count - 1) * per + activityInfo.value.interval_time_setting.time_duration * [60, 1][activityInfo.value.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
      actEndTime = (new Date(`${activityInfo.value.interval_time_setting.start[1]}`)).getTime();
    }
    // debugger
    if (startTime - currTime > 0) {
      const subTime = startTime - currTime;
      if (subTime > activityInfo.value.remind * 60 * 1000) {
        time.value = 'off';
      } else {
        time.value = subTime;
      }
    } else if (currTime - startTime > 0 && currTime - endTime < 0) {
      time.value = 'on';
    } else if (currTime - endTime > 0) {
      time.value = 'off';
      if (currTime - actEndTime > 0) {
        return;
      }
      if (timeType * 1 === 3) { // 处理活动状态
        startTime += activityInfo.value.interval_time_setting.interval * [60, 1][activityInfo.value.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
        endTime = startTime + activityInfo.value.interval_time_setting.time_duration * [60, 1][activityInfo.value.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
        const subTime = startTime - currTime;
        if (activityInfo.value.remind) { // 设置提醒时间
          if (subTime > activityInfo.value.remind * 60 * 1000) {
            time.value = 'off';
          } else {
            time.value = subTime;
          }
        } else {
          time.value = subTime;
        }
      }
    }
  });
}
function getWinlist(val) {
  getRedRainWinList({ page: val }).then((res) => {
    winlist.value.push(res.list);
  });
}
function changeTime() {
  time.value = 'off';
}
function login() {
  global.$dialog({ tpl: 'Login' });
}
</script>

<style lang="scss" scoped>
.event-page {
  // margin-top: $header-height;
  color: #300;
  height: 1940px;
  // background: #ffa07b url(./assets/bg.jpg) no-repeat center top;

  .section {
    width: 100%;
    position: relative;
    text-align: left;

    >.wrap-inner {
      position: absolute;
      width: 1000px;
      top: 0;
      left: 50%;
      margin-left: -500px;
      text-align: center;

      >h2 {
        height: 36px;
        margin-bottom: 20px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
        text-indent: -9999em;

        &.win-list-title {
          // background-image: url(./assets/list-title@2x.png);
        }

        &.flow-title {
          //  background-image: url(./assets/flow-title@2x.png);
        }
      }
    }
  }

  .section1 {
    height: 860px;

    .login-button {
      position: absolute;
      top: 590px;
      left: 50%;
      transform: translateX(-50%);

      img {
        height: 135px;
      }
    }

    .count {
      position: absolute;
      top: 357px;
      left: 50%;
      transform: translateX(-50%);
      color: #fdfbe3;
      font-size: 60px;
      font-weight: 600;
      font-family: arial;

      small {
        font-weight: 400;
        font-size: 30px;
      }
    }
  }

  .section2 {
    height: 650px;

    .win-list {
      height: 525px;
      padding: 130px 60px 100px 60px;
      // background: url(./assets/list-bg@2x.png) center center no-repeat;
      background-size: contain;
      font-size: 18px;

      .content {
        width: 100%;
        top: -7%;
        height: 92%;

        >.list {
          width: 33%;
          // padding: 0 30px;
          border-left: 1px solid #c48b48;
          max-height: 240px;
          overflow: hidden;

          .vue-list-marquee-list {
            height: 280px;
            overflow: hidden;
          }

          &:first-child {
            padding-left: 0;
            border-left: none;
          }

          &:last-child {
            padding-right: 0;
          }
        }
      }

      .title {
        flex: none;

        >.list {
          width: 33%;
          padding: 0 30px;

          &:first-child {
            padding-left: 0;
            border-left: none;
          }

          &:last-child {
            padding-right: 0;
          }
        }
      }

      dl {
        display: flex;

        dt,
        dd {
          width: 50%;
          line-height: 40px;
        }
      }
    }
  }

  .section3 {
    .flows {
      .step {
        width: 326px;
        height: 260px;
        background: url('@/assets/images/activity/en/step-bg@2x.png') left center no-repeat;
        background-size: contain;
        text-align: left;
        padding: 30px 40px;
        position: relative;

        h3 {
          font-size: 30px;
          font-weight: 500;
          margin-bottom: 20px;
        }

        label {
          width: 70px;
          position: absolute;
          top: 47px;
          right: 25px;
          color: #ffe4bd;
          font-size: 40px;
          text-align: center;
          //font-family: $digitFontFamily;
        }

        li {
          line-height: 30px;
          font-size: 18px;
          list-style: disc;
        }
      }
    }
  }
}
</style>
