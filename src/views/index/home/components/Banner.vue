<template>
  <div v-loading="bannerLoading" ref="bannerRef" class="banner-wrap">
    <el-carousel v-if="!bannerLoading" ref="carousel" :height="`${bannerHeight}px`"
      :autoplay="!bannerLoading && autoplay" indicator-position="none" @change="val => bannerActive = val">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <div class="banner-img" @click="openDetail(item)">
          <img @load="imgLoaded" :src="item.pic" alt />
        </div>
      </el-carousel-item>
    </el-carousel>
    <ul class="layout-flex-center banner-wrap-tips" @mouseenter="autoplay = false" @mouseleave="autoplay = true">
      <li v-for="(item, index) in bannerList" :key="index" :class="{ active: bannerActive === index }"
        @click="handleBannerClick(index)">
        <p>{{ item.title }}</p>
        <!-- <span>{{ item.tips }}</span> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, inject, nextTick } from 'vue';
import { useRequest, useSize } from 'ahooks-vue';
import { indexbanner } from '@/api/home';
import { activitydetail } from '@/api/active';

const global = inject('global');
const { app } = global.$store.state;

const carousel = ref(null);
const bannerActive = ref(0);
const autoplay = ref(true);

const {
  data: bannerList, loading: bannerLoading,
} = useRequest(indexbanner);

const { data: adData, run: detailRun, loading: adLoading } = useRequest(activitydetail, {
  manual: true,
});

const bannerRef = ref(null);
const bannerHeight = ref(800);
const bannerScale = 3.2;

const size = useSize(bannerRef, {
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

function handleBannerClick(index) {
  bannerActive.value = index;
  carousel.value.setActiveItem(index);
}

async function openDetail(item) {
  if (item.link) {
    await detailRun({ CACHE: true, id: item.link });
    global.$dialog({
      tpl: 'DiscountDetail', title: adData.value?.title ?? global.$t('更多详情'), name: adData?.name, content: adData.value?.detail_content, option: adData.value?.signed_option, id: adData.value?.id, showBtn: true,
    });
  }
}

</script>

<style lang="scss">
.banner-wrap {
  position: relative;
  text-align: center;

  .el-carousel__item {
    transform: unset !important;
    display: unset !important;

    &:first-of-type {
      z-index: 1 !important;
    }

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
    cursor: pointer;
    position: relative;

    img {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: blur(20px);
      object-fit: cover;
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
</style>
