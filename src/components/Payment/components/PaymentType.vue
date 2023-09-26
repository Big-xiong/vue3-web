<template>
  <div v-if="data && data.length" class="payments-channel" :class="`${payMode === 1 ? 'list-all' : 'group-by'}`">
    <div v-if="payMode === 2 && channels?.length" class="payment-channels">
      <PaymentItem v-for="(item, index) in channels" :key="index" :data="item" type="channel"
        :class="{ active: channel && channel.id === item.id }" @change="onPaymentTypeSelected(item)" />
    </div>
    <div v-if="payments?.length" class="payment-items">
      <PaymentItem v-for="(item, index) in payments" :key="index" :data="item" type="payment" :pay-mode="payMode"
        :class="{ active: payment && payment.pay_method_id === item.pay_method_id }"
        :isActive="payment && payment.pay_method_id === item.pay_method_id" @change="onPaymentSelected(item)" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import PaymentItem from './PaymentItem.vue';

export default defineComponent({
  name: 'PaymentType',
  components: {
    PaymentItem,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 1=轮训，2=手工调整(分类展示)
      payMode: 1,
      payments: [],
      payment: null,
      channels: [],
      // 当前选中渠道，仅分类展示时使用
      channel: null,
    };
  },
  created() {
    this.getPaytypes();
  },
  methods: {
    // 获取支付渠道列表
    getPaytypes() {
      const { data } = this;
      this.payMode = data && data[0].child ? 2 : 1;
      // 分类展示
      if (this.payMode === 2) {
        this.channels = data;
        this.onPaymentTypeSelected(data[0]);
      } else {
        this.payments = data;
        this.onPaymentSelected(data[0]);
      }
    },
    onPaymentTypeSelected(channel) {
      this.channel = channel;
      this.payments = channel.child;
      this.onPaymentSelected(channel.child[0]);
    },
    onPaymentSelected(payment) {
      this.payment = payment;
      this.$emit('change', payment, this.channel);
    },
  },
});
</script>

<style lang="scss" scoped>
.payments-channel {
  .payment-channels {
    display: flex;
  }

  .payment-items {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
