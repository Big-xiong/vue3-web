<template>
  <div class="mode-switch">
    <el-switch :value="$store.state.app.darkTheme" :width="32" active-color="#2E3A46" inactive-color="rgba(46,58,70,1)"
      @change="$store.commit('app/SET_DARK_THEME')" />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.mode-switch {
  margin-left: 10px;

  :deep(.el-switch) {
    height: 18px;

    .el-switch__action {
      background-color: transparent;
      background-image: url('/src/assets/images/header/son.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 14px;
      height: 14px;
      top: 1px;
    }

    .el-switch__core {
      height: 100%;
    }

    &.is-checked .el-switch__core .el-switch__action {
      margin-left: -16px;
      background-image: url('/src/assets/images/header/son-on.png');
      background-size: 100% 100%;
    }
  }
}
</style>
