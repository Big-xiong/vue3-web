<template>
  <div>
    <div class="suspension" v-if="!haslimit">
      <layout column align-center justify-center class="item every">
        <div v-show="time !== 'off'" class="info" @click="handleGo">
          <img class="pack-img" :src="$getSrc(`/src/assets/images/activity/${lang}/redpack.gif`)" />
          <template v-if="time > 0">
            <countdown class="tickTime" :time="time" :transform="transformSlotProps" @progress="handleCountdownProgress"
              @end="handleCountdownEnd">
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
            <p v-lang:vi|th|en="`font-size:14px;line-height: 15px;top:12px;left:7px;`">{{  time == 'on' ? $t('活动进行中') :
            $t('活动已结束')


              }}</p>
          </template>
        </div>
      </layout>
    </div>
  </div>
</template>
<script setup>
import {
  reactive, ref, onMounted, inject,
} from 'vue';
import { useRouter } from 'vue-router';
import { getRedRainInfo } from '@/api/activity';
import { dateFormat } from '@/utils';

const $store = inject('store');
const global = inject('global');
const subConfig = inject('subConfig');
const $router = useRouter();
const { user } = $store.state;
const { lang } = $store.state.app;
const time = ref('off');
const haslimit = ref(false);
const startTime = ref();
function handleCountdownProgress(data) {
  if (!data.totalSeconds) {
    time.value = 'on';
  }
}
function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'seconds') formattedProps[key] = value < 10 ? `0${value}` : String(value);
    else formattedProps[key] = value;
  });

  return formattedProps;
}
function handleCountdownEnd() {
  time.value = 'on';
}
function handleGo() {
  if (user?.isLogin) {
    if (time.value > 0) {
      global.$message.error(`${global.$t(`红包雨将在`)} ${dateFormat('YYYY-MM-DD HH:mm', startTime.value)} ${global.$t(`开启`)}`);
      return;
    }
    $router.push('/activity/redEnvelopeRain');
  } else if (subConfig.hasLoginPage) {
    global.$router.push('/login');
  } else {
    global.$dialog({ tpl: 'Login' });
  }
}
async function getBasicInfo() {
  let endTime = null;
  const currTime = (new Date()).getTime();
  let timeType = null;
  let actEndTime = null;
  let activityInfo = null;
  getRedRainInfo().then((data) => {
    if (!data || JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') return;
    haslimit.value = data?.username?.includes(user?.userInfo?.username) || (data?.agent_line && data?.agent_line.includes(user?.userInfo?.agent_name));

    activityInfo = data?.benefit_setting;
    timeType = data?.benefit_setting?.time_limit_type;
    if (timeType * 1 === 1) { // 固定时间
      startTime.value = (new Date((data.start_time).replace(/-/g, '/'))).getTime();
      endTime = (new Date((data.end_time).replace(/-/g, '/'))).getTime();
    } else if (timeType * 1 === 2) { // 每日固定时间
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      startTime.value = (new Date((`${year}-${month}-${date} ${activityInfo.fixed_time_setting?.start}`).replace(/-/g, '/'))).getTime();
      endTime = (new Date((`${year}-${month}-${date} ${activityInfo.fixed_time_setting?.start}`).replace(/-/g, '/'))).getTime() + activityInfo.fixed_time_setting?.time_duration * [60, 1][activityInfo.fixed_time_setting?.time_duration_type * 1 - 1] * 60 * 1000;
    } else if (timeType * 1 === 3) { // 间隔时间
      const firstTime = (new Date(`${activityInfo.interval_time_setting.start[0]}`)).getTime();
      const subTime = currTime - firstTime;
      const per = activityInfo.interval_time_setting.interval * [60, 1][activityInfo.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
      const count = Math.ceil(subTime / per) * 1;
      startTime.value = firstTime + (count - 1) * per;
      endTime = firstTime + (count - 1) * per + activityInfo.interval_time_setting.time_duration * [60, 1][activityInfo.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
      actEndTime = (new Date(`${activityInfo.interval_time_setting.start[1]}`)).getTime();
    }
    // debugger
    if (startTime.value - currTime > 0) {
      const subTime = startTime.value - currTime;
      if (subTime > activityInfo.remind * 60 * 1000) {
        time.value = 'off';
      } else {
        time.value = subTime;
      }
    } else if (currTime - startTime.value > 0 && currTime - endTime < 0) {
      time.value = 'on';
    } else if (currTime - endTime > 0) {
      time.value = 'off';
      if (currTime - actEndTime > 0) {
        return;
      }
      if (timeType * 1 === 3) { // 处理活动状态
        startTime.value += activityInfo.interval_time_setting.interval * [60, 1][activityInfo.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
        endTime = startTime.value + activityInfo.interval_time_setting.time_duration * [60, 1][activityInfo.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
        const subTime = startTime.value - currTime;
        if (activityInfo.remind) { // 设置提醒时间
          if (subTime > activityInfo.remind * 60 * 1000) {
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
onMounted(() => {
  getBasicInfo();
});
</script>

<style lang="scss" scoped>
.suspension {
  position: fixed;
  z-index: 4;
  right: 0;
  bottom: 60%;
  width: 100px;
  border-radius: 3px;

  .item {
    position: relative;
    width: 100px;
    height: 90px;
    font-size: 14px;
    color: #999;
    cursor: pointer;
    padding-top: 17px;
    padding-bottom: 17px;

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      content: "";
      width: 100%;
      height: 1px;
    }

    &.every::after {
      height: 0 !important;
    }

    &:nth-child(5)::after {
      height: 0 !important;
    }

    .el-icon-close {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 20px;
    }

    &.every {
      background: transparent !important;
      padding-top: 0;
      padding-bottom: 0;
      height: auto;

      img {
        margin-bottom: 10px;
      }

      .info {
        width: 100%;
        text-align: center;
        position: relative;

        p {
          color: #fff;
          line-height: 40px;
          font-size: 14px;
          font-weight: bold;
          position: absolute;
          top: 20px;
          left: 20px;
        }

        .tickTime {
          position: absolute;
          top: 36px;
          left: 50%;
          transform: translate(-50%, 0);
          font-size: 12px;
          color: #fff;
          font-weight: bold;
          width: 100%;
        }
      }

      .pack-img {
        width: 94px;
      }
    }
  }
}
</style>
