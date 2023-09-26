<template>
  <div class="layout-block center-home-wrap-user">
    <!-- <img
      :src="$getSrc('/src/assets/images/center/home/avatar@2x.png')"
      class="center-home-wrap-user-avatar"
      alt
    /> -->
    <div class="center-home-wrap-user-headpic">
      <svg-icon
        name="icon_home_touxiang"
        class="center-home-wrap-user-avatar"
      />
    </div>
    <div class="center-home-wrap-user-detail">
      <h2 class="layout-flex-center name">
        <span>{{ user?.userInfo?.nickname || user?.userInfo?.username }}</span>
        <svg-icon :name="`login-vip-${user?.userInfo?.level ?? 0}`" />
        <img
          :src="$getSrc(`/src/assets/images/header/${userFlag}.png`)"
          alt
        />
      </h2>
      <div class="info-wrap">
        <div class="last-login">
          <span>{{ $t('上次登录') }}：{{ user?.userInfo?.last_login_ip_area }}</span>

          <p v-if="!isMaxLevel">
            <span v-space="$t('所需')"></span>
            <span v-space="$t('存款')"></span>
            <span>{{ depositMoney }}</span>
            <span v-space="$t('和')"></span>
            <span v-space="$t('流水')"></span>
            <span v-space="validBet"></span>
          </p>
          <p v-else>{{ $t('尊敬的会员您已是最高等级') }}</p>
        </div>
        <div class="bet-info">
          <span>{{ $t('累计投注') }}</span>
          <!-- bug#19533 取值由user.userInfo.validBet 改为 user.walletInfo.valid_bet -->
          <span
            class="money"
            v-money="user.walletInfo.valid_bet"
          ></span>
        </div>
      </div>
      <div
        class="layout-flex-center progress-wrap"
        v-if="!isMaxLevel"
      >
        <div class="progress-wrap-bar">
          <i
            class="progress-wrap-bar-inner"
            :style="{ width: progressWidth }"
          />
        </div>
      </div>

      <div
        class="gift-wrap"
        v-if="!isMaxLevel"
      >
        <div
          class="update-gift"
          @click="$router.push({name: 'vip'})"
        >
          {{$t('升级福利')}} <i class="el-icon-arrow-right"></i>
        </div>
        <svg-icon :name="`login-vip-${user?.userInfo?.level + 1 ?? 0}`" />

      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { memberlevellist } from '@/api/dicts';

const $store = inject('store');
const { user } = $store.state;

const userFlag = computed(() => {
  if (user?.userInfo?.region === 'Vn') {
    return 'vi';
  }
  return user?.userInfo?.region?.toLowerCase?.();
});

const validBet = ref(0);
const depositMoney = ref(0);
const progressWidth = ref(0);
const isMaxLevel = ref(false);

useRequest(memberlevellist, {
  manual: false,
  onSuccess(levelSetting) {
    const { level } = user.userInfo;
    isMaxLevel.value = levelSetting?.[levelSetting.length - 1]?.level <= level;

    levelSetting.forEach((list) => {
      if (list.level === level + 1) {
        depositMoney.value = list.need_deposit_money;
        validBet.value = list.need_valid_bet;

        const betPercent = (list.valid_bet_money - list.need_valid_bet) / list.valid_bet_money;
        const depostPercent = (list.deposit_money - list.need_deposit_money) / list.deposit_money;
        progressWidth.value = `${((betPercent + depostPercent) / 2) * 100}%`;
      }
    });
  },
});
</script>

<style lang="scss" scoped>
.center-home-wrap-user {
  padding: 20px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  position: relative;

  &-headpic {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--theme-color);
    margin-right: 20px;
    text-align: center;

    .svg-icon {
      width: 50%;
    }
  }

  &-avatar {
    width: 80px;
    height: 80px;
    fill: var(--user-avatar-color) !important;
  }

  &-detail {
    flex: 1;
    text-align: left;

    .name {
      font-size: 16px;
      color: var(--font-color-000);
      font-weight: 600;
      justify-content: flex-start;
      margin: 0 0 6px;

      .svg-icon {
        width: 40px;
        height: 13px;
        margin-left: 3px;
        fill: var(--theme-color) !important;
      }

      img {
        width: 18px;
        margin-left: 8px;
      }
    }

    .info-wrap {
      display: flex;
      justify-content: space-between;
    }

    .bet-info {
      font-size: 12px;
      span {
        color: var(--font-color-000);
        display: block;
        text-align: right;
        white-space: nowrap;
      }
      .money {
        color: var(--theme-color) !important;
        font-family: moneyFont;
        font-size: 14px !important;
        height: 20px;
        font-weight: bold;
        margin-top: 4px;
        :deep(.wrap-money-currency) {
          line-height: 20px;
        }
      }
    }

    .last-login {
      font-size: 12px;
      color: var(--font-color-070707);
      overflow: hidden;
      margin-top: 3px;

      i {
        font-style: normal;
        color: var(--font-color-000);
        font-weight: 600;
        font-family: moneyFont;
        font-size: 12px !important;
      }

      &-right {
        width: 100%;
        font-size: 12px;
        box-sizing: border-box;
        color: var(--font-color-070707);
        display: block;
        span {
          display: inline;
        }
      }
    }

    p {
      margin: 0;
      margin-top: 8px;
      color: var(--font-color-666);
    }

    .progress-wrap {
      margin-top: 8px;
      &-bar {
        flex: 1;
        height: 5px;
        border-radius: 2.5px;
        background-color: var(--bg-color-f3f3f3);
        position: relative;
        z-index: 1;

        &-inner {
          position: relative;
          display: block;
          width: 20%;
          height: 100%;
          background-color: var(--theme-color);
          border-radius: 3px;
          transition: all 0.45s ease-out;
        }
      }
    }
  }
}

.gift-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  .svg-icon {
    width: 50px;
    height: 17px;
    fill: var(--theme-color) !important;
  }

  .update-gift {
    height: 17px;
    color: var(--font-color-fff);
    background-color: var(--theme-color);
    border-radius: 8.5px;
    font-size: 12px;
    line-height: 17px;
    padding: 0 6px;
    cursor: pointer;
  }
}
</style>
