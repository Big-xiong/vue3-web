<template>
  <div class="app-footer-link-icon layout-flex-center">
    <i
      v-for="item in 9"
      :key="item"
    ></i>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
/* stylelint-disable */
.app-footer-link-icon {
  height: 85px;
  i {
    margin-right: 40px;
    transition: all 0.45s ease-out;
    cursor: pointer;
    width: 100px;
    margin-top: 10px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    &:last-child {
      margin-right: 0;
    }

    @for $i from 1 through 9 {
      &:nth-child(#{$i}) {
        height: 100px;
        background-image: url('@/assets/images/AMX/footer/logo/#{$i}.png');
        &:hover {
          background-image: url('@/assets/images/AMX/footer/logo/#{$i}_active.png');
        }
      }
    }
  }
}
</style>
