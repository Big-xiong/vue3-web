<template>
  <Dialog width="500px" v-model="modelValue" :title="$t(`{0} 条款`, [subConfig.title])" center @onClose="
    (close) => {
      close();
    }
  " :showBtn="false" customeClass="register_terms-wrap" titlePadding="0" contentPadding="27px 60px">
    <div class="content" v-html="textData ?? ''"></div>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive, ref, watch, computed, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Dialog from '@/components/Dialog/index.vue';
import { getMemberProtocol } from '@/utils/importFiles';

const subConfig = inject('subConfig');

const { data: textData } = useRequest(getMemberProtocol, {
  formatResult: (res) => res.replaceAll('\n', '<br>'),
});

</script>

<style lang="scss">
.register_terms-wrap {
  border-radius: 6px !important;
  margin: 0 auto !important;
  top: 50%;
  transform: translateY(-50%);
  animation: none !important;

  .el-dialog__header {
    background-color: var(--theme-color);
    border-radius: 6px 6px 0 0;
    height: 46px;

    .el-dialog-title {
      font-size: 18px;
      color: var(--font-color-fff);
      line-height: 46px;
    }

    .el-dialog__headerbtn {
      top: 15px;

      .el-dialog__close {
        color: var(--font-color-fff);
      }
    }
  }

  .el-dialog__footer {
    display: none;
  }

  .content {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    line-height: 1.6;
    word-break: keep-all;
  }
}
</style>
