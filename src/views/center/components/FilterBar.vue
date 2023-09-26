<template>
  <div class="layout-flex-between record-searchBar">
    <div class="layout-flex-center record-searchBar-date">
      <el-date-picker v-model="data.start_time" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
        :disabled-date="time => data.end_time && time.getTime() > (new Date(data.end_time).getTime() - 86400000)"
        :placeholder="$t('开始时间')" />
      <span class="line" />
      <el-date-picker class="el-date-editor-end" v-model="data.end_time" type="date" format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :disabled-date="time => data.start_time && (new Date(data.start_time).getTime() - 86400000) > time.getTime()"
        :placeholder="$t('最后时间')" />
    </div>
    <el-select v-if="statusArr?.length && !show" v-model="data.status" :placeholder="$t('请选择')" class="state_middle"
      @change="search">
      <el-option v-for="(item, index) in statusArr" :key="index" :label="item" :value="index" />
    </el-select>
    <el-select v-if="statusArr?.length && show" v-model="data.status" :placeholder="$t('请选择')" class="state_middle"
      @change="search">
      <el-option v-for="item in statusArr" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <!-- <el-select v-model="data.inte_region_id" :placeholder="$t('请选择地区')" @change="chooseArea">
              <el-option v-for="item in dicts?.regionlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>-->
    <Currency :type="type" @currencyChange="currencyChange" v-if="subConfigisCurrency" />
    <!-- <el-select
          v-model="data.inte_currency_id"
          :placeholder="$t('请选择货币')"
          @change="search"
        >
          <el-option
            v-for="item in currencyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
    </el-select>-->
    <el-button type="primary" icon="el-icon-search" @click="search" :loading="recordLoading">{{ $t('查询') }}</el-button>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import Currency from '@/views/center/components/Currency.vue';

const global = inject('global');

const $store = inject('store');
$store.dispatch('app/getDict', ['regionlist']);
const { dicts } = $store.state.app;
const { user } = $store.state;
const subConfig = inject('subConfig');

const currencyList = ref([]);

const props = defineProps({
  statusArr: {
    type: Array,
  },
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Number,
    default: null,
  },
});

const data = reactive({
  start_time: '',
  end_time: '',
  status: 0,
  inte_region_id: 1,
  inte_currency_id: 1,
});

watch(() => (user.userInfo, dicts.regionlist), () => {
  data.inte_region_id = user?.userInfo?.inte_region_id;
  data.inte_currency_id = user?.userInfo?.inte_currency_id;

  currencyList.value = dicts?.regionlist?.filter((item) => item.id === user?.userInfo?.inte_region_id)[0]?.currency_conf?.list ?? [];
}, { immediate: true });

// watch(() => dicts.regionlist, () => {
//   currencyList;
// });

const emit = defineEmits(['statusChange', 'search', 'currencyChange']);
function search() {
  emit('search', data);
}
function currencyChange(val) {
  emit('currencyChange', val);
}
function chooseArea(value) {
  currencyList.value = dicts?.regionlist?.filter((item) => item.id === value)[0]?.currency_conf.list;
  search();
}

</script>

<style lang="scss" scoped>
</style>
