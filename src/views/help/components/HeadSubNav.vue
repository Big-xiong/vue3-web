<template>
  <div class="head-sub-wrap">
    <div class="left" @click="goLeft">
      <i class="el-icon-arrow-left" v-show="scrollIndex > 0" />
    </div>
    <div class="scroll-container">
      <ul :style="{ 'left': - (155 * scrollIndex) + 'px' }">
        <li v-for="(item, index) in navList" :key="index" :class="{ 'active': selectedIndex === index }"
          @click="onSelect(index)">{{ item.title }}</li>
      </ul>
    </div>
    <div class="right" @click="goRight">
      <i class="el-icon-arrow-right" v-show="scrollIndex < navList.length - 6" />
    </div>
  </div>
</template>

<script setup>
import {
  ref, watch,
} from 'vue';

const props = defineProps({
  selectedIndex: Number,
  navList: Array,
});

const scrollIndex = ref(0);

const emit = defineEmits(['select']);

function onSelect(index) {
  emit('select', index);
}

watch(() => props.navList, () => {
  scrollIndex.value = 0;
});

function goLeft() {
  if (scrollIndex.value > 0) {
    scrollIndex.value -= 1;
  }
}

function goRight() {
  if (scrollIndex.value < props.navList.length - 6) {
    scrollIndex.value += 1;
  }
}
</script>

<style lang="scss" scoped>
.head-sub-wrap {
  display: flex;
  width: 995px;
  background-color: var(--bg-color-282828);
  box-sizing: border-box;
  padding-top: 40px;
  align-items: center;
  justify-content: space-between;

  .left,
  .right {
    cursor: pointer;
    width: 26px;
    height: 37px;
    line-height: 37px;
    top: 46px;
    text-align: center;
    border-radius: 4px;
  }
}

.scroll-container {
  height: 47px;
  width: 915px;
  overflow: hidden;
  position: relative;

  ul {
    width: 2000%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.5s;

    li {
      line-height: 45px;
      min-width: 140px;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid var(--border-color-000);
      color: var(--border-color-000);
      margin-right: 15px;
      float: left;
      cursor: pointer;
      padding: 0 10px;

      &.active {
        background: var(--theme-color);
        color: var(--font-color-fff);
        border-color: var(--theme-color);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
