<template>
  <div class="brand-wrap">
    <div class="main-body">
      <img v-for="(item, index) in imageList" :key="index" :src="item.index_pic" alt />
    </div>
  </div>
</template>

<script setup>

import { useRequest } from 'ahooks-vue';
import { ref } from 'vue';
import { strength } from '@/api/help';

const imageList = ref([]);

const { loading } = useRequest(
  () => strength(),
  {
    onSuccess(result) {
      imageList.value = result;
    },
  },
);
</script>

<style lang="scss" scoped>
.main-body {
  padding: 40px;
  width: 995px;
  background: var(--bg-color-282828);
  text-align: left;
  line-height: 30px;
  min-height: 200px;

  img {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
