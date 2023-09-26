<template>
  <Dialog ref="dialogRef" :title="$t('额度转账')" v-model="modelValue" center titlePadding="40px 0 0"
    contentPadding="0 40px" :showBtn="false" confirmType="grey" :confirmText="$t('进入旁观')" @onConfirm="goPlay" @onClose="close => {
      $router.push({ name: 'centerDeposit' })
      close()
    }" cancelType="primary" :cancelText="$t('确认转账并进入游戏')" footerBtnWidth="205px">
    <div id="transferPop">
      <div class="center">
        <el-form ref="formRef" :model="data.form" :rules="data.rules" class="form">
          <el-form-item class="account">
            <div class="multiple">
              <p class="title out">{{ outName }}</p>
              <p class="title in">{{ toName }}</p>
            </div>
            <div class="multiple">
              <span class="transfer-symbol l">{{ user.currencySymbol }}</span>
              <span class="transfer-symbol r">{{ user.currencySymbol }}</span>
              <el-cascader v-model="data.from" class="tall" :placeholder="$t('中心钱包')" :props="optionProps"
                :options="data.platforms" @change="onFromChange" prefix-icon="el-icon-date" :show-all-levels="false">
                <template #default="{ data }">
                  <span>{{ data.name }}({{ data.game_platform_name }})</span>
                </template>
              </el-cascader>
              <!-- <img
                v-if="data.arrowStatus"
                class="pointer"
                :src="$getSrc('/src/assets/images/center/transfer/exchange@2x.png')"
                @click="exchange"
              /> -->
              <svg-icon name="exchange" v-if="data.arrowStatus" class="pointer" @click="exchange" />
              <!-- <img
                v-else
                class="pointer translate"
                :src="$getSrc('/src/assets/images/center/transfer/exchange@2x.png')"
                @click="exchange"
              /> -->
              <svg-icon name="exchange" v-else class="pointer translate" @click="exchange" />
              <el-cascader v-model="data.to" class="tall" :placeholder="$t('中心钱包')" :props="optionProps"
                :options="data.platforms" @change="onToChange" :show-all-levels="false">
                <template #default="{ data }">
                  <span>{{ data.name }}({{ data.game_platform_name }})</span>
                </template>
              </el-cascader>
            </div>
          </el-form-item>
          <p class="title">{{ $t('转入金额') }}</p>
          <el-form-item class="amount" prop="money">
            <el-input v-model="data.form.money" type="number" class="amount tall" :placeholder="$t('转入金额')"
              @change="onMoneyChange" @keyup="changeNumber">
              <template #prefix>
                <span>{{ user?.currencySymbol }}</span>
              </template>
              <template #append>
                <span @click="setAll">{{ $t('全部') }}</span>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <p
                class="help"
                @click="goHelp"
              >
        {{$t('查看新手教程')}}
      </p>-->
    </div>
    <template #footer>
      <template v-if="dialogType === 'back'">
        <el-button type="grey" @click="onSubmit" style="width: 205px">{{ $t('确定转账') }}</el-button>
        <el-button type="primary" @click="dialogRef.handleCancel()" style="width: 205px">{{ $t('关闭弹窗') }}</el-button>
      </template>
      <template v-else>
        <el-button type="grey" @click="goPlay" style="width: 205px">{{ $t('进入旁观') }}</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="onSubmit" style="width: 205px">{{ $t('确认') }}
        </el-button>
      </template>
    </template>
  </Dialog>
</template>

<script setup>
import {
  ref, inject, reactive, useAttrs, onMounted, toRaw, watchEffect, computed,
} from 'vue';
import Cookies from 'js-cookie';
import { trans } from '@/api/center';
import { createSocket, onCloseWS } from '@/plugins/socket';
// import { autotrans } from '@/api/channel'
import Dialog from './index.vue';
import { priceUnitTransform } from '@/utils/index';

const dialogRef = ref();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: String,
    default: '',
  },
});

const global = inject('global');
const $store = global.$store;

const formRef = ref(null);

// 进游戏相关
let gamePlayWin;
let gameCheckTimer;

const attrs = useAttrs();
const {
  at, cateId, gameId, platformId, dialogType, gameData, allMoney,
} = attrs;

const optionProps = {
  value: 'id',
  label: 'game_platform_name',
  children: 'platform_list',
  expandTrigger: 'hover',
};

