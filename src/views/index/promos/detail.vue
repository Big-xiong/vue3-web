<template>
  <div class="discount-content">
    <div
      class="align-center-wrap-1200"
      v-loading="detailLoading"
    >
      <p class="discount-content-title">{{ detailData?.name }}</p>
      <div
        v-html="detailData?.detail_content"
        class="discount-content-detail"
      ></div>

      <div
        class="discount-detail-empty"
        v-if="!detailData && !detailLoading"
      >
        <svg-icon
          class="svg-icon-empty"
          name="empty"
        />
        <p>{{ $t(`暂无内容`) }}</p>
      </div>

      <div
        class="footer-btn"
        v-if="option === 1 || option === 2"
      >
        <el-button
          type="primary"
          v-if="!user?.isLogin"
          @click="() => {
          $emit('update:modelValue', false)
          modelValue = false;
          $router.push({ name: 'register' })
        }"
        >{{ $t('登录注册') }}</el-button>
        <el-button
          type="primary"
          v-else-if="option === 1"
          @click="() => {
          $emit('update:modelValue', false)
          modelValue = false;
          $router.push({ name: 'centerDeposit', params: { title: $t('存款') } })
        }"
        >{{ $t('去存款') }}</el-button>
        <el-button
          type="primary"
          v-else-if="option === 2"
          @click="getWelfare"
        >{{ $t('领取福利') }}</el-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { activitydetail } from '@/api/active';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const option = computed(() => global.$router.currentRoute.value.query.option);
const id = computed(() => global.$router.currentRoute.value.query.id);

const { data: detailData, run: detailRun, loading: detailLoading } = useRequest(() => activitydetail({ id: id.value }));

</script>

<style lang='scss' scoped>
.discount-content {
  position: relative;
  padding: 24px 0 30px;

  > div {
    background-color: var(--bg-color-1c385c);
    padding: 35px;
    min-height: 400px;
    text-align: left;
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
.footer-btn {
  padding: 12px 0;
  min-width: 142px;
  box-shadow: 0px -2px 2px 0px var(--discount-border-color-000);
}
</style>
