<template>
  <div>
    <div
      class="electronic-table"
      v-if="list.length"
    >
      <div
        v-for="(item, index) in list"
        :key="'item' + index"
        class="electronic-table-item"
        :style="{ width: itemWidth }"
        v-bind:class="{ 'gray-scal': item.status === 2 }"
      >
        <Card
          :nav-index="navIndex"
          :item="item"
          :id="item.id"
          :game_platform_id="item.game_platform_id"
          :img-url="item.pic"
          :title="item.name"
          :love="item.is_favorite ?? 2"
          :allplatform="allplatform"
          :isNew="item.is_new"
          :isHot="item.is_hot"
          @onLike="onLike"
          v-login
          @click="$playGame(item,'电子',index,allplatform[item.game_platform_id])"
          :isGray="item.status === 2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from '@vue/runtime-core';
import { useItemCalcWidth } from '@/utils/hooks';
import Card from './Card.vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [
      {
        id: '',
        imgUrl: '',
        title: '',
        love: '', // '0' | '1'
      },
    ],
  },
  allplatform: {
    type: Object,
    default: () => ({}),
  },
  navIndex: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(['onItemLike', 'onPlay']);
function onLike(id, like) {
  // console.log('onLike', id)
  emit('onItemLike', id, like);
}

function play(item) {
  // console.log('item', item);
  // this.$playGame(item);
  emit('onPlay', item);
}

const {
  itemWidth,
} = useItemCalcWidth(330, 17);

</script>

<style lang="scss" scoped>
.electronic-table {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  &-item {
    margin-left: 17px;
    margin-bottom: 41px;
    cursor: pointer;
  }
}
</style>
