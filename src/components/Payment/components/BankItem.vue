
<template>
        <div class="bank-item" @click="onSelected">
          <BankIcon :bank-code="bank.icon_code"/>
          <span>{{ bank.name }}</span>
          <i class="el-icon-check"/>
        </div>
</template>

<script>
import { defineComponent } from 'vue';
import BankIcon from './BankIcon.vue';

export default defineComponent({
  name: 'BankItem',
  components: {
    BankIcon,
  },
  props: ['bank'],
  data() {
    return {};
  },
  methods: {
    onSelected() {
      this.$emit('select', this.bank);
    },
  },
});
</script>

<style lang="scss" scoped>
.bank-item {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.45s ease-out;
  // &.selected{
  //   // border-color: var(--theme-color);
  //   // color: var(--theme-color);
  //   // font-weight: 500;
  //   // transform: scale(1.2);
  //   // transform-origin: 50% 100%;
  // }
  .el-image,
  > img {
    width: 26px;
    height: 26px;
    z-index: 1;
  }

  > span {
    width: 70%;
    font-size: 14px;
    color: var(--font-color-000);
    user-select: none;
    z-index: 1;
    padding-left: 10px;
  }

  [class*='el-icon'] {
    display: none;
  }

  &.selected {
    [class*='el-icon'] {
      display: block;
    }

    span {
      color: var(--font-color-fff);
    }
  }
}
</style>
