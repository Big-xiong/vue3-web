<template>
  <div class="material-item-wrap">
    <div class="image-wrap">
      <img
        :src="data.pic"
        alt
      />
      <div class="el-upload-list__data-actions">
        <span
          class="el-upload-list__data-preview"
          @click="dialogVisible = true"
        >
          <i class="el-icon-zoom-in" />
        </span>
        <span>{{ $t('查看大图') }}</span>
      </div>
    </div>
    <div class="right">
      <div class="text-item">
        <span>{{ $t('图片标题:') }}</span>
        {{ data.title }}
      </div>
      <div class="text-item">
        <span>{{ $t('图片类型:') }}</span>
        {{ typeData[data.pic_type] }}
      </div>
      <div class="text-item">
        <span>{{ $t('更新日期:') }}</span>
        {{ data.updated_at }}
      </div>
      <div class="text-item">
        <span>{{ $t('图片尺寸:') }}</span>
        {{ sizeData[data.size] }}
        <span
          class="download-icon"
          @click="download(data.pic, data.title)"
        >
          <i class="el-icon-download" />
          {{ $t('下载') }}
        </span>
      </div>
      <el-button
        type="primary"
        @click="toEdit"
        class="edit-btn"
      >{{ $t('在线编辑') }}</el-button>
    </div>

    <el-dialog
      v-model="dialogVisible"
      class="imgWrap"
      :append-to-body="true"
    >
      <img
        style="display:block;width: 100%"
        :src="data.pic"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { download } from '@/utils';

const global = inject('global');
const dialogVisible = ref(false);
const dialogImageUrl = ref('');

const props = defineProps({
  data: {},
  sizeData: {},
  typeData: {},
});

const emit = defineEmits(['toEdit']);
function toEdit() {
  emit('toEdit', props.data.pic);
}

function handlePictureCardPreview() { }
</script>

<style lang="scss" scoped>
.material-item-wrap {
  padding: 30px;
  display: flex;
  justify-content: flex-start;
  border: solid 1px var(--border-color-e2e2e2);
  box-sizing: border-box;
  border-radius: 6px;
  margin-bottom: 20px;

  .image-wrap {
    width: 400px;
    height: 160px;
    margin-right: 172px;
    position: relative;

    &:hover {
      .el-upload-list__data-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--font-color-f5f5f5);
        font-size: 12px;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }

    .el-upload-list__data-actions {
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--bg-color-000-6);
      opacity: 0.7;
      top: 0;
      left: 0;
      display: none;
      cursor: pointer;

      .el-icon-zoom-in {
        font-size: 20px;
        margin-bottom: 8px;
      }
    }
  }

  .right {
    text-align: left;

    .text-item {
      text-align: left;
      // line-height: 30px;
      font-size: 14px;
      margin: 5px 0;
      color: var(--font-color-222930);
      // &:nth-child(4) {
      //   margin-bottom: 12px;
      // }

      span {
        margin-right: 10px;
        color: var(--font-color-999);
        font-size: 12px;
      }

      .download-icon {
        color: var(--theme-color);
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .edit-btn {
      margin-top: 12px;
    }
  }
}
</style>
