<template>
  <div class="game-list-wrap">
    <div class="game-list-wrap-title">
      <span>{{ $t('游戏大厅') }}</span>
      <el-tooltip :append-to-body='false' :content="$t('不同游戏类型标识共享钱包时游戏余额共享')" effect="dark" placement="bottom">
        <i class="el-icon-question" />
      </el-tooltip>
      <div class="right-btn">
        <el-button :loading="user.uploadWalletLoading" @click="refreshMoney" type="grey">{{ $t('刷新余额') }}</el-button>
        <el-button :loading="backTransallLoading" type="primary" @click="backTransallRun">{{ $t('一键回收余额') }}</el-button>
      </div>
    </div>
    <div class="game-list-wrap-items">
      <div v-for="item in list" :key="item.game_cate_id" @click="openDialog(item)">
        <p>
          <svg-icon :name="'ucenter-' + svgConfig[item.game_cate_id]" :size="20" />
          <span>{{ $t(item.name) }}</span>
        </p>
        <p>
          <span v-money="user.walletInfo[`cate_${item.game_cate_id}_money`]"></span>
          <i class="el-icon-refresh" v-refresh="user.uploadWalletLoading" @click.stop="refreshMoney" />
        </p>
      </div>
    </div>
    <Dialog v-model="dialogInfo.visible" :title="dialogInfo.name" titleBottomBorder titleLeftBorder title-padding="20px"
      content-padding="20px 20px" @close="close => { dialogInfo.name = ''; dialogInfo.visible = false; close() }"
      :showBtn="false" width="520px">
      <div class="game-list-wrap-sub-wrap">
        <div class="subitem" v-for="item in dialogInfo.list" :key="item.id">
          <div :style="{ 'background-image': `url(${iconImg(item.name)})` }">
            <!-- <img :src="iconImg(item.name)" /> -->
          </div>
          <i class="line"></i>
          <p>
            <span>{{ item.name }}</span>
            <span v-money="user.walletInfo[`${item.money_code}`]"></span>
          </p>
          <el-tooltip :append-to-body='false' v-if="item.status === 2" :content="$t('维护中')">
            <img src="@/assets/images/center/transfer/under-fix.png" alt class="under-fix" />
          </el-tooltip>
          <el-tooltip :append-to-body='false' v-if="walletObj[item.money_code]?.length > 1"
            :content="`(${walletObj[item.money_code].join(' + ')}) ${$t('余额共享')}`">
            <svg-icon name="tag0" v-if="walletArr.indexOf(item.money_code) === 0" />
            <span v-else :class="`tag-${walletArr.indexOf(item.money_code)}`"></span>
          </el-tooltip>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, computed, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { backtransall } from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';

const global = inject('global');
const $store = inject('store');
const { user, app } = global.$store.state;

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  canRefresh: {
    type: Boolean,
    default: false,
  },
});

const svgConfig = {
  1: 'casino',
  2: 'slots',
  3: 'fishing',
  4: 'sports',
  5: 'lottery',
  7: 'chess',
  8: 'esports',
};

function refreshMoney() {
  global.$store.dispatch('user/getWalletInfo');
  $store.dispatch('app/getDict', 'platformgameidsv2');
}

const dialogInfo = reactive({
  visible: false,
  name: '',
  list: [],
  listData: [],
});

function openDialog(item) {
  dialogInfo.visible = true;
  dialogInfo.item = item;
  dialogInfo.name = item.name;
  dialogInfo.list = item.list_data.filter((child) => child.status !== 2);
}

const walletObj = computed(() => app.dicts?.platformgameidsv2
  ?.reduce((curr, next) => {
    next.platform_list.forEach(({ name, money_code }) => {
      if (!(['gm_ag_money', 'gm_bbin_money'].includes(money_code))) {
        if (curr[money_code]) {
          curr[money_code].push(`${next.name}${name}`);
        } else {
          curr[money_code] = [`${next.name}${name}`];
        }
      }
    });
    return curr;
  }, {}));

const walletArr = computed(() => Object.entries(walletObj.value)
  .filter(([key, values]) => values.length > 1)
  .map(([key]) => key));

