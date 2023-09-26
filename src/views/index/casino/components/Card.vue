<template>
  <div class="real-card">
    <div class="real-card-box">
      <img :src="love === -1 ? $getSrc(item?.pic) : item?.pic" class="real-card-box-image" width="444" height="264"
        v-login @click="$playGame(item, 1)" />
    </div>
    <div>
      <div class="real-card-info">
        <h1>
          <el-tag size="small" class="electronic-card-box-pt" v-show="platName">
            {{ platName }}
            <template v-if="isGray">({{ $t('维护中') }})</template>
          </el-tag>
          <span :title="item?.name">{{ love === -1 ? item.title : item?.name }}</span>
        </h1>
        <span class="real-card-info-link" v-login @click="$playGame(item, 1)">{{ $t(`进入大厅`) }}</span>
      </div>
      <div class="real-card-bottom">
        <span class="real-card-bottom-describe">{{ item?.desc }}</span>

        <template v-if="love !== -1">
          <img class="real-card-bottom-love" v-login @click="handleClick"
            :src="$getSrc(`/src/assets/images/Collection-${(isLoved === 1 || navIndex === 5) ? 1 : 2}.webp`)" alt="" />
        </template>

        <!-- <el-button
                  type="text"
                  :class="`real-card-bottom-love ${item?.is_favorite ?? 1===1 ? 'real-card-bottom-loved' : ''}`"
                  @click="handleClick"
              />-->
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, computed, watch,
} from 'vue';

const global = inject('global');

// 获取 emit
const emit = defineEmits(['onLike']);

const props = defineProps({
  item: {
    type: Object,
    default: () => { },
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
    default: 'AG',
  },
  describe: {
    type: String,
    default: '',
  },
  love: {
    type: Number,
    default: 2,
  },
  plat: {
    type: Array,
    default: () => [],
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
const platName = computed(() => props.plat.filter((child) => child?.id === props?.item?.game_platform_id)[0]?.name);

function handleClick() {
  emit('onLike', props.id, isLoved.value);
  isLoved.value = isLoved.value === 2 ? 1 : 2;
}
</script>

<style lang="scss">
.real-card {
  width: 100%;

  .el-card {
    border: 0;
  }

  &-box {
    background-color: var(--bg-color-0d0300);
    overflow: hidden;

    &-image {
      width: 100%;
      height: 228px;
      display: block;
      transition: all 0.4s linear;
      object-fit: cover;
      cursor: pointer;
    }
  }

  &-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    h1 {
      flex: 2;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      text-align: left;
      color: var(--font-color-000);
      line-height: 1;
      letter-spacing: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;

      .el-tag {
        margin-right: 5px;
        background-color: var(--theme-color);
        color: var(--font-color-fff);
        border: 0;
        line-height: 24px;
      }

      span:last-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    >span {
      font-size: 19px;
      line-height: 28px;
      font-size: 19px;
      font-weight: 400;
      text-align: right;
      line-height: 1;
      letter-spacing: 0px;
      color: var(--theme-color);
      cursor: pointer;
    }
  }

  &-bottom {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    &-describe {
      flex: 1;
      font-size: 17px;
      text-align: left;
      line-height: 20px;
      color: var(--font-color-929292);
    }

    &-love {
      padding: 0;
      width: 38px;
      height: 38px;
      cursor: pointer;
    }
  }

  &:hover .real-card-box-image {
    transform: scale(1.1);
  }
}
</style>
