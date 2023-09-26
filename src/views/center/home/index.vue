<template>
  <div class="center-home-wrap">
    <el-row
      :gutter="20"
      class="center-home-wrap-top"
    >
      <el-col :span="12">
        <UserInfo />
      </el-col>
      <el-col :span="12">
        <div class="layout-block">
          <Newst />
        </div>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      class="center-home-wrap-total"
    >
      <el-col
        :span="8"
        v-for="(item,index) in totalList"
        :key="index"
      >
        <div class="layout-flex-center layout-block">
          <span class="layout-flex-center center-home-wrap-total-icon">
            <svg-icon :name="`m-icon${index + 1}`"></svg-icon>

            <!-- <img
              :src="$getSrc(`/src/assets/images/center/home/icon${index + 1}.png`)"
              alt
            />-->
          </span>
          <h3
            v-if="index === 0"
            v-money="Number(user.walletInfo.money || '0') + Number(user.walletInfo.all_platform_money || '0') + Number(user.walletInfo.financing_money || '0')"
          ></h3>
          <h3
            v-if="index === 1"
            v-money="user.walletInfo.money"
          ></h3>
          <h3
            v-if="index === 2"
            v-money="user.walletInfo.all_platform_money"
          ></h3>
          <p>{{ $t(item.title) }}</p>
          <el-button
            type="primary"
            @click="$router.push({ name: item.routeName, params: item.params })"
          >{{ $t(item.btnTxt) }}</el-button>
          <el-tooltip
            :append-to-body='false'
            :content="$t(item.content)"
            popper-class="toolX-tooltip"
            placement="bottom"
            effect="dark"
          >
            <svg-icon
              class="tip-action"
              name="help@2x"
            ></svg-icon>
            <!-- <img
              class="tip-action"
              src="/src/assets/images/center/home/help@2x.png"
              alt
            />-->
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <div class="layout-block center-home-wrap-chart">
      <div class="layout-flex-between center-home-wrap-chart-tit">
        <div>
          <span>{{ $t(`投注分析`) }}</span>
        </div>
        <p
          class="layout-flex-center pointer"
          @click="$router.push({ name: 'centerGameRecord', params: { title: '投注记录' } })"
        >
          <span>{{ $t(`查看明细`) }}</span>
          <i class="el-icon-arrow-right"></i>
        </p>
      </div>
      <BetStat />
    </div>
  </div>
</template>

<script setup>
import {
  inject,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import UserInfo from './components/UserInfo.vue';
import Newst from './components/Newst.vue';
import BetStat from './components/BetStat.vue';

const global = inject('global');

const $store = inject('store');
const { user } = $store.state;
const totalList = [
  {
    svgName: 'property',
    title: global.$t('钱包'),
    routeName: 'centerWithdraw',
    params: {
      title: global.$t('取款'),
      renderTitle: false,
      noBg: true,
    },
    btnTxt: global.$t('取款'),
    content: global.$t('平台余额+游戏额度，详细额度可以在个人中心页面查看！'),
  }, {
    svgName: 'wallet',
    title: global.$t('中心钱包'),
    routeName: 'centerDeposit',
    params: {
      title: global.$t('存款'),
    },
    btnTxt: global.$t('存款'),
    content: global.$t('平台余额，可以取款和转入游戏厅'),
  }, {
    svgName: 'fund',
    title: global.$t('游戏额度'),
    routeName: 'centerTransfer',
    btnTxt: global.$t('额度转账'),
    params: {
      title: global.$t('额度转账'),
      noBg: true,
    },
    content: global.$t('汇总所有游戏厅余额，详细游戏额度可以在额度转账页面查看！'),
  },
];
</script>

<style lang="scss" scoped>
.center-home-wrap {
  &-top {
    margin-bottom: 20px;

    .layout-block {
      height: 100%;
      margin-bottom: 0;
    }
  }

  &-total {
    .layout-block {
      height: 205px;
      position: relative;
      flex-direction: column;

      .center-home-wrap-total-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        :deep(.svg-icon) {
          width: 50px;
          height: 50px;
          fill: var(--svg-fill-color-c0c0c0) !important;
        }
      }

      img {
        width: 50px;
        height: 50px;
      }

      h3 {
        color: var(--font-color-000);
        font-size: 18px;
        line-height: 30px;
        margin: 0;
        font-weight: 600;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 14px;
        line-height: 20px;
        color: var(--font-color-000);
      }

      .tip-action {
        position: absolute;
        top: 12px;
        right: 24px;
        width: 12px;
        height: 12px;
        fill: var(--center-help-fill-color) !important;
      }

      .el-button {
        min-height: 40px !important;
      }
    }
  }

  &-chart {
    margin-top: 20px;

    &-tit {
      padding: 30px 20px 20px;
      font-weight: 500;
      font-size: 16px;
      color: var(--font-color-000);

      .el-select {
        margin-left: 20px;
        width: 104px;
        height: 32px;
      }
    }

    p {
      margin: 0;
      color: var(--font-color-000);
      font-size: 14px;
      font-weight: normal;
    }
  }
}
</style>
