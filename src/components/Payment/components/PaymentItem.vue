<template>
  <div class="payment-item" :class="className" @click="onSelected">
    <el-image :src="imgSrc" fit="contain">
      <template #placeholder>
        <div class="image-loading"
          :style="{ 'background-image': `url(${$getSrc('/src/assets/images/bank-icon/way/wq_pay_img_2_a.png')})` }">
        </div>
      </template>
      <template #error>
        <div class="image-loading"
          :style="{ 'background-image': `url(${$getSrc('/src/assets/images/bank-icon/way/wq_pay_img_2_a.png')})` }">
        </div>
      </template>
    </el-image>
    <!-- <span>{{ data.name + (payMode === 2 ? '_' + data.pay_method_id : '') }}</span> -->
    <span>{{  data.alias || data.name  }}</span>
  </div>
</template>

<script>

import { defineComponent } from 'vue';
import { paymentIcons, paymentChannelIcons } from '@/config/payment';

export default defineComponent({
  name: 'PaymentItem',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default() {
        return 'payment';
      },
    },
    payMode: {
      type: Number,
      default() {
        // 1=轮训，2=手工调整(分类展示)
        return 1;
      },
    },
    isActive: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      // icons: this.type === 'channel' ? paymentChannelIcons : paymentIcons,
    };
  },
  computed: {
    className() {
      const { type, payMode } = this;
      if (type === 'payment' && payMode === 2) {
        return `${type} child-item`;
      }
      return `${type}`;
    },
    imgSrc() {
      let src = '';
      if (this.type === 'channel') {
        src = this.$getSrc(`/src/assets/images/bank-icon/pay-icons/wq_pay_img_parent_${this.data.id}.png`);
      } else if (this.data.id === 2) {
        // 银行卡网银图标区分选中与不选中
        if (this.isActive) {
          src = this.$getSrc(`/src/assets/images/bank-icon/way/wq_pay_img_2_a.png`);
        } else {
          src = this.$getSrc(`/src/assets/images/bank-icon/way/wq_pay_img_2.png`);
        }
      } else {
        src = this.$getSrc(`/src/assets/images/bank-icon/way/wq_pay_img_${this.data.id}.png`);
      }
      return src;
    },
  },
  created() {
    // console.log(this.type)
  },
  methods: {
    onSelected() {
      this.$emit('change', this.data);
    },
  },
});
</script>

<style lang="scss" scoped>
.payment-item {
  position: relative;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border: 1px solid var(--border-color-000-2);
  border-radius: 5px;
  font-size: 16px;
  padding: 0 10px;
  overflow: hidden;
  cursor: pointer;
  margin-right: 15px;
  margin-bottom: 15px;
  transition: all 0.45s ease-out;

  &.channel {
    flex-direction: column;
    min-width: 100px;
    height: 100px;

    span {
      margin-top: 6px;
      white-space: nowrap;
    }

    :deep(.el-image) {
      width: 55px;
      height: 55px;
      margin-right: 0;
    }
  }

  :deep(.el-image) {
    width: 30px;
    height: 30px;
    margin-right: 6px;

    .image-loading {
      height: 100%;
      width: 100%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  &::after,
  &::before {
    position: absolute;
    right: 0;
    bottom: 0;
    content: '';
    transition: all 0.45s ease-out;
  }

  &::before {
    width: 20px;
    height: 30px;
    transform: rotate(45deg);
    transform-origin: 0 30px;
    background-color: transparent;
  }

  &::after {
    width: 10px;
    height: 6px;
    border: none;
    border-left: 1px solid transparent;
    border-bottom: 1px solid transparent;
    transform: rotate(-45deg) translate(20%, -50%);
    transition: border-left-color 0.2s ease-out, border-bottom-color 0.4s ease-out 0.2s;
    border-radius: 2px;
  }

  &:hover,
  &.active {
    border-color: var(--theme-color);
    color: var(--theme-color);
    font-weight: 500;
  }

  &.active {
    &::before {
      background-color: var(--theme-color);
    }

    &::after {
      border-color: var(--border-color-fff);
    }
  }

  &.child-item {
    border-color: var(--border-color-000-2);
    color: var(--font-color-000-4);
    background-color: var(--payitem-bg-color-191919);

    &::before,
    &::after {
      display: none;
    }

    &:hover,
    &.active {
      border-color: var(--theme-color);
      color: var(--theme-color);
      font-weight: 500;
    }

    &.active {
      background-color: var(--theme-color);
      color: var(--font-color-fff);
    }
  }
}
</style>
