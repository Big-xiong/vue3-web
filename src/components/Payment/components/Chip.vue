<template>
  <div
    class="chip"
    @click="onSelected"
  >
    <img :src="$getSrc(`/src/assets/images/deposit/${getChipClassName}@2x.png`)" />
    <span>{{ tips }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Chip',
  props: ['amount', 'tips', 'index', 'length'],
  data() {
    return {};
  },
  computed: {
    getChipClassName() {
      return `chip${Math.ceil((this.index + 1) * (5 / this.length))}`;
    },
  },
  methods: {
    onSelected() {
      this.$emit('select', this.amount);
    },
  },
});
</script>

<style lang="scss" scoped>
.chip {
  position: relative;
  width: 70px;
  height: 70px;
  cursor: pointer;
  transition: all 0.45s ease-out;

  &::after {
    content: '';
    position: absolute;
    width: 58px;
    height: 58px;
    top: calc(50% - 3px);
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: none;
  }

  &.selected {
    transform: scale(1.2);

    &::after {
      display: block;
    }
  }

  img {
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  > span {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--font-color-fff);
    user-select: none;
    z-index: 1;
    padding-bottom: 10px;
  }
}
</style>
