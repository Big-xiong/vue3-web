<template>
  <el-image :src="$getSrc(`/src/assets/images/bank-icon/bank_${bankCode}_logo.png`, 'Default')" />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BankIcon',
  props: {
    bankCode: {
      default: 'ABC',
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.el-image {
  height: 100%;
  background-color: var(--bg-color-fff);
  padding: 2px;
  border-radius: 50%;
}
</style>
