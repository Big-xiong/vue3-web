<template>
  <div class="vip-wrap-list">
    <el-carousel :autoplay="false">
      <el-carousel-item
        v-for="(item,index) in 5"
        :key="item"
      >
        <div :style="{ 'background-image': `url(${$getSrc(`/src/current_project/assets/images/vip/girl${index + 1}.png`)})` }"></div>
      </el-carousel-item>
    </el-carousel>
    <!-- <div class="bg"></div> -->
  </div>
</template>
<style lang="scss" scoped>
.vip-wrap-list {
  position: relative;
  .bg {
    background-image: url('@img/vip/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 432px;
    margin-top: -432px;
    position: relative;
    z-index: 2;
  }
}
:deep(.el-carousel__container) {
  min-height: 680px;
  box-sizing: border-box;
  &::after {
    content: '';
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    background-image: url('@img/vip/bg.png');
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    height: 432px;
    margin-top: -432px;
    z-index: 2;
  }
  div {
    height: 503px;
    background-size: auto 100%;
    background-position: center center;
    background-repeat: no-repeat;
    top: 110px;
  }
  .el-carousel__arrow {
    width: 58px;
    height: 58px;
    font-size: 50px;
    top: 30%;
    background-color: var(--bg-color-314510);
    color: var(--theme-color);
    &.el-carousel__arrow--left {
      left: 50%;
      margin-left: -330px;
      transform: translateX(-50%);
    }
    &.el-carousel__arrow--right {
      left: 50%;
      margin-left: 330px;
      transform: translateX(-50%);
    }
  }
}
:deep(.el-carousel__indicator--horizontal) {
  .el-carousel__button {
    width: 16px;
    height: 16px;
    background: var(--bg-color-43392d);
    border-radius: 50%;
    opacity: 1;
  }
  &.is-active button {
    background: var(--theme-color);
  }
}
</style>