const { run: backTransallRun, loading: backTransallLoading } = useRequest(backtransall, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('收回余额成功'));
    refreshMoney();
  },
});

watch(() => props.canRefresh, () => {
  if (props.canRefresh) {
    refreshMoney();
  }
});

function iconImg(name) {
  const str = name?.split('(')?.[0] ?? '';
  const isDarkTheme = global.$store.state.app.darkTheme;
  return global.$getSrc(`/src/assets/images/plateform-icons/${str.toUpperCase()}@2x.png`);
}

</script>

<style lang="scss" scoped>
.game-list-wrap {
  min-height: 150px;
  margin-top: 20px;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid var(--border-color-e2e2e2);
  box-sizing: border-box;
  background-color: var(--block-bg-color);

  &-title {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: var(--font-color-f5f5f5);

    .el-icon-question {
      color: var(--theme-color);
      margin-left: 5px;
    }

    .right-btn {
      margin-left: auto;

      .el-button--grey {
        color: var(--font-color-000) !important;
      }
    }
  }

  &-items {
    display: flex;
    flex-wrap: wrap;
    margin: 30px -20px 0 0;

    >div {
      width: 220px;
      height: 100px;
      margin: 0 20px 20px 0;
      border-radius: 6px;
      background: var(--cur-bg-color-0e233b, var(--theme-color));
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background-color: var(--bg-color-0df5b9);
      }

      .svg-icon {
        fill: var(--font-color-fff) !important;
      }

      &:nth-child(4n) {
        margin-right: 0;
      }

      p {
        display: flex;
        align-items: center;
        padding: 0 20px;
        margin: 0;
        width: 100%;
        box-sizing: border-box;

        span {
          padding-left: 5px;
          color: var(--font-color-fff);
          font-family: moneyFont;
        }

        &:last-child {
          justify-content: space-between;
          margin: 0;

          i {
            cursor: pointer;
            font-size: 18px;
          }
        }
      }

      i {
        color: var(--font-color-fff);
      }
    }
  }

  &-sub-wrap {
    display: flex;
    flex-wrap: wrap;

    .subitem {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 230px;
      height: 60px;
      background: var(--dark-font-color-000, var(--bg-color-ececec));
      border-radius: 6px;
      margin: 0 20px 20px 0;
      padding: 0 20px 0 0;
      position: relative;

      i {
        width: 1px;
        height: 60px;
        background: var(--dark-theme-border-fff-1, var(--bg-color-000-1));
      }

      &:nth-child(2n) {
        margin-right: 0;
      }

      div {
        width: 80px;
        height: 60px;
        background-size: auto 40px;
        background-repeat: no-repeat;
        background-position: center center;
      }

      // img {
      //   max-width: 32px;
      //   image-rendering: crisp-edges;
      //   image-rendering: -webkit-optimize-contrast;
      // }

      .icon-share {
        position: absolute;
        width: 50px;
        top: 0;
        right: 0;
      }

      >span,
      .svg-icon {
        position: absolute;
        width: 51px;
        height: 24px;
        top: 0;
        right: 0;
        background-size: 100% auto;
        fill: var(--theme-color) !important;

        &.tag-1 {
          background-image: url('@/assets/images/center/transfer/share5.png');
        }

        &.tag-2 {
          background-image: url('@/assets/images/center/transfer/share2.png');
        }

        &.tag-3 {
          background-image: url('@/assets/images/center/transfer/share3.png');
        }

        &.tag-4 {
          background-image: url('@/assets/images/center/transfer/share4.png');
        }
      }

      .under-fix {
        position: absolute;
        right: 0;
        top: 0;
        width: 51px;
      }

      >p {
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--border-color-282828);
        padding-left: 20px;
        margin: 0;

        span {
          font-size: 12px;
          color: var(--font-color-999);

          &:last-child {
            color: var(--font-color-000);
            font-size: 16px;
            line-height: 1;
            height: 30px;
            margin-top: -10px;
          }
        }
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding-bottom: 10px;
}

:deep(.el-dialog__footer) {
  display: none;
}
</style>
