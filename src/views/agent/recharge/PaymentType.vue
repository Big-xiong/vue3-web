
<template>
          <div class="payments-channel">
            <!--    <div v-if="data.payMode === 2" class="payment-channels">-->
            <!--      <PaymentItem-->
            <!--          v-for="(item, index) in data.channels"-->
            <!--          :key="index"-->
            <!--          :data="item"-->
            <!--          type="channel"-->
            <!--          :class="{ active: data.channelSelected.id === item.id }"-->
            <!--          @change="handleChanelSelect(item)"-->
            <!--      />-->
            <!--    </div>-->
            <!--    <div class="payment-items">-->
            <!--      <PaymentItem-->
            <!--          v-for="(item, index) in data.payments"-->
            <!--          :key="index"-->
            <!--          :data="item"-->
            <!--          type="payment"-->
            <!--          :pay-mode="data.payMode"-->
            <!--          :class="{ active: data.paymentSelected.pay_method_id === item.pay_method_id }"-->
            <!--          @change="handlePaymentSelect(item)"-->
            <!--      />-->
            <!--    </div>-->
          </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');

</script>

<style lang="scss" scoped>
//.payment-channels,
//.payment-items {
//  display: flex;
//}
</style>
