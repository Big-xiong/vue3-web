
<template>
      <div class="fishing-card">
        <div>
          <div class="fishing-card-box placeholder-img">
            <div class="fishing-card-box-image" :style="`background-image: url(${$getSrc(imgUrl)});`" v-failed></div>
            <!-- <img :src="imgUrl" class="image" width="362" height="216" /> -->
          </div>
          <div class="fishing-card-bottom">
            <span class="fishing-card-bottom-title">
              {{ title }}
              <template v-if="isGray">({{$t('维护中')}})</template>
            </span>
            <span class="fishing-card-bottom-description">{{ description }}</span>
          </div>
        </div>
      </div>
</template>

<script setup>
import { inject } from 'vue';
const global = inject('global');
const props = defineProps({
  imgUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  isGray: {
    type: Boolean,
    default: false,
  },
});

</script>

<style lang="scss" scoped>
.fishing-card {
  width: 362px;
  a {
    text-decoration: none;
  }
  &-bottom {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    &-title {
      display: block;
      font-size: 19px;
      font-weight: 500;
      text-align: left;
      color: var(--font-color-000);
      line-height: 28px;
      letter-spacing: 0px;
      margin: 8px 0;
    }
    &-description {
      display: block;
      font-size: 15px;
      font-weight: 400;
      text-align: left;
      color: var(--font-color-929292);
      line-height: 20px;
      letter-spacing: 0px;
    }
  }
  &-box {
    width: 362px;
    height: 216px;
    overflow: hidden;
    cursor: pointer;
    &-image {
      width: 362px;
      height: 216px;
      display: block;
      background-size: 100%;
      transition: all 0.4s linear;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
