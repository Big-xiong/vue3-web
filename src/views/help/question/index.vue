<template>
  <div class="question-wrap">
    <div class="main-body">
      <h3>{{ helpData.title || '' }}</h3>
      <div
        class="main-content"
        v-html="helpData.content || ''"
      />
    </div>
  </div>
</template>

<script setup>
import {
  reactive, inject, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { aqdetail } from '@/api/help';
import HeadNav from '../components/HeadNav.vue';

const global = inject('global');
const $store = inject('store');
const { app, user } = $store.state;
const { dicts } = app;

const $router = useRouter();

const helpData = reactive({
  title: 'loading...',
  content: '',
});

const { run: getDetail, loading: helpLoading } = useRequest(aqdetail, {
  manual: true,
  onSuccess(res) {
    helpData.title = res.title;
    helpData.content = res.content;
  },
});

onMounted(() => {
  $store.dispatch('app/getDict', 'aplist');
  watch([dicts, $router.currentRoute], ([dict, route]) => {
    if (dict?.aplist?.list?.length) {
      getDetail({ id: dict?.aplist?.list[route.query.id?.split?.('-')?.[1] ?? '0'].id });
    }
  });
});

</script>

<style lang="scss" scoped>
.question-wrap {
  box-shadow: 0px 3px 15px 0px rgba(0, 34, 80, 0.1);
  background-color: var(--dark-bg-color-191919, var(--bg-color-fff));
}
.main-body {
  padding: 0 30px;

  text-align: left;
  line-height: 30px;
  min-height: 200px;
  box-sizing: border-box;
  color: var(--font-color-333);

  .main-content {
    padding-bottom: 30px;
  }

  h3 {
    font-size: 24px;
    margin: 0 0 20px;
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    color: var(--font-color-333);
    border-bottom: 1px solid var(--dark-theme-border-fff-1, var(--border-color-e2e2e2));
  }

  p {
    text-align: justify;
  }

  a {
    color: var(--theme-color);
  }
}
</style>
