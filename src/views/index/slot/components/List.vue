<template>
  <div class="electronic-list" v-if="list.length">
    <div v-for="item in list" :key="item.title" class="layout-flex-center electronic-list-item"
      v-bind:class="{ 'gray-scal': $getGameStatus(item, '电子') }">
      <el-tag size="small" class="electronic-list-item-pt">{{ allplatform[item.game_platform_id] ?? '' }}</el-tag>
      <div>
        <p class="electronic-list-item-title" @click="$playGame(item)">
          {{ item.name }}
          <template v-if="$getGameStatus(item, '电子')">
            ({{ $t('维护中') }})
          </template>
        </p>
        <p>
          <span class="electronic-list-item-tag" v-if="item.is_new === 1">NEW</span>
          <span class="electronic-list-item-tag" v-else-if="item.is_hot === 1">HOT</span>
          <span class="electronic-list-item-tag2">{{ allplatform[item.game_platform_id] ?? '' }}{{ $t('老虎机') }}</span>
        </p>
      </div>
      <img class="electronic-card-box-love" v-login @click.stop="() => handleClick(item)"
        :src="$getSrc(`/src/assets/images/Collection-${(item.is_favorite === 1 || navIndex === 5) ? 1 : 2}.webp`)" alt="">
      <!-- <el-button
        type="text"
        :class="`electronic-card-box-love ${item.is_favorite === 1 || navIndex === 5 ? 'electronic-card-box-loved' : ''}`"
        v-login
        @click.stop="()=>handleClick(item)"
      /> -->
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');

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
// 获取 emit
const emit = defineEmits(['onItemLike']);
function handleClick(item) {
  const is_favorite = item.is_favorite === 1 ? 2 : 1;
  emit('onItemLike', item.id, is_favorite);
}

</script>

<style lang="scss" scoped>
.electronic-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
  margin-top: -23px;

  .el-tag {
    line-height: 24px;
    border: 0;
  }

  &-item {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 30px;
    width: 50%;
    height: 104px;
    padding-left: 16px;
    border-bottom: 1px solid var(--border-color-d8d8d8);

    &-pt {
      min-width: 54px;
      height: 24px;
      line-height: 24px;
      background: var(--theme-color);
      font-size: 14px;
      font-weight: 500;
      font-style: normal;
      text-align: center;
      color: var(--font-color-fff);
      border-radius: 2px;
      border: 0;
      margin-right: 10px;
    }

    &-title {
      font-size: 24px;
      font-weight: 500;
      text-align: left;
      margin-left: 19px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;

      &:hover {
        color: var(--theme-color);
      }
    }

    &-tag {
      font-size: 12px;
      color: var(--theme-color);
      margin-right: 60px;
      margin-top: 10px;
    }

    &-tag2 {
      font-size: 12px;
      color: var(--font-color-999);
      margin-right: 60px;
      margin-top: 10px;
    }

    >div {
      flex: 1;
      text-align: left;

      p {
        margin: 0;
      }
    }

    &:nth-child(even) {
      padding-right: 15px;
    }

    &:nth-child(odd) {
      padding-right: 28px;
    }
  }

  .electronic-card-box-love {
    width: 38px;
    height: 38px;
    cursor: pointer;
    margin: -5px -5px 0 0;
  }
}
</style>
