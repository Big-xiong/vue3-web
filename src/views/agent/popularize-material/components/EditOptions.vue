<template>
  <div class="edit-options-wrap">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="$t('二维码')" name="1">
        <div class="wrap">
          <div>
            <p>{{ $t('二维码颜色') }}</p>
            <div class="colorWrap" :style="{ 'background-color': qrcode.color.hex8 }">
              <chrome-color-picker v-model:color="qrcode.color" class="color" />
            </div>
          </div>
          <div>
            <p>{{ $t('二维码背景') }}</p>
            <div class="colorWrap" :style="{ 'background-color': qrcode.bg.hex8 }">
              <chrome-color-picker v-model:color="qrcode.bg" class="color" />
            </div>
          </div>
          <div>
            <p>{{ $t('二维码链接') }}</p>
            <el-input v-model="qrcode.url" type="text-area" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('文字信息')" name="2">
        <div class="wrap">
          <template v-for="(item, index) in options" :key="index">
            <div>
              <p>{{ $t('文字') }}{{ index === 0 ? $t('一') : $t('二') }}</p>
              <el-input v-model="item.content" type="text-area" />
            </div>
            <div>
              <p>{{ $t('文字颜色') }}</p>
              <div class="colorWrap" :style="{ 'background-color': item.color.hex8 }">
                <chrome-color-picker v-model:color="item.color" class="color" />
              </div>
            </div>
            <div :class="{ 'pb20': index === 0 }">
              <p>{{ $t('文字背景') }}</p>
              <div class="colorWrap" :style="{ 'background-color': item.bg.hex8 }">
                <chrome-color-picker v-model:color="item.bg" class="color" />
              </div>
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button class="save-btn" type="primary" @click="download">{{ $t('保存本地') }}</el-button>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { ChromeColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import domtoimage from 'dom-to-image';

const global = inject('global');

const activeTab = ref('1');
const qrcode = reactive({
  color: {
    hex8: '#000',
  },
  bg: {
    hex8: '#ccc',
  },
  url: '',
});
const options = reactive([
  {
    content: '',
    color: {
      hex8: '#000',
    },
    bg: {
      hex8: '#ccc',
    },
    fz: 30,
  },
  {
    content: '',
    color: {
      hex8: '#000',
    },
    bg: {
      hex8: '#ccc',
    },
    fz: 30,
  },
]);

const emit = defineEmits(['qrcodeChange', 'optionsChange']);

watch(qrcode, () => {
  emit('qrcodeChange', qrcode);
});
watch(options, () => {
  emit('optionsChange', options);
});

function download() {
  const ele = document.getElementById('edit-region');
  domtoimage.toJpeg(ele, { quality: 0.95, cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${new Date().getTime()}.jpeg`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => console.error(err));
}

</script>

<style lang="scss" scoped>
.edit-options-wrap {
  border: 1px solid var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  box-sizing: border-box;
  overflow: visible;

  :deep(.el-tabs__item) {
    color: var(--font-color-999);

    &.is-active {
      color: var(--theme-color);
    }
  }

  :deep(.el-tabs__content) {
    overflow: visible;
    margin-top: 20px;
  }

  .wrap {
    height: 100%;
    margin-bottom: 20px;
    overflow: visible;

    &.pb20 {
      padding-bottom: 20px;
      margin-bottom: 20px;
      //border-bottom: 1px solid rgba($--border-color-base, .4);
    }

    p {
      text-align: left;
      font-size: 14px;
      margin-bottom: 12px;
      color: var(--font-color-222930);
    }

    .colorWrap {
      width: 290px;
      height: 46px;
      border-radius: 6px;
      margin-bottom: 20px;
      overflow: visible;

      :deep(.color) {
        display: none;
        position: relative;
        top: 46px;
        z-index: 9999;

        &:hover {
          display: block;
        }
      }

      &:hover {
        .color {
          display: block;
        }
      }
    }
  }
}

.save-btn {
  width: 100%;
}
</style>
