<template>
  <div class="real-wrap">
    <div class="real-wrap-inner align-center-wrap">
      <div class="real-wrap-left">
        <h1>{{ title }}</h1>
        <span class="tab-label">{{ tabs.label }}：</span>
        <el-tabs v-model="activeName" class="tabs" :before-leave="tabsBeforeChange">
          <el-tab-pane v-for="item in tabs.items" :key="item.label" :label="item.label" :name="item.name" />
        </el-tabs>
      </div>
      <div class="real-wrap-right">
        <el-input v-model="query" class="query-input" size="mini" :placeholder="$t('输入关键词搜一搜')"
          prefix-icon="el-icon-search" @keyup.enter="onQuery" />
        <div v-if="mode" class="switch">
          <el-radio v-model="radio" :label="1" :class="`icon icon-grid ${radio === 1 ? 'icon-grid-selected' : ''}`" />
          <el-radio v-model="radio" :label="2" :class="`icon icon-list ${radio === 2 ? 'icon-list-selected' : ''}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, watch,
} from 'vue';

const global = inject('global');

const props = defineProps({
  activeTab: {
    type: String,
    default: '1',
  },
  mode: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: '',
  },
  tabs: {
    type: Object,
    default: () => ({
      label: '',
      items: [
        { label: '', name: '1' },
      ],
    }),
  },
});
// 获取 emit
const emit = defineEmits(['onQuery', 'onTabsChange', 'onSwitchChange']);

const activeName = props.activeTab || '1';
const query = ref('');
const radio = ref(props.mode);

function onQuery(e) {
  // console.log(e)
  emit('onQuery', query.value);
}

function tabsBeforeChange(index) {
  if ([5].includes(+index) && !global.$store.state.user.isLogin) {
    global.$dialog({ tpl: 'GamePop' });
    return false;
  }
  emit('onTabsChange', +index);
  return true;
}

watch(() => radio.value, (newVal, oldVal) => {
  // console.log('newVal', newVal, oldVal)
  if (oldVal === newVal) return;
  emit('onSwitchChange', newVal);
});

</script>

<style lang="scss" scoped>
.real-wrap {
  width: 100%;
  border-bottom: 1px solid var(--border-color-e4e7ed);
  background-color: var(--bg-color-e4e7ed);
  height: 65px;
  box-sizing: border-box;

  &-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-left {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  &-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 16px;
    font-weight: bold;
    margin: -2px 45px 0 0;
  }

  .tab-label {
    margin: -2px 16px 0 0;
    font-size: 13px;
    font-weight: 400;
  }

  .query-input {
    width: 283px;
  }
}

.switch {
  margin-left: 16px;
  width: 62px;
  display: flex;
  justify-content: space-between;

  .icon {
    width: 24px;
    height: 24px;
    margin: 0;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
    background-position: center;

    &-grid {
      background-image: url('/src/assets/images/real/table.png');

      &-selected {
        background-image: url('/src/assets/images/real/table-selected.png');
      }
    }

    &-list {
      background-image: url('/src/assets/images/real/list.png');

      &-selected {
        background-image: url('/src/assets/images/real/list-selected.png');
      }
    }

    :deep() {
      .el-radio__input {
        display: none;
      }

      .el-radio__label {
        display: none;
      }
    }
  }
}
</style>
