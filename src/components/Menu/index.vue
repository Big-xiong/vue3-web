<template>
  <div class="menu collapse">
    <div class="menu-title">
      <h1>{{ $t(`筛选游戏`) }}</h1>
      <el-link
        :underline="false"
        class="link"
        @click.prevent="handleFilter"
      >{{ $t(`清洗筛选`) }}</el-link>
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
          v-model="item.checked"
          @change="handleChange($event, item.id, index)"
        >{{ item.name }}</el-checkbox>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import {
  inject, ref, computed, onMounted,
} from 'vue';

const global = inject('global');
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [{
      title: '',
      list: [{ name: '', id: 1, checked: false }],
    }],
  },
});

// 获取 emit
const emit = defineEmits(['onCheck', 'onFilter']);
const activeNames = ref([0, 1]);
const checkArr = [];

function handleChange(e, id, i) {
  checkArr[i] = checkArr[i] ? checkArr[i] : [];
  if (e) {
    checkArr[i].push(id);
  } else {
    const index = checkArr[i].indexOf(id);
    if (index > -1) {
      checkArr[i].splice(index, 1);
    }
  }
  emit('onCheck', checkArr);
}

function handleFilter() {
  // console.log('handleFilter');
  props.menuList.forEach((item) => {
    item.list.forEach((child, index) => {
      child.checked = false;
    });
  });
  emit('onFilter', checkArr);
}

</script>

<style lang="scss" scoped>
.menu {
  text-align: left;
  &-title {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    h1 {
      font-size: 16px;
      font-weight: bold;
    }
    .link {
      color: var(--theme-color);
    }
  }
}
</style>
