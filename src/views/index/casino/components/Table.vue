<template>
  <div
    class="real-table"
    v-if="list?.length"
  >
    <div
      v-for="(item, index) in list"
      :key="'item' + index"
      class="real-table-item"
      :style="{ width: $attrs.width }"
      v-bind:class="{ 'gray-scal': $getGameStatus(item, '真人') }"
    >
      <Card
        :nav-index="navIndex"
        :item="item"
        :id="item.id"
        :img-url="item.pic"
        :title="item.name"
        :describe="item.desc"
        :love="item.is_favorite ?? 2"
        :plat="plat"
        @onLike="onLike"
        v-bind:isGray="$getGameStatus(item, '真人')"
      />
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue';

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  plat: {
    type: Array,
    default: () => [],
  },
  navIndex: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(['onItemLike']);

function onLike(id, like) {
  emit('onItemLike', id, like);
}
</script>

<style lang="scss" scoped>
.real-table {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  &-item {
    margin-left: 23px;
    margin-bottom: 41px;
  }
}
</style>
