<template>
  <div class="sub-banner-wrap" v-loading="bannerLoading" v-if="bannerList?.[0]?.pic"
    :style="{ backgroundImage: `url(${bannerList?.[0]?.pic})` }" />
</template>

<script setup>
import { inject, onMounted } from 'vue';
import { useRequest } from 'ahooks-vue';
import { indexbanner } from '@/api/home';

const $store = inject('store');

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const { loading: bannerLoading, data: bannerList } = useRequest(
  () => indexbanner({ game_cate_id: props.id }),
);
</script>

<style lang="scss" scoped>
.sub-banner-wrap {
  height: 320px;
  width: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
