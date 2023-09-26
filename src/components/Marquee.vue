<template>
  <div class="my-outbox" ref="outbox">
    <div class="my-inbox" ref="movebox">
      <div class="my-listbox" v-for="(item, index) in sendVal" :key="index">
        <div class="my-title">
          {{ item.username }}
          <text class="my-utel" v-money="item.money"></text>
        </div>
      </div>
      <div class="my-listbox" v-for="(item, index) in sendVal" :key="(index + 1) * 100" v-if="isShow">
        <div class="my-title">
          {{ item.username }}
          <text class="my-utel" v-money="item.money"></text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  watch, inject, ref, onMounted,
} from 'vue';

const props = defineProps({
  sendVal: {
    type: Array,
    default: () => [],
  },
});
const isShow = ref(true);
const movebox = ref();
const outbox = ref();
const initTop = ref(0);
watch(() => props.sendVal, (val) => {
  if (val.length) {
    requestAnimationFrame(animateFn);
  }
}, { immediate: true });
onMounted(() => {
  // requestAnimationFrame(animateFn);
});
function animateFn() {
  initTop.value++;
  const moveTarget = movebox.value;
  const outboxs = outbox.value;
  if (outboxs.offsetHeight > (moveTarget.offsetHeight / 2)) {
    isShow.value = false;
    return;
  }
  if (initTop.value >= moveTarget.offsetHeight / 2) {
    initTop.value = 0;
  }
  moveTarget.style = `transform: translateY(-${initTop.value}px)`;
  requestAnimationFrame(animateFn);
}
</script>

<style lang="scss" scoped>
.my-outbox {
  height: 240px;
  width: 250px;
  margin: 20px;
  overflow: hidden;

  .my-inbox {
    margin: 0 0px;

    .my-listbox {
      padding: 0;
      font-size: 18px;

      .my-title {
        width: 235px;
        margin-bottom: 5px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .my-utel {
          font-size: 16px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
