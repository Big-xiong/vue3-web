<template>
          <div class="rebate-wrap">
            <div class="rebate-wrap-block">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('自助洗码')" name="first">
                  <Rebate v-loading="dicts?.platformgameidsv2Loading" :list="dicts?.platformgameidsv2 ?? []"/>
                </el-tab-pane>
                <el-tab-pane :label="$t('历史记录')" name="second">
                  <History v-loading="dicts?.platformgameidsv2Loading" :list="dicts?.platformgameidsv2 ?? []"/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
</template>

<script setup>
import {
  inject, reactive, watch, ref,
} from 'vue';
import History from './components/History.vue';
import Rebate from './components/Rebate.vue';

const activeName = ref('first');

const $store = inject('store');
$store.dispatch('app/getDict', ['platformgameidsv2']);
const { dicts } = $store.state.app;

</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav)  {
  min-height: 75px;
}
.rebate-wrap {
  font-size: 14px;

  &-block {
    border-radius: 10px;
  }

  .el-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 0;

      .el-tabs__item {
        padding: 20px !important;
        font-size: 20px;
        color: var(--font-color-ccc);

        &.is-active {
          color: var(--font-color-000);
          font-weight: bold;
        }
      }
    }

    :deep(.el-tabs__content) {
      padding: 30px;
      min-height: 610px;
      box-sizing: border-box;
    }
  }
}
</style>
