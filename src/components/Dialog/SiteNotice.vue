<template>
  <div>
    <Dialog ref="dialogRef" v-model="modelValue" width="540px" titlePadding="0" customeClass="sitenotice-dialog"
      :showCancelBtn="false" :showConfirmBtn="false">
      <template #title>
        <div class="dialog-header-wrap"
          :style="{ 'background-image': `url(${$getSrc('/src/assets/images/site-notice/head-bg.png')})` }">
          <img class="header-bell" :src="$getSrc('/src/assets/images/site-notice/bell.png')" alt="">
          <div class="header-title">{{ $t('重要公告') }}</div>
        </div>
      </template>
      <div class="dialog-content-wrap" @mouseenter="handleEnter" @mouseleave="handleLeave">
        <!-- <div v-if="notice && notice.length === 1">
          <div
            v-for="item in notice"
            :key="item.id"
          >
            <div class="content">
              <div
                class="content-item"
                @click="readNotice(item)"
              >
                <div class="content-title">{{ item.title }}</div>
                <p class="content-desc">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div> -->
        <el-carousel :interval="3000" height="192px" autoplay v-if="notice && notice.length" arrow="never">
          <el-carousel-item v-for="item in notice" :key="item.id">
            <div class="content">
              <div class="content-item" @click="readNotice(item)">
                <div class="content-title">{{ item.title }}</div>
                <p class="content-desc">{{ item.content }}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="content-btn">
          <el-button type="primary" @click="handleClose" class="but">{{ `${$t('确认')}` }}（<em>{{ `${seconds}s` }}</em> ）
          </el-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from './index.vue';

const dialogRef = ref();

const seconds = ref(0);
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  notice: {
    type: Array,
    default: () => ([]),
  },
  callback: {
    type: Function,
    default() {
      return 'Default function';
    },
  },
});
const $router = useRouter();
let closeTimer = null;

function handleClose() {
  dialogRef.value.handleCancel();
  props?.callback();
}

function readNotice(item) {
  if (!user?.isLogin) {
    global.$message.warning(global.$t('请登录后，查看'));
    return;
  }
  $router.push({ name: 'centerNotice' });
  clearInterval(closeTimer);
  handleClose();
}

function handleEnter() {
  clearInterval(closeTimer);
}
function handleLeave() {
  startCloseTimer();
}

function startCloseTimer() {
  closeTimer = setInterval(() => {
    if (seconds.value <= 0) {
      clearInterval(closeTimer);
      handleClose();
      return;
    }
    seconds.value -= 1;
  }, 1000);
}

onMounted(() => {
  seconds.value = 10;
  startCloseTimer();
});
onUnmounted(() => {
  clearInterval(closeTimer);
});

</script>

<style lang="scss">
.sitenotice-dialog {
  &.el-dialog {
    border-radius: 16px !important;

    .el-dialog__headerbtn {
      font-size: 20px;
      opacity: 0.5;

      i {
        color: var(--font-color-fff) !important;
      }
    }
  }

  .dialog-header-wrap {
    height: 140px;
    background-size: 100% auto;
    text-align: center;
    color: var(--font-color-fff);
    padding-top: 77px;
    box-sizing: border-box;
    font-size: 32px;
    font-weight: bold;

    .header-bell {
      position: absolute;
      width: 70px;
      left: 50%;
      transform: translateX(-50%);
      top: -18px;
    }
  }

  .el-dialog__footer {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;

  &-item {
    height: 200px;
    color: var(--font-color-606266);
    flex: 1;
    padding-left: 32px;
  }

  &-title {
    font-size: 22px;
    position: relative;
    font-weight: bold;

    &::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: var(--theme-color);
      transform: rotate(45deg);
      left: -30px;
      top: 50%;
      margin-top: -6px;
    }
  }

  &-desc {
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    cursor: pointer;
    line-height: 25px;
  }
}

.content-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  .but {
    width: 368px;
    height: 62px;
    border-radius: 50px;
    margin-top: 20px;
  }

  em {
    font-style: normal;
  }
}

:deep(.el-carousel__indicator--horizontal button) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--theme-color);
  padding: 0;
}
</style>
