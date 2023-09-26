<template>
  <div class="center-right-wrap">
    <div v-if="JSON.parse(renderTitle)" class="center-right-wrap-title">
      <h2>{{ $t(title) }}</h2>
    </div>
    <div class="center-right-wrap-content"
      :class="[noBg ? 'noborder' : '', !JSON.parse(renderTitle) ? 'fullborder' : '']">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import {
  inject, watchEffect, watch, ref,
} from 'vue';
import { useRouter } from 'vue-router';

const $router = useRouter();
const global = inject('global');

const props = defineProps({
  title: {
    type: String,
    default: () => inject('$t')('标题'),
  },
  noBg: {
    type: Boolean,
    default: false,
  },
  renderTitle: {
    type: Boolean,
    default: true,
  },
});
const tit = ref(inject('$t')(''));
const noBg = JSON.parse(props.noBg);
let bg = noBg ? 'none' : 'var(--bg-color-282828)';
let titlebg = noBg ? 'var(--bg-color-282828)' : 'none';
let padding = noBg ? '0' : '30px';
const border = props.noBg ? ref('0') : ref('1px solid var(--border-color-e2e2e2)');
watch(props, () => {
  if (JSON.parse(props.noBg)) {
    bg = 'none';
    titlebg = 'var(--bg-color-282828)';
    padding = '0';
    border.value = '0';
  }
});
// const stop = watch($router.currentRoute, (res) => {
//   console.log(res);
//   tit.value = res?.meta?.title;
// });

</script>

<style lang="scss" scoped>
.center-right-wrap {
  background: v-bind(bg);
  border-radius: 10px;

  &-title {
    height: 80px;
    display: flex;
    align-items: center;
    background: v-bind(titlebg);
    border-radius: 10px 10px 0 0;
    position: relative;
    border: 1px solid var(--center-title-border-color-e2e2e2);
    // border: 1px solid var(--border-color-e2e2e2);
    box-sizing: border-box;

    &::after {
      content: '';
      height: 20px;
      position: absolute;
    }

    h2 {
      margin: 0;
      text-indent: 30px;
      font-size: 20px;
      font-weight: 600;
      color: var(--font-color-000);
      border-left: 1px solid var(--theme-color);
    }
  }

  &-content {
    padding: v-bind(padding);
    display: flex;
    flex-direction: column;
    border: v-bind(border);
    border-top: 0;
    border-radius: 0 0 10px 10px;
    box-sizing: border-box;
    min-height: 60vh;

    &.noborder {
      border: 0;
    }

    &.fullborder {
      border: 1px solid var(--border-color-e2e2e2);
      background-color: var(--block-bg-color);
      border-radius: 10px;
    }

    >div:only-child {
      flex-grow: 1;
    }
  }
}
</style>
