<template>
  <div
    v-if="finalTime !== '0:00'"
  >{{ parseInt(finalTime / 60) }}:{{ parseInt(finalTime % 60) < 10 ? '0' + parseInt(finalTime % 60) : parseInt(finalTime % 60) }}</div>
  <div v-else>{{ finalTime }}</div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useInterval } from '@/utils/hooks';

const props = defineProps({
  time: {
    type: String,
    default: '',
  },
  now: {
    type: String,
    default: '',
  },
});
const finalTime = ref('');
const nowFullTime = new Date(props.now).getTime();
const endFullTime = new Date(props.time).getTime();

let t = (endFullTime - nowFullTime) / 1000;

const { run: runInterval, stop: stopInterval } = useInterval(() => {
  t -= 1;
  finalTime.value = t;
  if (t === 0) {
    stopInterval();
    finalTime.value = '0:00';
  }
}, 1000, { manual: true });

if (props.time && (endFullTime > nowFullTime)) {
  runInterval();
} else {
  finalTime.value = '0:00';
}
const date = new Date(finalTime.value);
function padTwo(t) {
  return Number(t) >= 10 ? t.toString().slice(0, 2) : `0${t}`;
}
function formatTime(time) {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const format = (t) => padTwo(Math.floor(t));
  const days = Math.floor(time / DAY);
  const hours = format((time % DAY) / HOUR);
  const minutes = format((time % HOUR) / MINUTE);
  const seconds = format((time % MINUTE) / SECOND);
  const millisecond = format(time % SECOND);
  return {
    days,
    hours,
    minutes,
    seconds,
    millisecond,
  };
}
</script>

<style lang='scss' scoped>
</style>
