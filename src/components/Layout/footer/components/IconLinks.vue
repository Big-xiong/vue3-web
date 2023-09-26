
<template>
        <div class="app-footer-link-icon layout-flex-center">
          <i v-for="item in 11" :key="item"></i>
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
    width: 60px;
    margin-top: 10px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    @for $i from 1 through 11 {
      &:nth-child(#{$i}) {
        height: 35px;
        background-image: url("/src/assets/images/footer/logo/#{$i}.png");
        &:hover {
          background-image: url("/src/assets/images/footer/logo/#{$i}_active.png");
        }
      }
    }
  }
}

</style>
