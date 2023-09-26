<template>
  <div class="protocol-wrap">
    <header class="protocol-header">{{ $t('协议') }}</header>
    <span v-for="(item, index) in protocolList" :key="index" :class="{ 'active': modelValue === item.protocol }"
      @click="update(item.protocol)">{{ item.title }}</span>
  </div>
</template>

<script setup>
import {
  inject, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { getprotocol } from '@/api/agent';

const global = inject('global');

const props = defineProps({
  methodId: String,
  modelValue: String,
});
const emit = defineEmits(['update:modelValue']);
function update(event) {
  emit('update:modelValue', event);
}

const protocolList = ref([]);
const { run: getProtocol } = useRequest(
  (id) => getprotocol({
    pay_method_id: id,
  }),
  {
    manual: true,
    onSuccess(result) {
      protocolList.value = result;
      update(protocolList.value?.[0]?.protocol);
    },
  },
);

if (props.methodId) {
  getProtocol(props.methodId);
}

watch(() => props.methodId, () => {
  getProtocol(props.methodId);
});

</script>

<style lang="scss" scoped>
.protocol-wrap {
  .protocol-header {
    font-size: 16px;
    color: var(--font-color-fff);
    font-weight: 500;
    line-height: 30px;
    margin-bottom: 10px;
  }

  span {
    display: inline-block;
    width: 120px;
    height: 40px;
    border: 1px solid var(--border-color-e2e2e2);
    border-radius: 6px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    margin-right: 10px;
    cursor: pointer;

    &:hover,
    &.active {
      border-color: var(--theme-color);
      color: var(--theme-color);
    }
  }
}
</style>
