<template>
  <div v-loading="bannerLoading" ref="bannerWrapRef" class="banner-move-wrap">
    <div class="single-banner" v-if="bannerList?.length === 1">
      <el-image @load="imgLoaded" :src="bannerList?.[0]?.pic" fit="fill" alt />
    </div>
    <el-carousel ref="bannerRef" :height="`${bannerHeight}px`" v-else>
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <div class="banner-img" @click="bannerItemClick(item)">
          <el-image @load="imgLoaded" :src="item.pic" fit="fill" alt />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useSize } from 'ahooks-vue';
import { useIndexBanner } from '@/hooks';

const { bannerRef, bannerList, bannerLoading, bannerItemClick } = useIndexBanner()


const bannerWrapRef = ref(null);
const bannerHeight = ref(800);
const bannerScale = 3.2;

const size = useSize(bannerWrapRef, {
  onChange() {
    bannerHeight.value = size.width / bannerScale;
  },
});

function imgLoaded(e) {
  nextTick(() => {
    const target = e.target ?? e?.path?.[0];
    target.style.filter = 'none';
  });
}
</script>

<style lang="scss">
.banner-move-wrap {
  position: relative;
  text-align: center;

  .el-carousel__item {
    transform: unset !important;
    display: unset !important;

    &.is-animating {
      .banner-img {
        img {
          animation: imgOut 0.4s ease-in forwards;
        }
      }
    }

    &.is-active.is-animating {
      .banner-img {
        img {
          animation: imgIn 0.4s ease-in forwards;
        }
      }
    }
  }

  .banner-img {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
    position: relative;

    .el-image {
      width: 100%;
      height: 100%;
    }

    img {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: blur(20px);
    }
  }

  .banner-wrap-tips {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 66px;
    background-color: var(--bg-color-000-4);
    z-index: 2;

    li {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      p {
        font-size: 20px;
        font-family: var(--font-family-bold);
        font-weight: 700;
        text-align: center;
        color: var(--font-color-fff);
        line-height: 30px;
        margin: 0;
      }

      span {
        font-size: 14px;
        font-family: var(--font-family-bold);
        font-weight: 400;
        text-align: center;
        color: var(--font-color-fff);
        line-height: 21px;
      }
    }

    li.active {
      border-bottom-color: var(--theme-color);

      p,
      span {
        color: var(--theme-color);
      }
    }
  }

  .el-carousel__arrow {
    &:hover {
      color: var(--theme-color);
    }
  }

  .el-carousel__indicators {
    bottom: 27px;
    padding: 0 12px;
    border-radius: 9px;
    background: var(--bg-color-25252503);
    height: 18px;

    .el-carousel__indicator {
      padding: 0;
      height: 100%;
      display: block;
      overflow: hidden;
      float: left;

      &:not(:last-child) {
        margin-right: 10px;
      }

      button {
        display: block;
        height: 4px;
        border-radius: 2px;
        margin-top: 7px;
        width: 4px;
        opacity: 0.3;
      }

      &.is-active {
        button {
          opacity: 1;
          width: 30px;
        }
      }
    }
  }
}

@keyframes imgIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes imgOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(1.2);
    opacity: 0;
  }
}

.single-banner {
  width: 100vw;
  min-height: 500px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
