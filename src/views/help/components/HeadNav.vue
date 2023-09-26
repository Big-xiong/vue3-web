<template>
  <div class="head-nav-wrap">
    <ul>
      <li v-for="(nav, index) in navList" :key="index" :class="{ 'active': selectedIndex === index }"
        :title="nav.title || nav.game_cate_name" @click="onSelect(index)">{{ nav.title || nav.game_cate_name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  navList: Array,
  selectedIndex: Number,
});

const emit = defineEmits(['select']);

function onSelect(index) {
  emit('select', index);
}
</script>

<style lang="scss" scoped>
.head-nav-wrap {
  ul {
    background: var(--font-color-191919);
    color: var(--font-color-fff);
    display: flex;
    width: 100%;

    li {
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: var(--font-color-999);
      padding: 0 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;

      &.active {
        background: var(--bg-color-282828);
        color: var(--font-color-fff);
      }
    }
  }
}
</style>
