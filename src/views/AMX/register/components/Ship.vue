<template>
  <div class="rocket pointer">
    <div class="circle" />
    <div class="ship">
      <svg-icon name="rocket" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$width: 140px;
$height: 124px;

.rocket {
  width: $width;
  height: $height;
  position: relative;
  margin: 0 auto;
}

.ship,
.circle {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 25%;
  top: 25%;
  will-change: transform;
  display: flex;
  justify-content: center;
  align-content: center;
}

.circle {
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 90%;
    height: 90%;
    left: 5%;
    top: 5%;
    background-color: var(--theme-color);
    border-radius: 50%;
  }

  &::before {
    animation: circle1 1s linear alternate infinite;
  }

  &::after {
    animation: circle2 1s linear alternate infinite;
  }
}

.ship {
  border-radius: 50%;
  background-color: var(--theme-color);
  // transform: matrix(0.76604, 0.64278, -0.64278, 0.76604, 0, 0);
  .svg-icon {
    margin-top: 18px;
    display: block;
    width: 30px;
    height: 30px;
    fill: #fff;
    animation: rocket 1s alternate infinite ease-in-out;
  }

  .iconfont {
    position: absolute;
    left: 25%;
    top: 25%;
    color: var(--font-color-fff);
    animation: rocket 1s alternate infinite ease-in-out;
  }
}
@keyframes circle1 {
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
@keyframes circle2 {
  to {
    transform: scale(2.2);
    opacity: 0;
  }
}
@keyframes rocket {
  from {
    transform: translate(-3px, 2px);
    // opacity: 0;
  }

  to {
    transform: translate(2px, -3px);
  }
}
</style>
