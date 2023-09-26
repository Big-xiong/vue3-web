<template>
  <div class="electronic-menu collapse">
    <div class="electronic-menu-title">
      <h1>{{$t('筛选游戏')}}</h1>
      <el-link
        :underline="false"
        class="electronic-menu-title-link"
        @click.prevent="handleFilter"
      >{{$t('清洗筛选')}}</el-link>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(menu, index) in menuList"
        :key="'menu' + index"
        :title="menu.title"
        :name="index"
      >
        <el-checkbox
          v-for="item in menu['list']"
          :key="item.name"
          class="checkbox"
          @change="handleChange($event, item.id,index)"
        >{{ item.name }}</el-checkbox>
      </el-collapse-item>
      <!-- <el-collapse-item
              title="赔付线"
              :name="1"
            >
              <div class="electronic-menu-slider">
                <span class="electronic-menu-slider-range">{{ rangeVal[0] + '-' + rangeVal[1] }}</span>
                <el-slider
                  v-model="rangeVal"
                  range
                  :show-tooltip="false"
                  :max="1024"
                  @change="sliderChange"
                />
              </div>
            </el-collapse-item> -->
    </el-collapse>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';

const global = inject('global');

const props = defineProps({
  menuList: {
    type: Array,
    default: () => [{
      title: '',
      list: [{ name: '', id: 1 }],
    }],
  },
});
// 获取 emit
const emit = defineEmits(['onCheck', 'onFilter', 'sliderChange']);
const activeNames = [0, 1];
const checkArr = [];
const rangeVal = ref([1, 1024]);

function handleChange(e, id) {
  if (e) {
    checkArr.push(id);
  } else {
    const index = checkArr.indexOf(id);
    if (index > -1) {
      checkArr.splice(index, 1);
    }
  }
  // console.log(checkArr)
  emit('onCheck', checkArr);
}

function handleFilter(val) {
  // console.log('handleFilter', rangeVal.value)
  emit('onFilter', checkArr, rangeVal.value);
}

function sliderChange(val) {
  emit('sliderChange', val);
}

</script>

<style lang="scss" scoped>
.electronic-menu {
  text-align: left;
  &-title {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    h1 {
      font-size: 16px;
      font-weight: bold;
    }
    &-link {
      color: var(--theme-color);
    }
  }
  &-slider {
    position: relative;
    top: -10px;
    box-sizing: border-box;
    width: 260px;
    padding: 0 10px;
    &-range {
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: var(--font-color-0a0a0a);
      line-height: 19px;
      position: relative;
      top: 13px;
      left: -9px;
    }
  }
  :deep() {
    .el-slider__runway,
    .el-slider__bar {
      height: 9px;
    }
    .el-slider__button-wrapper {
      top: -13px;
    }
    .el-slider__button {
      width: 16px;
      height: 16px;
      border-radius: 0;
      background: linear-gradient(180deg, var(--bg-color-f5f5f5), var(--bg-color-e1e1e2) 49%, var(--bg-color-fcfcfc));
      border: 1px solid var(--border-color-aaa);
      box-shadow: 0px 2px 4px 0px var(--shadow-color);
    }
  }
}
</style>
