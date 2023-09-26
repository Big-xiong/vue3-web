<template>
  <div class="digital-offline-wrap" :style="{ marginBottom: methodInfo.hash_switch === 1 ? '70px' : '20px' }">
    <div class="qrcode-wrap">
      <div class="img-wrap">
        <img :src="methodInfo.pay_qrcode_url" alt="">
      </div>
      <div class="download-wrap" @click="downloadIamge">
        <i class="el-icon-download" />
        {{ $t('下载二维码') }}
      </div>
      <div class="text">{{ $t('链名称') }}：{{ methodInfo.support_protocol?.[0] ?? '' }}</div>
      <div class="text" v-clipboard:copy="methodInfo.recive_wallet_hash"
        v-clipboard:success="() => $message.success($t('复制成功'))">{{ $t('充值地址') }}：{{ methodInfo.recive_wallet_hash }}
        <i class="el-icon-copy-document" />
      </div>
    </div>

    <div class="hash-wrap" v-if="methodInfo.hash_switch === 1">
      <el-input type="text" v-model="hashValue" :placeholder="$t('充值后请把哈希值输入提交')">
        <template v-slot:suffix>
          <span class="paste-btn" @click="paste">{{ $t('粘贴') }}</span>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { saveAs } from 'file-saver';
import { getClipboardText } from '@/utils';
import axios from 'axios';

const props = defineProps({
  methodInfo: {
    default: () => ({}),
    type: Object,
  },
  hash: {
    default: '',
    type: String,
  },
  qrCodeUrl: {
    default: '',
    type: String,
  },
});

const hashValue = ref(props.hash || '');

const emit = defineEmits(['update:hash', 'paste']);

watch(() => hashValue.value, () => emit('update:hash', hashValue.value));

function downloadIamge() {
  axios({
    url: props.qrCodeUrl,
    method: 'get',
    responseType: 'blob',
  }).then(res => {
    const blob = new Blob([res.data])
    const url = window.URL.createObjectURL(blob)
    saveAs(url, 'qr-code.png')
  })
}

async function paste() {
  hashValue.value = await getClipboardText();
}
</script>

<style lang="scss" scoped>
.digital-offline-wrap {
  width: 500px;
  box-sizing: border-box;
  margin: 20px 0 70px;
  background: var(--payment-usdt-bg-color, #F9F9F9);
  position: relative;
  border-radius: 6px;

  .paste-btn {
    color: var(--payment-usdt-paste-btn-color, var(--theme-color));
    padding-right: 10px;
    cursor: pointer;
  }

  .qrcode-wrap {
    border-radius: 26px;
    box-sizing: border-box;
    padding: 0 16px;
    padding-top: 18px;
    padding-bottom: 8px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .img-wrap {
      border: 1px solid var(--border-color-e2e2e2);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 6px;

      img {
        width: 150px;
        height: 150px;
      }
    }

    .download-wrap {
      width: 110px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid var(--border-color-e2e2e2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 26px;
      text-align: center;
      cursor: pointer;

      font-size: 12px;
      font-weight: 400;
      color: var(--font-color-000000);
    }

    .text {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: var(--font-color-000000);
      line-height: 20px;
      margin-bottom: 10px;
      white-space: nowrap;
      padding-right: 50px;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        right: 0px;
        margin-left: auto;
        color: var(--theme-color);
        cursor: pointer;
      }
    }

  }

  .hash-wrap {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: var(--font-color-000000);
    position: absolute;
    bottom: -85px;
    left: 0;

    :deep(.el-input__inner) {
      padding-right: 60px;
    }

    .el-input {
      width: 100%;
    }
  }
}
</style>
