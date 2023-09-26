
<template>
    <div class="electronic-card">
      <div class="electronic-card-box">
        <img :src="imgUrl" class="electronic-card-box-image" width="444" height="264"/>
        <img class="electronic-card-box-love" v-login @click.stop="handleClick" :src="$getSrc(`/src/assets/images/Collection-${(isLoved === 1 || navIndex === 5)?1:2}.webp`)" alt=""/>
        <!-- <el-button
            type="text"
            :class="`electronic-card-box-love ${isLoved === 1 || navIndex === 5 ? 'electronic-card-box-loved' : ''}`"
            v-login
            @click.stop="handleClick"
          /> -->
        <div>
          <el-button type="primary" size="mini" class="electronic-card-bottom-but" v-if="isNew === 1">NEW</el-button>
          <el-button type="primary" size="mini" class="electronic-card-bottom-but" v-else-if="isHot === 1">HOT</el-button>
        </div>

      </div>
      <div>
        <div class="electronic-card-bottom">
          <el-tag size="small" class="electronic-card-box-pt" v-show="allplatform[game_platform_id]">{{ allplatform[game_platform_id] ?? '' }}</el-tag>
          <span class="electronic-card-bottom-title" :title="title">
            {{ title }}
            <template v-if="isGray">({{$t('维护中')}})</template>
          </span>
        </div>
      </div>
    </div>
</template>

<script setup>
import {
  inject, ref,
} from 'vue';

const global = inject('global');
// 获取 emit
const emit = defineEmits(['onLike']);

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  id: {
    type: String,
    default: '',
  },
  imgUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  love: {
    type: Number,
    default: 2,
  },
  isNew: {
    type: Number,
    default: 2,
  },
  isHot: {
    type: Number,
    default: 2,
  },
  allplatform: {
    type: Object,
    default: () => ({}),
  },
  game_platform_id: {
    type: Number,
    default: null,
  },
  navIndex: {
    type: Number,
    default: 1,
  },
  isGray: {
    type: Boolean,
    default: false,
  },
});

const isLoved = ref(props.love);

function handleClick() {
  emit('onLike', props.id, isLoved.value === 2 ? 1 : 2);
  isLoved.value = isLoved.value === 2 ? 1 : 2;
}

</script>

<style lang="scss" scoped>
.electronic-card {
  width: 100%;
  .el-tag {
    line-height: 24px;
    border: 0;
  }
  &-bottom {
    margin-top: 12px;
    display: flex;
    align-items: center;
    &-title {
      font-size: 19px;
      font-weight: 500;
      line-height: 28px;
      text-align: left;
    }

    &-but {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      line-height: 38px;
      margin-right: 10px;
      padding: 0;
    }
  }
  &-box {
    position: relative;
    background-color: var(--bg-color-0d0300);
    overflow: hidden;
    > div {
      position: absolute;
      left: 15px;
      top: 17px;
    }
    &-image {
      width: 100%;
      height: 228px;
      display: block;
      transition: all 0.4s linear;
      object-fit: cover;
    }
    &-pt {
      border: 0;
      background: var(--theme-color);
      font-size: 13px;
      font-weight: 500;
      font-style: normal;
      text-align: center;
      color: var(--font-color-fff);
      margin-right: 10px;
    }
    &-love {
      position: absolute;
      top: 21px;
      right: 15px;
      padding: 0;
      width: 38px;
      height: 38px;
      cursor: pointer;
    }
  }
  &:hover .electronic-card-box-image {
    transform: scale(1.1);
  }
}
</style>
