<template>
  <div class="lottery-silder">
    <h1 class="lottery-silder-title">
      <slot name="title"></slot>
    </h1>
    <el-carousel
      trigger="click"
      :autoplay="false"
      arrow="never"
    >
      <el-carousel-item
        v-for="(item, index) in list"
        :key="index + 'item'"
      >
        <div class="lottery-silder-slot-box">
          <slot
            name="item"
            :page="item"
          ></slot>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.lottery-silder {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  height: 364px;
  color: var(--font-color-fff);
  &-title {
    position: absolute;
    left: 0;
    top: 81px;
    width: 90px;
    height: 22px;
    font-size: 22px;
    font-weight: 400;
    text-align: left;
    line-height: 34px;
  }
  &-slot-box {
    box-sizing: border-box;
    height: 364px;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding-bottom: 77px;
    padding-left: 162px;
    padding-right: 86px;
  }
  :deep() {
    .el-carousel__container {
      height: 364px;
      // border: 1px solid red;
    }
    .el-carousel__indicators--horizontal {
      top: auto;
      left: auto;
      right: 95px;
      top: 116px;
    }
    .el-carousel__button {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--dark-color-fff, var(--bg-color-fff));
      opacity: 1;
    }
    .is-active {
      .el-carousel__button {
        background: var(--theme-color);
      }
    }
  }
}
</style>
