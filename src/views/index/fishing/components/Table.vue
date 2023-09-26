<template>
  <div class="fishing-table">
    <div
      v-for="item in list"
      :key="item.title"
      class="fishing-table-col"
      :class="{ 'gray-scal': $getGameStatus(item, 3) }"
      v-login
      @click="$playGame(item, 3, item.index)"
    >
      <Card
        :img-url="item.img"
        :title="item.title"
        :description="item.description"
        :isGray="$getGameStatus(item, 3)"
      />
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue';

defineProps({
  list: {
    type: Array,
    default: () => [{
      title: '',
      description: '',
      img: '',
      default_game_id: 0,
      game_platform_id: 0,
      name: '',
    }],
  },
});

</script>

<style lang="scss" scoped>
.fishing-table {
  display: flex;
  &-col {
    margin-right: 18px;
  }
}
</style>
