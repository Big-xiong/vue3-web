<template>
  <div class="first-website-info">
    <p>{{ $t(`扎根澳门 闪耀全球 尊贵会籍 极致奢华`) }}</p>
    <p>
      ROOTED IN MACAU,SHINING IN THE WORLE,DISTINGUISHED MEMBERSHIP,ULTIMSTE
      LUXURY
    </p>
    <p>
      {{ $t(`于2004年5月18日开幕，`) }}
      <span>总投资逾2.6亿美元，</span>
      澳门金沙娱乐场（Sands Casino）是位于澳门新口岸区的一家赌场，
      <br />
      {{ $t('由威尼斯人（澳门）股份有限公司所持有及运营。美国拉斯维加斯金沙公司属下。') }}
      <br />
      {{ $t(`CES`) }}
      <span>面积接近180,000英尺，</span>
      合共设有
      <span>438张中西式赌台，以及921台角子机。</span>
      <br />
      {{ $t(`CES内除了1楼中场之外，另还设有贵宾区域“御签会”（Paiza Club），非吸烟区“明珠坊”（Pearl Room）以及新增建位于2楼的`) }}
      <span>“如意坊”（Fortune Level）</span>
    </p>
    <ul>
      <li>
        <Line class="line line-box-color01" :className="`line-box-color01`" />
        <svg-icon name="site01" />
        <p class="chi">{{ $t(`平均存款时间`) }}</p>
        <p class="eng">DEPOSIT TIME</p>
        <i></i>
        <p>10{{ $t(`秒`) }}</p>
      </li>
      <li>
        <Line class="line line-box-color02" :className="`line-box-color02`" />
        <svg-icon name="site02" />
        <p class="chi">{{ $t(`平均取款时间`) }}</p>
        <p class="eng">WITHDRAWAL TIME</p>
        <i></i>
        <p>30{{ $t(`秒`) }}</p>
      </li>
      <li>
        <Line class="line line-box-color03" :className="`line-box-color03`" />
        <svg-icon name="site03" />
        <p class="chi">{{ $t(`累计彩金总奖池`) }}</p>
        <p class="eng">PROGRESSIVE JACKPOT</p>
        <i></i>
        <count-to
          duration="50000000000"
          decimals="2"
          :startVal="data.jackpotSettings.startVal"
          :endVal="data.jackpotSettings.endVal"
        />
      </li>
      <li>
        <Line class="line line-box-color04" :className="`line-box-color04`" />
        <svg-icon name="site04" />
        <p class="chi">{{ $t(`每小时注单量`) }}</p>
        <p class="eng">ORDERS PER HOUR</p>
        <i></i>
        <count-to
          v-if="dicts?.siteinfo"
          duration="10000000000"
          decimals="0"
          :startVal="dicts?.siteinfo?.hour_orders * 1"
          :endVal="dicts?.siteinfo?.hour_orders * 2"
        />
      </li>
      <li>
        <Line class="line line-box-color05" :className="`line-box-color05`" />
        <svg-icon name="site05" />
        <p class="chi">{{ $t(`累计用户量`) }}</p>
        <p class="eng">CUMULATIVE USERS</p>
        <i></i>
        <count-to
          v-if="dicts?.siteinfo"
          duration="5000000000000"
          decimals="0"
          :startVal="dicts?.siteinfo?.members * 1"
          :endVal="dicts?.siteinfo?.members * 2"
        />
      </li>
    </ul>
  </div>
</template>
<script setup>
import {
  inject,
  toRefs,
  reactive,
  computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { CountTo } from 'vue3-count-to';
import { jackpots } from '@/api/game';
import Line from './line-bg.vue';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', 'siteinfo');
const subConfig = inject('subConfig');

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};
const data = reactive({
  potrankList: [], // 彩池列表
  jackpotSettings: {}, // 设置
  decimals: 2, // 参数设置
  duration: 10000000, // 参数设置
});

const { loading: dataLoading } = useRequest(jackpots, {
  onSuccess(res) {
    // 为了拉霸效果，设置.5s的动画
    const delay = 500;
    const st = new Date().getTime();
    const i = 1;

    data.jackpotSettings = {
      startVal: res[1].pot_money,
      endVal: res[1].pot_money * 2,
      duration: data.duration,
      decimals: data.decimals,
    };
  },
});

</script>

<style lang="scss" scoped>
.first-website-info {
  height: 460px;
  padding-top: 48px;
  background: url("/src/current_project/assets/images/channel/bg.jpg") center
    no-repeat;
  background-size: cover;
  box-sizing: border-box;

  p:nth-child(1) {
    font-size: 36px;
    color: var(--font-color-000);
    font-weight: bold;
    line-height: 50px;
    margin: 0;
  }

  p:nth-child(2) {
    font-size: 10px;
    color: #666;
    line-height: 14px;
    margin: 4px 0 10px;
  }

  p:nth-child(3) {
    font-size: 12px;
    color: var(--font-color-333);
    line-height: 23px;

    span {
      color: var(--theme-color);
    }
  }

  ul {
    width: 1200px;
    margin: 50px auto 0;
    font-size: 0;
    li {
      display: inline-block;
      vertical-align: top;
      width: 20%;
      height: 172px;
      padding-top: 20px;
      box-sizing: border-box;
      position: relative;

      :deep(.line) {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .svg-icon {
        fill: var(--font-color-333);
        width: 28px;
        height: 28px;
        margin-bottom: 13px;
      }

      &:hover {
        p,
        span {
          color: var(--theme-color) !important;
        }

        i {
          background: var(--theme-color) !important;
        }

        .svg-icon {
          fill: var(--theme-color);
        }

        :deep(.line-box-border) {
          stroke: var(--theme-color);
        }
      }

      &:first-child:hover {
        :deep(.line-box-color01) {
          stop-color: var(--theme-color);
        }
      }

      &:nth-child(2):hover {
        :deep(.line-box-color02) {
          stop-color: var(--theme-color);
        }
      }

      &:nth-child(3):hover {
        :deep(.line-box-color03) {
          stop-color: var(--theme-color);
        }
      }

      &:nth-child(4):hover {
        :deep(.line-box-color04) {
          stop-color: var(--theme-color);
        }
      }

      &:nth-child(5):hover {
        :deep(.line-box-color05) {
          stop-color: var(--theme-color);
        }
      }

      .chi {
        font-size: 14px;
        color: var(--font-color-333);
        line-height: 20px;
        margin: 0;
      }

      .eng {
        font-size: 10px;
        color: var(--font-color-999);
        line-height: 12px;
      }

      i {
        display: block;
        width: 15px;
        height: 4px;
        opacity: 1;
        background: var(--color-white);
        border-radius: 2px;
        margin: 13px auto 9px;
      }

      p:last-child,
      span {
        font-size: 18px;
        color: var(--font-color-333);
        line-height: 25px;
        font-weight: bold;
        margin: 0;
        font-family: "Din Alternate", Quicksand, "PingFang SC",
          "Hiragino Sans GB", "Helvetica Neue", "Microsoft Yahei", sans-serif,
          arial;
      }
    }
  }
}
</style>
