<template>
  <dl class="top">
    <ul>
      <li v-for="(item, index) in data.tableTtileMaps" :key="index" :class="item.vid === selectedVid ? 'active' : ''"
        @click="selectVid(item.type)">{{ $t(item.name) }}</li>
    </ul>
  </dl>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';

const global = inject('global');

const props = defineProps({
  vid: {
    type: String,
    default: '',
  },
});

const data = reactive({
  tableTtileMaps: [
    { name: global.$t('经典百家乐'), type: 'BAC', vid: 'D051' },
    { name: global.$t('竞咪百家乐'), type: 'TBAC', vid: 'D055' },
    { name: global.$t('骰宝'), type: 'SHB', vid: 'B025' },
    { name: global.$t('龙虎'), type: 'DT', vid: 'B021' },
    { name: global.$t('牛牛'), type: 'NN', vid: 'B022' },
  ],
});

const selectedVid = ref(props.vid);

const emit = defineEmits(['change']);

function selectVid(type) {
  emit('change', type);
}

watch(() => props.vid, (val) => {
  selectedVid.value = val;
});
</script>

<style lang="scss" scoped>
.top {
  margin: 0 0 20px 0;

  ul {
    width: calc(100% + 20px);
    max-width: 100%;
    display: flex;

    li {
      white-space: nowrap;
      font-size: 16px;
      line-height: 24px;
      color: var(--font-color-ccc);
      cursor: pointer;
      flex-shrink: 1;

      &:not(:last-child) {
        margin-right: 30px;
      }

      &.active {
        color: var(--font-color-fff);
        cursor: default;
        font-weight: 600;
      }
    }
  }
}
</style>
