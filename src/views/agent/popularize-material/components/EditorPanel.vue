<template>
  <div class="editor-panel-wrap">
    <header @click="goBack">
      <i class="el-icon-arrow-left" />
      {{ $t('推广素材') }}
    </header>
    <div id="edit-region">
      <img
        id="background-image"
        :src="url || ''"
        alt
      />
      <DragWrap
        :w="160"
        :h="160"
        :parent="true"
        :class-name-active="'drag-active'"
        :class-name="'drag'"
      >
        <img
          v-if="qrcodeUrl"
          :src="qrcodeUrl"
          class="qrcode"
          alt
        />
      </DragWrap>
      <DragWrap
        :w="300"
        :h="40"
        :y="170"
        :parent="true"
        :class-name-active="'drag-active'"
        :class-name="'drag'"
      >
        <div
          v-if="options[0]"
          class="content-text"
          :style="{ color: options[0].color.hex, background: options[0].bg.hex }"
        >{{ options[0].content }}</div>
      </DragWrap>
      <DragWrap
        :w="300"
        :h="40"
        :y="220"
        :parent="true"
        :class-name-active="'drag-active'"
        :class-name="'drag'"
      >
        <div
          v-if="options[1]"
          class="content-text"
          :style="{ color: options[1].color.hex, background: options[1].bg.hex }"
        >{{ options[1].content }}</div>
      </DragWrap>
    </div>
    <div class="tips">
      <i class="el-icon-warning-outline" />
      {{ $t('拖拽可以改变二维码或文字的大小，位置') }}
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, watch,
} from 'vue';
import qrcode from 'qrcode';
import DragWrap from 'vue3-draggable-resizable';

const global = inject('global');

const props = defineProps({
  qrcode: Object,
  options: Object,
  url: String,
});

const qrcodeUrl = ref('');

const emit = defineEmits(['back']);
function goBack() {
  emit('back');
}

watch(() => props.qrcode, async (val) => {
  if (val.url) {
    qrcodeUrl.value = await qrcode.toDataURL(val.url, {
      margin: 0,
      color: {
        dark: val.bg.hex8,
        light: val.color.hex8,
      },
    });
  }
});

// function onResize() { }
// function onActivated() { }
// function onDeactivated() { }

</script>

<style lang="scss" scoped>
.editor-panel-wrap {
  position: relative;
  background-repeat: no-repeat;
  width: 590px;
  box-sizing: border-box;
  font-weight: 500;
  padding: 30px;
  border: 1px solid var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  text-align: left;
  border-radius: 6px;

  header {
    cursor: pointer;
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin-bottom: 20px;
    margin-top: 20px;
    text-align: left;
  }

  img {
    width: 100%;
  }

  .qrcode {
    width: auto;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .draggable {
    border: 1px dashed var(--border-color-343434) !important;
    position: absolute;
  }

  .tips {
    margin-top: 20px;
    font-size: 14px;
    color: var(--font-color-999);
  }
}

.content-text {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--font-color-fff);
}

#edit-region {
  width: 100%;
  position: relative;
  background-color: var(--bg-color-f5f5f5);
}
</style>