const outName = ref(global.$t('中心钱包'));
const toName = ref('');
const data = reactive({
  form: {
    money: '',
    from: 0,
    to: 0,
    // fundPwd: ""
  },
  from: [],
  to: [],
  platforms: [
    {
      name: global.$t(`中心钱包`),
      game_cate_id: 0,
    },
  ],
  allMoney: 0,
  rules: {
    money: {
      required: true,
      message: global.$t('转账金额不能为空'),
      trigger: 'blur',
    },
  },
  dialogType: '',
  submitLoading: false,
  arrowStatus: true,
});

const { app: { dicts }, user } = $store.state;
const walletInfo = ref({});
// const { walletInfo } = $store.state.user;

onMounted(() => {
  global.$store.dispatch('app/getDict', ['allplatform', 'platformgameidsv2']).then(() => {
    const firstMoney = priceUnitTransform(walletInfo.value.money, true);
    data.platforms[0].game_platform_name = `${firstMoney.money + firstMoney.unit}`;
    // data.platforms[0].game_platform_name = `${data.platforms[0].name}(${firstMoney.money + firstMoney.unit})`;
    formatPlatform();
    // 处理转会逻辑
    if (dialogType === 'back') {
      data.form.from = platformId;
      data.from = platformId;
      data.to = [0];
      outName.value = getName([cateId, platformId]);
      // data.allMoney = allMoney
    } else {
      data.allMoney = walletInfo.value.money;
      data.from = [0];
      data.to = [cateId, platformId];
      data.form.to = platformId;
      outName.value = getName(data.from);
    }
    // console.log(data, 'data');
    toName.value = getName(data.to);
  });
});

watchEffect(() => {
  walletInfo.value = user.walletInfo;
});

const gameCheck = async () => {
  if (gameCheckTimer) {
    clearInterval(gameCheckTimer);
  }
  gameCheckTimer = setInterval(async () => {
    if (gamePlayWin?.closed && gameId) {
      console.log(`265=======>`);
      gamePlayWin = null;
      clearInterval(gameCheckTimer);
      $store.dispatch('user/getWalletInfo').then((res) => {
        walletInfo.value = res;
        // 窗口关闭，且存在gameId，表明是进了游戏再关闭了
        dicts?.platformgameidsv2.forEach((m) => {
          if (m.game_cate_id === cateId) {
            m.platform_list.forEach((n) => {
              if (n.id === platformId) {
                data.allMoney = walletInfo.value[n.money_code];
              }
            });
          }
        });
        // 未开启免转并且游戏额度大于10  // bug #19542 关闭游戏窗口，回到游戏页不需要弹出回收
        // if (walletInfo.value.is_auto_trans === 2 && data.allMoney * 1 > 10) {
        //   global.$dialog({
        //     tpl: 'TransferPop',
        //     gameId,
        //     platformId,
        //     cateId,
        //     at,
        //     dialogType: 'back',
        //   });
        //   return false;
        // }
      });
    }
  }, 5000);
};
function goPlay() {
  dialogRef.value.handleCancel();
  if (gameData.open_mode === 2 || props?.tag === 'PT') {
    gamePlayWin = window.open(gameData.url, 'gamePlayWin');
    gameCheck();
    return false;
  }
  const routeUrl = global.$router.resolve({
    // path: '/play',
    name: 'gamePlay',
    query: {
      url: encodeURIComponent(gameData.url),
      open_mode: gameData.open_mode,
      game_id: gameId,
      platform_id: platformId,
      cate_id: cateId,
      at,
    },
  });
  gamePlayWin = window.open(routeUrl.href, 'gamePlayWin');
  gameCheck();
}
function formatPlatform(lists) {
  const temp = JSON.parse(JSON.stringify(dicts?.platformgameidsv2));
  temp.forEach((item) => {
    item.platform_list.forEach((p) => {
      if (p.game_platform_name === global.$t('全部')) {
        item.platform_list.splice(0, 1);
      }
    });
  });
  temp.forEach((item) => {
    const money01 = priceUnitTransform(walletInfo.value[`cate_${item.game_cate_id}_money`] ?? '0', true);
    item.game_platform_name = `${money01.money + money01.unit}`;
    // item.game_platform_name = `${item.name}(${money01.money + money01.unit})`;
    item.game_platform_id = item.game_cate_id;
    item.platform_list.forEach((child) => {
      const money02 = priceUnitTransform(walletInfo.value[child.money_code] ?? '0', true);
      child.game_platform_name = `${money02.money + money02.unit}`;
      // child.game_platform_name = `${child.name}(${money02.money + money02.unit})`;
      if (child.id === platformId) {
        data.allMoney = walletInfo.value[child.money_code];
      }
    });
  });
  data.platforms = [...toRaw(data.platforms), ...temp].map((item) => ({ id: item.game_cate_id, ...item }));
}
function exchange() {
  data.arrowStatus = !data.arrowStatus;
  if (!data.arrowStatus) {
    onFromChange(data.to);
    onToChange(data.from);
  } else {
    onFromChange(data.from);
    onToChange(data.to);
  }
}
function onSubmit() {
  const { from: f, to: t } = data.form;
  // console.log(f, t, 'submit');
  if (!f && f !== 0) {
    return global.$message.warning(global.$t('请选择转出游戏账户类型'));
  }
  if (f !== 0 && t !== 0) {
    return global.$message.warning(global.$t('游戏平台间不能进行转账'));
  }
  if ((!t && t !== 0) || f === t) {
    return global.$message.warning(global.$t('请选择转入游戏账户类型'));
  }
  formRef.value.validate((valid) => {
    if (valid) {
      data.submitLoading = true;
      const { money, from, to } = data.form;
      const params = {
        money,
        from_platform_id: from,
        to_platform_id: to,
        game_cate_id: cateId,
      };
      trans(params)
        .then((res) => {
          global.$message.success(global.$t('转账成功'));
          data.form.money = '';
          data.from = [0];
          data.to = [0];
          global.$store.dispatch('user/getWalletInfo');
          if (dialogType !== 'back') goPlay();
        })
        .finally(() => {
          data.submitLoading = false;
          dialogRef.value.handleCancel();
        });
    }
  });
}
function onFromChange(value) {
  if (!value[0]) {
    data.allMoney = walletInfo.value.money;
  } else {
    dicts?.platformgameidsv2.forEach((m) => {
      if (m.game_cate_id === value[0]) {
        m.platform_list.forEach((n) => {
          if (n.id === value[1]) {
            data.allMoney = walletInfo.value[n.money_code];
          }
        });
      }
    });
  }
  const f = value.slice(-1);
  data.form.from = f[0];
  outName.value = getName(data.from);
}
function onToChange(value) {
  const t = value.slice(-1);
  data.form.to = t[0];
  toName.value = getName(data.to);
}
function onMoneyChange(value) {
  data.form.money = Math.floor(parseFloat(value));
}
function changeNumber() {
  const str = `${data.form.money}`;
  if (str.indexOf('.') !== -1) {
    const arr = str.split('');
    arr.splice(arr.length - 1);
    const str2 = arr.join('');
    data.form.money = +str2;
  }
}
function setAll() {
  data.form.money = Math.floor(data.allMoney);
}

