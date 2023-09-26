<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color }">
    <use :href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: '',
  },
  fill: {
    type: String,
    default: '',
  },
});

const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`;
  }
  return 'svg-icon';
});
const size = props.size ? (typeof props.size === 'number' ? `${props.size}px` : props.size) : '1em';
const fill = props.fill ? `url(#${props.fill})` : 'currentColor';
</script>

<style lang="scss">
.svg-icon {
  width: v-bind(size);
  height: v-bind(size);
  fill: var(--svg-color, var(--theme-color));
  vertical-align: middle;
}
</style>
