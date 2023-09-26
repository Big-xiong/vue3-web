<template>
  <div
    class="question-wrap"
    v-loading="getLoading || loading"
  >
    <!-- <HeadNav
            :navList="navList"
            :selectedIndex="selectedIndex"
            @select="handleNavSelect($event)"
    />-->
    <HeadSubNav
      :navList="subNavList"
      :selectedIndex="subSelectedIndex"
      @select="handleSubNavSelect($event)"
    />
    <div class="main-body">
      <!-- <h3>{{ detail.title || '' }}</h3> -->
      <div
        class="main-content"
        v-html="detail.content || ''"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref, watch, inject, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { gamemanualdetail } from '@/api/help';
import HeadNav from '../components/HeadNav.vue';
import HeadSubNav from '../components/HeadSubNav.vue';

const $store = inject('store');
const { app, user } = $store.state;
const { dicts } = app;

const selectedIndex = ref(0);
const subNavList = ref([]);
const subSelectedIndex = ref(0);
const detail = ref({
  content: '',
});

const { run: getDetail, loading: getLoading } = useRequest(gamemanualdetail, {
  manual: true,
  onSuccess(result) {
    detail.value = result;
  },
});

const $router = useRouter();

onMounted(() => {
  $store.dispatch('app/getDict', 'gamemanual');
  watch([dicts, $router.currentRoute], ([dict, val]) => {
    const id = val.query.id?.split?.('-')?.[1] ?? '';
    if (id && dict?.gamemanual?.length) {
      subNavList.value = dict?.gamemanual?.[id]?.list ?? [];
      if (subNavList.value[0]) {
        getDetail({ id: subNavList.value[0].id });
      }
    }
  });
});

function handleSubNavSelect(index) {
  subSelectedIndex.value = index;
  getDetail({ id: subNavList.value[index].id });
}
</script>

<style lang="scss" scoped>
.main-body {
  padding: 30px 40px 40px 40px;
  width: 995px;
  box-sizing: border-box;
  box-shadow: 0px 3px 15px 0px rgba(0, 34, 80, 0.1);
  background-color: var(--dark-bg-color-191919, var(--bg-color-fff));
  text-align: left;
  line-height: 30px;
  min-height: 200px;
  color: var(--font-color-333);

  h3 {
    font-size: 24px;
    margin-bottom: 20px;
    margin-top: 0;
  }

  p {
    text-align: justify;
  }

  a {
    color: var(--theme-color);
  }

  :deep(p) {
    margin: 0;

    strong {
      display: inline-block;
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--border-color-353435);
    border-style: none !important;

    tr {
      background-color: transparent !important;

      &:hover {
        background-color: transparent !important;
      }
    }

    td,
    th {
      padding: 10px;
      border: 1px solid var(--border-color-353435);
      white-space: unset !important;
    }
  }
}
</style>