function getName([cId, gId]) {
  if (cId) {
    const target = dicts?.platformgameidsv2?.find((item) => item.game_cate_id === cId);
    const cName = target?.list_data?.find((item) => (item.id === gId || item.default_game_id === attrs.gameId))?.name;
    return `${target?.name}/${cName}`;
  }
  return global.$t('中心钱包');
}

</script>

<style lang="scss" scoped>
#transferPop {
  :deep(.el-input, .tall) {
    .el-input__inner {
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      &[type='number'] {
        -moz-appearance: textfield;
      }
    }

    .el-input-group__append {
      background-color: var(--dark-color-000, var(--bg-color-ececec));
      color: var(--theme-color);
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 1px;
      height: 38px;
      line-height: 38px;
      padding: 0;
      border: 0;
      width: auto;

      &:hover {
        span {
          color: var(--theme-color);
        }
      }
    }
  }

  .title {
    font-size: 16px;
    color: var(--font-color-000);
    width: 189px;
    margin-bottom: 10px;

    &:last-child {
      margin-left: 50px;
    }
  }

  .multiple {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .title {
      margin-bottom: 0;
    }

    :deep(.el-cascader) {
      .el-input__inner {
        padding-left: 25px;
      }
    }

    .transfer-symbol {
      position: absolute;
      top: 0;
      line-height: 45px;
      z-index: 10;
      font-size: 16px;
      color: var(--font-color-000);

      &.l {
        left: 10px;
      }

      &.r {
        left: 245px;
      }
    }
  }

  .svg-icon {
    width: 22px;
    height: 22px;
    margin: 0 10px;
  }

  .translate {
    transform: rotate(180deg);
  }

  .tall.el-cascader {
    width: 200px;
    flex: none;
  }

  :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
    padding-left: 5px;
    color: var(--font-color-000);
  }

  :deep(.el-dialog__footer) {
    margin-top: 0;

    .el-button {
      width: 205px;
    }
  }
}
</style>
