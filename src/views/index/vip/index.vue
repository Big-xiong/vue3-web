<template>
  <div class="vip-wrap">
    <div class="align-center-wrap">
      <table class="vip-wrap-table">
        <tr>
          <th colspan="2" width="245" class="noLeftBorder">{{ $t(`VIP内容`) }}</th>
          <th v-for="(item,index) in dicts?.memberlevellist ?? []" :key="index">{{ item.name }}</th>
          <!-- <th width="199">{{ $t(`备注`) }}</th> -->
        </tr>
        <tr class="noTopBorder">
          <td rowspan="2" class="noLeftBorder">{{ $t(`要求`) }}</td>
          <td>{{ $t(`月存款量`) }}</td>
          <td
            v-for="(item,index) in dicts?.memberlevellist"
            :key="index"
          >{{ priceFormat(item.valid_bet_money) }}</td>
        </tr>
        <tr class="noTopBorder">
          <td>{{ $t(`月有效投注`) }}</td>
          <td
            v-for="(item,index) in dicts?.memberlevellist"
            :key="index"
          >{{ priceFormat(item.deposit_money) }}</td>
          <!-- <td
            rowspan="2"
            align="left"
          >
            {{ $t('VIP会员：') }}
            <br />
            {{ $t('-会员需维持对应水准以保持会员等级。') }}
            <br />
            {{ $t('-VVIP在满足条件的情况下，将以特殊邀请的方式来升级。') }}
            <br />
            {{ $t('-获取VIP红利前，需验证账户信息。') }}
          </td>-->
        </tr>
        <tr>
          <td
            :rowspan="allActivityBenefit?.length + 2 + tipsData?.week_deposit?.length"
            style="border-bottom: 0"
            class="noLeftBorder"
          >{{ $t(`福利`) }}</td>
          <td>{{ allActivityBenefit?.[0]?.name }}{{ $t(`日返水`) }}</td>
          <!-- <td
            v-for="(child,cindex) in allActivityBenefit?.[0]?.list ?? []"
            :key="cindex"
          >{{ child.proportion }}%</td>-->
          <td
            v-for="(child,cindex) in dicts?.memberlevellist"
            :key="cindex"
          >{{ allActivityBenefit?.[0]?.list[cindex].proportion ?? '0' }}%</td>
        </tr>

        <tr v-for="(item,index) in allActivityBenefit02" :key="index">
          <td>{{ item.name }}{{ $t(`日返水`) }}</td>
          <!-- <td
            v-for="(child,cindex) in item.list"
            :key="cindex"
          >{{ child.proportion }}%</td>-->
          <td
            v-for="(child,cindex) in dicts?.memberlevellist"
            :key="cindex"
          >{{ allActivityBenefit02?.[index]?.list[cindex]?.proportion ?? '0' }}%</td>
        </tr>

        <tr v-for="(item,index) in tipsData?.week_deposit || []" :key="index">
          <td>{{ item.name }}</td>

          <td
            v-for="(child,cindex) in item.benefit_setting?.level_conf ?? dicts?.memberlevellist"
            :key="cindex"
          >{{ (child.bonus_rate && child.bonus_rate) ? `${child.bonus_rate}% up to ${priceFormat(child.bonus_max)}` : '-' }}</td>
        </tr>
        <tr>
          <td class="noLeftBorder">{{ $t(`VIP欢迎红利`) }}</td>
          <td
            v-for="item in dicts?.memberlevellist"
            :key="item"
            class="value"
          >{{ getBirthDayMoney(item.level, 'upgrade_money') || '-' }}</td>
        </tr>

        <tr>
          <td class="noLeftBorder">{{ $t(`生日红利`) }}</td>
          <td
            v-for="item in dicts?.memberlevellist"
            :key="item"
            class="value"
          >{{ getBirthDayMoney(item.level, 'birthday_money') || '-' }}</td>
        </tr>
      </table>
      <template v-if="bottips">
        <div class="vip-wrap-tips">
          <div v-html="bottips"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { allactivitybenefit, viptips, activitybenefit } from '@/api/vip';
import { priceFormat } from '@/utils/index';

const global = inject('global');
const subConfig = inject('subConfig');

const $store = inject('store');
$store.dispatch('app/getDict', ['memberlevellist']);
const { app: { dicts }, user } = $store.state;

