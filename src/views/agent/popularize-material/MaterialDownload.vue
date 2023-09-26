<template>
  <div class="material-download-wrap">
    <header>{{ $t('推广素材') }}</header>
    <div class="form-wrap">
      <Form ref="FormRef" :columns="columns" label-width="0">
        <template #submit>
          <el-button class="query-btn" :loading="getSourceLoading" @click="getSourceData" type="primary">{{ $t('查询') }}
          </el-button>
        </template>
      </Form>
    </div>

    <div class="material-list">
      <MaterialItem v-for="item in sourceData" :key="item.id" @toEdit="handleToEdit($event)" :data="item"
        :sizeData="sizeData" :typeData="typeData" />
      <p v-if="!sourceData.length">{{ $t('暂无数据') }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref,
} from 'vue';
import Form from '@/components/Form/index.vue';
import {
  promotionsource,
  promotionsourcesizelist,
  promotionsourcetypelist,
} from '@/api/agent';
import MaterialItem from './components/MaterialItem.vue';

const global = inject('global');
const columns = reactive([
  [
    {
      type: 'input',
      prop: 'title',
      width: '220px',
      placeholder: global.$t('图片标题'),
    },
    {
      type: 'select',
      prop: 'type',
      width: '220px',
      placeholder: global.$t('图片类型'),
      list: [],
    },
    {
      type: 'select',
      prop: 'size',
      width: '220px',
      placeholder: global.$t('图片尺寸'),
      list: [],
    },
    { slot: 'submit' },
  ],
]);

const FormRef = ref(null);
const sourceData = ref([]);
const sizeData = ref({});
const typeData = ref({});

const { run: getSourceData, loading: getSourceLoading } = useRequest(
  () => promotionsource(FormRef.value?.data ?? {}),
  {
    onSuccess(result) {
      sourceData.value = result.data;
    },
  },
);

function mapObjectKeyToList(object) {
  return Object.keys(object).map((key) => ({
    label: object[key],
    key,
    value: key,
  }));
}

const { run: getSourceSize, loading: getSourceSizeLoading } = useRequest(
  () => promotionsourcesizelist(FormRef.value?.data ?? {}),
  {
    onSuccess(result) {
      sizeData.value = result;
      columns[0][2].list = mapObjectKeyToList(result);
    },
  },
);
const { run: getSourceType, loading: getSourceTypeLoading } = useRequest(
  () => promotionsourcetypelist(FormRef.value?.data ?? {}),
  {
    onSuccess(result) {
      typeData.value = result;
      columns[0][1].list = mapObjectKeyToList(result);
    },
  },
);

const emit = defineEmits(['toEdit']);
function handleToEdit(url) {
  emit('toEdit', url);
}
</script>

<style lang="scss" scoped>
.material-download-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin: 0 0 20px;
    text-align: left;
  }

  :deep(.el-input__inner) {
    width: 220px;
  }

  :deep(.el-form-item) {
    width: 220px;
    max-width: 220px;
    margin-right: 30px;

    .el-select {
      margin-right: 30px;
    }

    &:last-child {
      width: 360px;
      max-width: 360px;
    }
  }

  :deep(.config-form-wrap-group) {
    justify-content: flex-start;
  }
}
</style>
