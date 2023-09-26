<template>
  <div class="login-wrap">
    <Dialog v-model="show" width="500px" blockBtn customeClass="login-dialog" footerBtnWidth="380px"
      :confirmLoading="confirmLoading" @close="$store.commit('user/SET_LOGIN_DIALOG', false)" contentPadding="0"
      :serviceType="3" :showBtn="false" v-bind="$attrs">
      <el-tabs v-if="!resetPassword" v-model="activeName" @tab-click="tab => $emit('tabsChange', tab.props.name)">
        <el-tab-pane v-for="(tab, index) in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <slot :name="tab.slot || `tab${index + 1}`" />
        </el-tab-pane>
      </el-tabs>
      <p v-if="forgetpass && !resetPassword" class="login-dialog-forgetpass">
        <span @click="$dialog({ tpl: 'ForgetPassword' })">{{ $t("忘记密码") }}？</span>
      </p>
      <div class="dialog-footer-block-btn">
        <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">{{ $t('登录') }}</el-button>
        <el-button type="grey" @click="handleCancel">{{ $t('立即注册') }}
        </el-button>
      </div>
      <template v-slot:footerTips>
        <div class="layout-flex-center login-dialog-footerTips" :class="{ bottom: footerMargin }">
          <div class="layout-flex-center"
            @click="(close) => { $router.push('/'); $store.commit('user/SET_LOGIN_DIALOG', false) }">
            <svg-icon name="come" />
            <span>{{ $t("再逛逛吧") }}</span>
          </div>
          <div class="layout-flex-center" @click="$openKefu">
            <svg-icon name="customer" />
            <span>{{ $t("专属客服") }}</span>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, ref,
} from 'vue';
import Dialog from '@/components/Dialog/index.vue';
import FooterService from '@/components/FooterService/index.vue';

const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');

const resetPassword = ref(false);

const props = defineProps({
  footerMargin: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: false,
  },
  tabs: {
    type: Array,
    default: () => [],
  },
  activeName: {
    type: String,
    default: '',
  },
  forgetpass: {
    type: Boolean,
    default: true,
  },
  forgetpassUsername: {
    type: String,
    default: '',
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  handleConfirm: {
    type: Function,
    default: () => { },
  },
  handleClose: {
    type: Function,
    default: () => { },
  },
});

const emit = defineEmits(['onConfirm']);
function handleConfirm() {
  emit('onConfirm');
}

function onClose() {
  console.log(1);
  resetPassword.value = false;

  if (props.handleClose) {
    console.log(23);
    props.handleClose();
  }
}

function handleCancel() {
  $store.commit('user/SET_LOGIN_DIALOG', false);
  if (subConfig?.hasRegDialog) {
    $store.commit('user/SET_REGISTER_DIALOG', true);
  } else {
    global.$router.push('/register');
  }
}

const width = props.tabs.length === 2 ? '190px' : '130px';
</script>

<style lang="scss" scoped>
.login-wrap {
  :deep(.login-dialog) {
    box-sizing: border-box;
    height: 550px;
    background-position: left top;
    border-radius: 0;

    .el-dialog__header {
      height: 0;

      .el-dialog__headerbtn {
        border: 0;

        i {
          color: var(--font-color-ccc) !important;
          font-size: 18px;
        }
      }
    }

    .el-dialog__footer {
      display: block;
      padding-left: 60px;
      padding-right: 60px;
    }

    .el-dialog__body {
      padding: 0;

      .el-tabs__content {
        overflow: inherit !important;
      }
    }

    .dialog-footer-block-btn {
      .el-button--default {
        background-color: var(--area-color) !important;
        border: 0;
        color: var(--font-color-ccc) !important;
      }

      .el-button {
        height: 50px;
      }
    }

    .login-dialog-forgetpass {
      width: 380px;
      margin: 0 auto 10px;
      text-align: right;

      span {
        cursor: pointer;
        color: var(--cur-font-color-fff);

        &:hover {
          color: var(--theme-color);
        }
      }
    }

    .login-dialog-footerTips {
      color: var(--font-color-ccc);
      margin-top: 20px;
      font-size: 14px;

      &.bottom {
        margin-top: 67px;
      }

      svg {
        fill: var(--font-color-ccc);
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }

      >div {
        padding: 0 25px;
        cursor: pointer;

        &:hover {
          color: var(--theme-color);

          svg {
            fill: var(--theme-color);
          }
        }

        &:first-child {
          border-right: 1px solid var(--bg-color-f5f5f5);
        }
      }
    }

    .dialog-footer-block-btn {
      .el-button {
        display: block;
        width: 380px;
        margin: 20px auto;
      }
    }
  }

  :deep(.el-form) {
    .el-form-item {
      width: 380px;
      margin: 0 auto 20px;

      .el-input__prefix {
        width: 47px;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .svg-icon {
          fill: var(--font-color-fff);
          width: 22px;
          height: 22px;
        }
      }

      .el-input__inner {
        background-color: var(--input-bg-color-191919);
        font-size: 14px;
        padding-left: 47px;
        height: 50px !important;
      }

      .phone-area-code {
        >.el-input {
          >.el-input__inner {
            padding-left: 130px;
          }

          >.el-input__prefix {
            width: 118px;

            >.svg-icon {
              position: absolute;
              left: 0;
              top: 15px;
              z-index: 2;
              width: 47px;
            }

            .el-icon-plus {
              position: absolute;
              left: 38px;
              top: 19px;
              z-index: 2;
              font-size: 14px;
              color: var(--font-color-000);
            }

            .line {
              position: absolute;
              left: 120px;
              height: 20px;
              z-index: 2;
              top: 15px;
              width: 1px;
              background-color: var(--bg-color-525152);
            }

            .el-select {
              width: 118px;
              box-sizing: border-box;

              .el-input__inner {
                padding-left: 52px;
                height: 42px !important;
                margin: 1px 0 0 1px;
                border: 0 !important;
              }

              .el-select__caret {
                color: var(--font-color-000);
              }
            }

            .el-input__suffix {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }

  .el-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 30px;

      .el-tabs__nav {
        width: 380px;
        margin: 0 auto;
        float: initial;

        .el-tabs__active-bar {
          height: 2px;
        }

        .el-tabs__item {
          width: v-bind(width);
          text-align: center;
          height: 85px;
          line-height: 1.2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          font-size: 16px;
          color: var(--font-color-fff-6);
          opacity: 0.5;
          padding-top: 0 !important;

          &.is-active {
            color: var(--theme-color);
            font-size: 18px;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
