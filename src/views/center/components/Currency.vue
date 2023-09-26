<template>
  <!-- v-if="currencyList?.length" -->
  <el-select v-model="regionId" :placeholder="$t('请选择')" @change="change" v-if="currencyList?.length">
    <el-option v-for="item in currencyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { history_currency } from '@/api/center';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const regionId = ref('');
const props = defineProps({
  type: {
    type: Number,
    default: null,
  },
});

const { run, data: currencyList } = useRequest(() => history_currency({ type: [props?.type] }), {
  manual: true,
  formatResult: (res) => {
    if (res.length > 0 && !res.find((item) => item.id === regionId.value)) {
      res.unshift({
        id: regionId.value,
        name: user?.userInfo?.currency_detail?.name,

      });
    }
    return res;
  },
});
watch(() => user.userInfo, () => {
  regionId.value = user?.userInfo?.inte_currency_id;
  if (user?.userInfo?.inte_currency_id) run();
}, { immediate: true });

const emit = defineEmits('currencyChange');
function change(val) {
  emit('currencyChange', val);
}

</script>

<style lang="scss" scoped>
</style>
