<template>
  <div class="agent-excellent">
    <div class="agent-excellent-content">
      <div class="agent-nav">
        <span />
        {{ $t('上月优秀代理') }}
        <span />
      </div>
      <div class="excellent-list">
        <el-carousel height="200px">
          <el-carousel-item v-for="(item, index) in excellentData" :key="index">
            <div class="swiper">
              <div v-for="(list, index) in item" :key="index" class="list">
                <p class="name">{{ $t('会员') }}：{{ list.username }}</p>
                <p class="prem">
                  {{ $t('上月佣金') }}：
                  <span v-money="list.month_fee"></span>
                </p>
                <p class="all">{{ $t('累计开户') }}：{{ list.members }}</p>
                <p class="times">
                  <em>{{ $t('已运营') }}</em>
                  <span
                    v-if="parseInt(list.months / 12) != 0"
                  >{{ parseInt(list.months / 12) }}{{ $t('年') }}</span>
                  <span>{{ list.months % 12 }}</span>
                  {{ $t('月') }}
                </p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, ref } from 'vue';
import { excellentagent } from '@/api/agent';

const global = inject('global');

const excellentData = ref([]);

useRequest(
  () => excellentagent(),
  {
    onSuccess(result) {
      const holder = [];
      for (let i = 0; i < result.length; i += 5) {
        holder.push(result.slice(i, i + 5));
      }
      excellentData.value = holder;
    },
  },
);
</script>

<style lang="scss" scoped>
.agent-excellent {
  width: 1200px;
  margin: 0 auto;

  .agent-excellent-content {
    margin: 0 auto;
  }

  .agent-nav {
    width: 1200px;
    margin: 0 auto;
  }

  .swiper {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: space-between;
    margin-left: -10px;

    .list {
      width: 232px;
      height: 200px;
      background: var(--bg-color-282828);
      text-align: center;
      margin-left: 10px;

      .name {
        font-size: 16px;
        color: var(--font-color-525152);
        margin-top: 25px;
      }

      .prem {
        font-size: 16px;
        color: var(--font-color-ccc);
        margin-top: 10px;
      }

      .all {
        font-size: 18px;
        color: var(--font-color-fff);
        margin-top: 14px;
      }

      .times {
        font-size: 14px;
        color: var(--font-color-bebebe);
        height: 62px;
        line-height: 62px;
        margin-top: 20px;
        border-top: 1px solid var(--border-color-353435);
      }

      em {
        font-style: normal;
      }
    }
  }
}
</style>
