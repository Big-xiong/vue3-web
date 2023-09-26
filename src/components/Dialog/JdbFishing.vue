<template>
  <Dialog v-model="modelValue" width="1200px" center :title="`JDB ${$t('捕鱼')}`" titlePadding="15px 0" :showBtn="false"
    cancelType="primary" customeClass="jdb-fishing-wrap" v-bind="$attrs">
    <div v-loading="loading" class="jdb-fishing-wrap-list">
      <div class="jdb-fishing-wrap-list-item" v-for="item in data" :key="item.id" @click="$playGame(item)">
        <el-image :src="item.pic" v-game-status="$getGameStatus(item)" />
        <p>
          <span>{{ item.name }}</span>
          <span>{{ $t('立即开始') }}</span>
        </p>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { gamelist } from '@/api/app';
import Dialog from './index.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  id: {
    type: String,
    default: '',
  },
});

const { data, loading } = useRequest(() => gamelist({ platform_id: props.id }), {
  formatResult: (res) => res.data ?? [],
});

</script>

<style lang="scss">
.jdb-fishing-wrap {
  .el-dialog-title {
    --dialog-title-bg: var(--theme-color);
    --dialog-title-border-radius: 10px 10px 0 0;
  }

  maintain {
    top: 70px !important;
  }

  &-list {
    min-height: 300px;
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 250px;
      margin: 15px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      overflow: hidden;

      >p {
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--jdb-fishing-dialog-item-border-color, #444);
        border-top: 0;
        margin-top: 0;
        border-radius: 0 0 5px 5px;
        padding: 20px 15px;

        span {
          &:first-child {
            font-size: 16px;
            color: var(--jdb-fishing-dialog-item-font-color, #f0f0f0);
          }

          &:last-child {
            color: var(--theme-color);
          }
        }
      }
    }
  }
}
</style>
