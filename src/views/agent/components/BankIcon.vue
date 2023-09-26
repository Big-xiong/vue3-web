<template>
  <div class="bank-icon-wrap">
    <div
      class="bank-icon"
      :style="{ backgroundImage: `url(${$getSrc(`/src/assets/images/bank-icon/bank_${bankCode}_logo.png`, 'Default')})` }"
    />
  </div>
</template>

<script setup>
defineProps({
  bankCode: {
    type: String,
    default: 'Default',
  },
});

</script>

<style lang="scss" scoped>
.bank-icon-wrap {
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  background-color: var(--dark-bg-color-fff, var(--bg-color-fff));
  padding: 4px;
  margin-right: 10px;
  border-radius: 50%;

  .bank-icon {
    background-size: contain;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}
</style>