const allActivityBenefit = ref([]);
const allActivityBenefit02 = ref([]);

useRequest(allactivitybenefit, {
  onSuccess(res) {
    allActivityBenefit.value = res;
    allActivityBenefit02.value = res.slice(1);
  },
});

const bottips = ref('');
const tipsData = ref({});

useRequest(viptips, {
  onSuccess(res) {
    tipsData.value = res;
    res.wash_activity.forEach((item) => {
      if (item.washcode_content) {
        bottips.value += item.washcode_content;
      }
    });
  },
});

function getBirthDayMoney(level, name) {
  const taregetBirth = tipsData.value?.birthday?.find((item) => item.level === level) ?? null;
  if (taregetBirth) {
    return priceFormat(taregetBirth[name]);
  }

  return '';
}

onMounted(() => {
  // tipsRun();
  // watch(() => user.userInfo, () => {
  //   if (user?.userInfo?.id) {
  //     tipsRun();
  //   }
  // }, { immediate: true });
});

const activityBenefit = ref({});

useRequest(activitybenefit, {
  onSuccess(res) {
    activityBenefit.value = res;
  },
});

const product = [
  { name: global.$t(`体育`), vn: 100, grade: 1 },
  { name: global.$t(`真人`), vn: 100, grade: 0.5 },
  { name: global.$t(`电子`), vn: 100, grade: 1 },
  { name: global.$t(`彩票`), vn: 100, grade: 1 },
];

const desc = global.$t(`会员的累计有效投注会得到相应的VIP成长值。达到相应级别的要求，即可在次日晋级相应VIP等级，数据统计时间从VIP系统上线当日0点开始。`);
const tips = [
  { title: global.$t(`晋升标准：`), desc },
  { title: global.$t(`保级要求：`), desc },
  { title: global.$t(`降级标准：`), desc },
  { title: global.$t(`晋级礼金：`), desc },
  { title: global.$t(`生日礼金：`), desc },
  { title: global.$t(`每月红包：`), desc },
  { title: global.$t(`佳节礼品：`), desc },
  { title: global.$t(`客户经理：`), desc },
  { title: global.$t(`游戏通道：`), desc },
  { title: global.$t(`有效投注：`), desc: global.$t(`相应类型游戏投注，任何对押、和局、无效的、投注失败的、未产生输赢结果的投注不计算为有效投注（体育类港赔0.75）`) },
  { title: '', desc: global.$t(`{0}有权对该活动进行修改、暂停、取消等，无需特别通知，并保留对该活动的最终解释权`, [subConfig.title]) },
];

</script>

<style lang="scss">
.vip-wrap {
  background: var(--bg-color-10141F) url("/src/assets/images/vip/vip.png")
    center top no-repeat;
  background-size: 1080px auto;
  padding: 390px 0 30px;

  .align-center-wrap {
    padding: 0 40px;
  }

  &-table {
    width: 1200px;
    margin: 0 auto;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 16px;
    color: var(--font-color-fff);
    text-align: center;
    background-color: var(--bg-color-1e212e);
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    margin-bottom: 48px;

    th {
      background-color: var(--bg-color-2A313E);
      height: 52px;
      &:not(:last-child) {
        border-right: 1px solid var(--footer-border);
      }
    }

    td {
      height: 52px;
      border: 1px solid var(--footer-border);
      padding: 15px;
      box-sizing: border-box;

      &.noLeftBorder {
        border-left: 0;
      }

      &:last-child {
        border-right: 0;
      }
    }

    tr:nth-child(2) {
      th {
        border-top: 1px solid var(--footer-border);
        border-right: 1px solid var(--footer-border);
      }
    }

    tr:last-child {
      td {
        border-bottom: 0;
      }
    }

    .noTopBorder {
      td {
        border-top: 0;
      }
    }
  }

  &-title {
    width: 500px;
    margin: 70px auto 38px;
  }

  &-tips {
    width: 1080px;
    padding: 0 30px;
    box-sizing: border-box;
    margin: 0 auto;
    counter-reset: count;

    p {
      position: relative;
      padding-left: 28px;
      text-align: left;
      font-size: 13px;
      line-height: 18px;
      color: var(--font-color-9fbbd5);
      margin-bottom: 42px;

      &::before {
        content: counter(count, decimal) ".";
        counter-increment: count;
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        color: var(--font-color-9fbbd5);
      }
    }
  }
}
</style>
