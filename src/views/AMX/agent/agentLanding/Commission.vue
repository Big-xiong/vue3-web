<template>
  <div class="agent-commission">
    <div class="agent-nav-content">
      <div class="agent-nav">
        <span />{{$t('佣金计划')}}<span />
      </div>
      <div class="commission-list">
        <table>
          <thead>
            <tr>
              <th>{{$t('级别')}}</th>
              <th>{{$t('公司本月盈利')}}</th>
              <th>{{$t('活跃玩家数量最低要求')}}</th>
              <th>{{$t('佣金百分之比')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(list, index) in commissionData"
              :key="index"
            >
              <td>{{ list.lev }}</td>
              <td>{{ list.yl }}</td>
              <td>{{ list.hys }}</td>
              <td>{{ list.yjb }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tip">
        {{$t('每月10号之前完成推广代理佣金结算，推广代理可在每月10号后，申请提取佣金。佣金将在三个工作日内自动转入取款账户。')}}
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const global = inject('global');

const commissionData = reactive([
  {
    lev: '1',
    yl: '1-50,000',
    hys: '3',
    yjb: '30.00%',
  },
  {
    lev: '2',
    yl: '50,001-200,000',
    hys: '10',
    yjb: '35.00%',
  },
  {
    lev: '3',
    yl: '200,001-600,000',
    hys: '30',
    yjb: '40.00%',
  },
  {
    lev: '4',
    yl: '600,001-1,000,000',
    hys: '60',
    yjb: '45.00%',
  },
  {
    lev: '5',
    yl: global.$t('1,000,001以上'),
    hys: '100',
    yjb: '50.00%',
  },
]);
</script>

<style scoped lang="scss">
.agent-commission {
  width: 1200px;
  margin: 0 auto;

  .agent-nav-content {
    width: 100%;
    margin: 0 auto;

    .commission-list {
      width: 1200px;
      height: 400px;

      table {
        width: 100%;
        border-collapse: collapse;
        background-color: var(--block-bg-color);
        border-radius: 14px 14px 0 0;
        overflow: hidden;

        tr {
          th,
          td {
            border: 1px solid var(--border-color-e4e4e4);
            text-align: center;
            box-sizing: border-box;
            color: var(--font-color-fff);
          }
        }

        thead {
          width: 100%;
          background-color: var(--theme-color);
          height: 60px;
          line-height: 60px;
        }

        tbody {
          tr {
            width: 100%;
            height: 60px;
            line-height: 60px;

            td {
              color: var(--font-color-000);
            }
          }
        }
      }

      .tip {
        font-size: 16px;
        color: var(--font-color-ccc);
        margin-bottom: 20px;
      }
    }
  }

  .tip {
    font-size: 16px;
    color: var(--cur-font-color-999);
    opacity: 0.8;
  }
}
</style>
