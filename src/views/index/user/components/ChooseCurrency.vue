<template>
  <Dialog :title="$t('请选择您使用的货币？')" :model-value="modelValue && hasCurrencyData" width="520px" titlePadding="0"
    customeClass="discount-detail-dialog choose-currency-dialog" :confirmText="$t('立即申请')" :showCancelBtn="false"
    :showConfirmBtn="false" v-bind="$attrs" contentPadding="25px 40px 15px" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false">
    <p class="tips">{{ $t('在注册前，请务必选择您使用的货币信息') }}</p>
    <el-form ref="form" :rules="formRule" :model="formData" label-position="left" label-width="65px">
      <el-form-item :label="$t('地区')">
        <el-select v-model="mobileForm.inte_region_id" :placeholder="$t('请选择地区')" class="select-area-pic">
          <template #prefix>
            <img src="@/assets/images/header/th.png" alt v-show="mobileForm.inte_region_id === 2" />
            <img src="@/assets/images/header/vi.png" alt v-show="mobileForm.inte_region_id === 3" />
          </template>
          <el-option v-for="item in regionOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('货币')">
        <el-select v-model="mobileForm.inte_currency_id" :placeholder="$t('请选择货币类型')"
          :disabled="!currencyOption?.length">
          <el-option v-for="item in currencyOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmCurrency">{{ $t('确定') }}</el-button>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive, computed, watch, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { siteinfo } from '@/api/dicts';
import Dialog from '@/components/Dialog/index.vue';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
const { user } = $store.state;

const hasCurrencyData = ref(false);

const mobileForm = reactive({
  inte_region_id: 0,
  inte_currency_id: 0,
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  registerType: {
    type: Number,
    default: 1,
  },
});

const registerType = ref(props?.registerType);

$store.dispatch('app/getDict', 'regionlist')
  .then((res) => {
    hasCurrencyData.value = true;
    mobileForm.inte_region_id = res?.find((item) => item.is_default === 1)?.id ?? '';
  });

const regionOption = computed(() => dicts?.regionlist ?? []);
const currencyOption = computed(() => getCurrencyId(mobileForm.inte_region_id)?.list?.filter((item) => item.status === 1));

function getCurrencyId(id) {
  return dicts?.regionlist?.find((item) => item.id === id)?.currency_conf;
}

const { run: getSiteInfo } = useRequest(() => siteinfo(mobileForm), {
  manual: false,
  onSuccess(res) {
    registerType.value = Number(res?.pc_register_setting?.username_register ?? 1);
  },
});

watch(() => mobileForm.inte_region_id, () => {
  mobileForm.inte_currency_id = getCurrencyId(mobileForm.inte_region_id)?.default.id;
  getSiteInfo();
});

const emit = defineEmits(['confirmCurrency']);
function confirmCurrency() {
  emit('confirmCurrency', { ...mobileForm, registerType: registerType.value });
}

</script>

<style lang="scss">
.el-dialog.choose-currency-dialog {
  border-radius: 0;

  .el-dialog__header {
    border-radius: 0;
  }
}
</style>

<style lang="scss" scoped>
.el-dialog.choose-currency-dialog {
  border-radius: 0;

  .el-form {
    :deep(.el-form-item__content > .el-select) {
      width: 360px;
    }

    :deep(.el-form-item) {
      align-items: center;
    }

    :deep(.el-input__inner) {
      background-color: transparent;
      border: 1px solid var(--border-color-efefef);
      border-radius: 0;
      height: 32px;
      font-size: 12px;
    }

    :deep(.el-input__suffix),
    :deep(.el-select__caret) {
      line-height: 32px;
    }

    :deep(.el-form-item__label) {
      font-size: 14px;
      font-weight: normal;
      padding-right: 0;

      &:before {
        content: none !important;
      }
    }

    .el-button--primary {
      width: 100%;
      min-height: 32px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
      padding-top: 8px;
    }

    .form-phoneselect {
      .el-input__inner {
        padding-left: 95px;
      }

      .el-icon-plus {
        margin-left: 10px;
        color: var(--font-color-333);
      }

      .el-select {
        width: 65px;

        .el-input__inner {
          width: 100%;
          border: 0;
          padding: 0 20px 0 0;
          box-sizing: border-box;
        }
      }
    }
  }

  .tips {
    font-size: 18px;
    color: var(--font-color-333);
    margin: 0 0 20px;
  }

  .select-area-pic {
    img {
      width: 14px;
      margin-left: 5px;
    }

    :deep(.el-input) {
      >.el-input__inner {
        padding-left: 29px !important;
      }
    }
  }
}
</style>
