<template>
  <div class="vip-wrap-rebate">
    <table class="vip-rebate-detail">
      <thead>
        <tr class="vip-rebate-detail__head vrd__title">
          <th>{{ $t('VIP等级') }}</th>
          <th
            v-for="(item) in dicts?.memberlevellist"
            :key="item"
          >VIP{{ item.level }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="vip-rebate-item"
          v-for="(item,index) in allActivityBenefitList"
          :key="index"
        >
          <td>{{ item.name }}</td>
          <td
            v-for="(child,cindex) in dicts?.memberlevellist"
            :key="cindex"
          >{{ allActivityBenefitList?.[index]?.list[cindex]?.proportion ?? '0' }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import {
  inject,
  ref,
  computed,
} from 'vue';

import { useRequest } from 'ahooks-vue';
import { allactivitybenefit } from '@/api/vip';

const $store = inject('store');
$store.dispatch('app/getDict', ['memberlevellist']);
const { app: { dicts } } = $store.state;
const { data: allActivityBenefitList } = useRequest(allactivitybenefit, {
  formatResult: (res) => res ?? [],
});
</script>
<style lang="scss" scoped>
.vip-wrap-rebate {
  width: 900px;
  margin: 0 auto;
  .vip-rebate-detail {
    width: 100%;
    border-spacing: 0;
    th,
    td {
      height: 52px;
      color: var(--color-white);
    }
    th {
      color: var(--font-color-fff);
    }
    thead {
      th:first-child {
        border-radius: 15px 0 0 0;
      }
      th:last-child {
        border-radius: 0 15px 0 0;
      }
    }
    tbody {
      tr:nth-child(2n + 1) {
        background: var(--bg-color-203858);
      }
      tr:nth-child(2n) {
        background: var(--bg-color-063258);
      }
    }
  }
  .vrd__title {
    font-size: 16px;
    line-height: 46px;
    color: var(--color-white);
    background: var(--theme-color);
    border-radius: 14px 14px 0px 0px;
  }
  .vrd__deposit {
    color: var(--theme-color);
    line-height: 39px;
    background: var(--bg-color-203858);
  }
}
</style>
