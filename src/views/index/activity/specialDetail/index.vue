<template>
  <div class="discount-content">
    <div class="main-banner">
      <img :src="detailData?.index_max_pic">
    </div>
    <div class="main-top">
      <template v-if="user?.isLogin">
        <el-button type="primary" @click="$router.push({
          name: 'centerDeposit', params: {
            title: '存款',
          }
        })">
          {{ $t('立即存款') }}
        </el-button>
      </template>
    </div>
    <div class="align-center-wrap-1200" v-loading="detailLoading" v-if="detailData?.detail_content">
      <p class="discount-content-title">{{ detailData?.name }}</p>
      <div v-html="detailData?.detail_content" class="discount-content-detail"></div>

      <div class="discount-detail-empty" v-if="!detailData && !detailLoading">
        <svg-icon class="svg-icon-empty" name="empty" />
        <p>{{ $t(`暂无内容`) }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { specialdetail } from '@/api/activity';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const id = computed(() => global.$router.currentRoute.value.query.id);

const { data: detailData, run: detailRun, loading: detailLoading } = useRequest(() => specialdetail({ id: id.value }));

</script>

<style lang='scss' scoped>
.discount-content {
  position: relative;
  padding-bottom: 30px;
  min-height: 100vh;

  .main-banner {
    img {
      display: block;
      width: 100%;
    }
  }

  .main-top {
    margin-top: 24px;
  }

  >.align-center-wrap-1200 {
    background-color: var(--bg-color-1c385c);
    padding: 35px;
    // min-height: 400px;
    text-align: left;
    margin-top: 24px;
  }

  &-title {
    text-align: left;
    opacity: 1;
    font-size: 20px;
    font-weight: 700;
    color: var(--font-color-404040);
    line-height: 30px;
    margin: 5px 0 10px;
  }

  :deep(table) {
    border-collapse: collapse;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    border-style: solid !important;
    color: var(--font-color-333);

    tbody tr:first-child {
      background-color: var(--theme-color) !important;

      td {
        color: var(--font-color-fff);
        border-color: var(--theme-color);

        &:not(:last-child) {
          border-right-color: var(--border-color-000-1);
        }
      }

      p {
        color: var(--font-color-fff);
      }
    }

    p {
      margin: 0;
      font-size: 16px;
      color: var(--font-color-404040);
    }

    td {
      border: 1px solid var(--border-color-000-1);
      height: 46px !important;
    }
  }

  :deep(p) {
    color: var(--font-color-333);
  }

  .svg-icon-empty {
    width: 100px;
    height: 100px;
    fill: var(--theme-color) !important;
  }

  .discount-detail-empty {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 126px;
    }

    p {
      font-size: 20px;
      color: var(--font-color-404040);
      margin: 20px 0;
    }
  }
}
</style>
