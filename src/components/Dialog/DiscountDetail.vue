<template>
  <Dialog :title="title" v-model="modelValue" width="1007px" titlePadding="0" customeClass="discount-detail-dialog"
    :confirmText="$t('立即申请')" :showCancelBtn="false" :showConfirmBtn="false" v-bind="$attrs" contentPadding="0">
    <div class="discount-content" v-loading="loading">
      <p class="discount-content-title">{{ name }}</p>
      <div v-html="content" class="discount-content-detail"></div>
      <div class="discount-detail-empty" v-if="!loading && !content?.length">
        <svg-icon class="svg-icon-empty" name="empty" />
        <p>{{ $t(`暂无内容`) }}</p>
      </div>
    </div>
    <div class="footer-btn" v-if="showBtn && (option === 1 || option === 2)">
      <el-button type="primary" v-if="!user?.isLogin" @click="() => {
        $emit('update:modelValue', false)
        modelValue = false;
        $router.push({ name: 'register' })
      }">{{ $t('登录注册') }}</el-button>
      <el-button type="primary" v-else-if="option === 1" @click="() => {
        $emit('update:modelValue', false)
        modelValue = false;
        $router.push({ name: '', params: { title: $t('存款') } })
      }">{{ $t('去存款') }}</el-button>
      <el-button type="primary" v-else-if="option === 2" @click="getWelfare">{{ $t('领取福利') }}</el-button>
    </div>
  </Dialog>
</template>

<script setup>

import {
  inject, reactive, ref, watch, onMounted, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Dialog from './index.vue';
import { getactivityaward } from '@/api/active';

const global = inject('global');
const { user } = global.$store.state;
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: null,
  },
  option: {
    type: Number,
    default: 3,
  },
  id: {
    type: Number,
    default: 0,
  },
  showBtn: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(true);

onMounted(() => {
  watchEffect(() => {
    if (props.content !== null || !props?.content?.length) {
      loading.value = false;
    }
  });
});

function apply(close) {
  close();
  // global.$router.push('/');
}

const { run } = useRequest(getactivityaward, { manual: true, onSuccess() { global.$message.success(global.$t('已成功领取活动！')); } });
function getWelfare() {
  run({ id: props.id });
}

</script>

<style lang="scss" scoped>
.discount-content {
  min-height: 400px;
  position: relative;
  padding-bottom: 30px;
  padding: 20px 40px;
  color: var(--font-color-404040);

  &-title {
    text-align: left;
    opacity: 1;
    font-size: 20px;
    font-weight: 700;
    color: var(--font-color-404040);
    line-height: 30px;
    margin: 5px 0 10px;
  }

  :deep(table) {
    border-collapse: collapse;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    border-style: solid !important;
    color: var(--font-color-333);

    tbody tr:first-child {
      background-color: var(--theme-color) !important;

      td {
        color: var(--font-color-fff);
        border-color: var(--theme-color);

        &:not(:last-child) {
          border-right-color: var(--border-color-000-1);
        }
      }

      p {
        color: var(--font-color-fff);
      }
    }

    p {
      margin: 0;
      font-size: 16px;
      color: var(--font-color-404040);
    }

    td {
      border: 1px solid var(--border-color-000-1);
      height: 46px !important;
    }
  }

  :deep(p) {
    color: var(--font-color-333);
  }

  .svg-icon-empty {
    width: 100px;
    height: 100px;
    fill: var(--theme-color) !important;
  }

  &-detail {
    line-height: 2;
  }

  .discount-detail-empty {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 126px;
    }

    p {
      font-size: 20px;
      color: var(--font-color-404040);
      margin: 20px 0;
    }
  }
}

.footer-btn {
  padding: 12px 0;
  min-width: 142px;
  box-shadow: 0px -2px 2px 0px var(--discount-border-color-000);
}
</style>

<style lang="scss">
.discount-detail-dialog {
  border-radius: 0;

  .el-dialog__header {
    height: 47px;
    line-height: 47px;
    font-size: 16px;
  }

  .el-dialog__headerbtn {
    width: 20px;
    height: 20px;
    top: 18px;

    i {
      font-size: 16px;
    }
  }

  .discount-content {
    max-height: 400px;
    overflow-y: auto;
  }
}

.footer-btn {
  text-align: center;
}
</style>
