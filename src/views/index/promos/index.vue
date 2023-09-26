<template>
  <div class="discount-wrap">
    <div class="discount-wrap-tab">
      <div class="discount-wrap-title">
        <p
          v-for="(item, index) in tabList"
          :key="index"
          :class="{ 'active': index === activeIndex }"
          @click="handlerTab(index)"
        >{{ item }}</p>
      </div>
      <ul
        class="discount-wrap-content"
        v-loading="loading"
      >
        <li
          v-for="(item,index) in data"
          :key="index"
          v-loading="item.id === activeId && adLoading"
        >
          <div @click="openDetail(item)">
            <!-- <img
              v-failed
              :src="getPic(item, app)"
              alt
            />-->
            <el-image :src="item.index_pic">
              <template #error>
                <div
                  class="image-slot"
                  :style="{ 'background-image': `url(${$getSrc('/src/assets/images/placeholder.png')})` }"
                ></div>
              </template>
            </el-image>
          </div>
          <p @click="openDetail(item)">{{ !user?.isLogin && item.unsigned_option === 2 ? $t('登录/注册') : $t(`更多详情`) }}</p>
          <!-- goDetail(item, true) -->
        </li>
      </ul>
      <div
        class="discount-main-empty"
        v-if="isEmpty"
      >
        <img
          src="/src/assets/images/empty.png"
          alt
        />
        <p>{{ $t(`正在准备更多福利哦`) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed, inject, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { allbenefit, activitydetail } from '@/api/active';
import { getPic } from '@/utils/index';

const global = inject('global');
const $store = inject('store');
const { user, app } = $store.state;
const $router = useRouter();

const tabList = [
  global.$t(`全部`),
  global.$t(`VIP红利`),
  global.$t(`新手红利`),
  global.$t(`专题红利`),
  global.$t(`常规红利`),
];
const activeId = ref('');
const activeIndex = ref(0);
const config = {
  0: 0,
  1: 5,
  2: 1,
  3: 3,
  4: 2,
};
watch($router.currentRoute, (val) => {
  if (val?.query?.id) activeIndex.value = val?.query?.id * 1 ?? 0;
}, { immediate: true });
const isEmpty = ref(false);

const { data, run, loading } = useRequest(
  () => allbenefit({ b_type: config[activeIndex.value], CACHE: true }),
  {
    formatResult: (res) => res.data,
    onSuccess(res) {
      if (res.length === 0) {
        isEmpty.value = true;
      } else {
        isEmpty.value = false;
      }
    },
  },
);

const { data: adData, run: detailRun, loading: adLoading } = useRequest(activitydetail, {
  manual: true,
});

function openDetail(item) {
  if (!user?.isLogin && item.unsigned_option === 2) {
    global.$dialog({ tpl: 'GamePop' });
  } else {
    activeId.value = item.id;
    (async () => {
      await detailRun({ CACHE: true, id: item.id });
      global.$dialog({
        tpl: 'DiscountDetail',
        title: adData.value?.title ?? global.$t('更多详情'),
        name: adData?.name,
        content: adData.value?.detail_content,
        option: !user.isLogin ? adData.value?.unsigned_option : adData.value?.signed_option,
        showBtn: true,
        id: adData.value?.id,
      });
    })();
  }
}
function goDetail(item, bool) {
  const { id, url, type } = item;
  if (bool) {
    if (user?.isLogin) {
      global.$router.push('/deposit');
      return;
    }
    global.$router.push('/register');
    return;
  }
  // 后台配置了url的
  if (url) {
    // 第三方链接url
    if (url.startsWith('http') || url.startsWith('//')) {
      window.open(url, 'thirdActivity');
    } else if (url.startsWith('/')) {
      this.$router.push({
        path: url,
        query: {
          id,
        },
      });
    } else {
      this.$router.push({
        path: url,
      });
    }
    return;
  }

  if (type === 23) {
    this.$router.push({
      name: 'euroCup',
      query: {
        id,
      },
    });
    return;
  }

  this.$router.push({
    name: 'activeDetail',
    query: {
      id,
    },
  });
}

function handlerTab(index) {
  activeIndex.value = index;
  run();
}

</script>

<style lang="scss">
.discount-wrap {
  &-tab {
    width: 1200px;
    margin: 0 auto;
  }
  &-title {
    padding-top: 30px;
    width: 1155px;
    border-bottom: 2px solid var(--theme-color);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 45px;
    padding-bottom: 2px;
    p {
      min-width: 200px;
      padding: 0 20px 0 20px;
      height: 45px;
      font-size: 16px;
      font-family: SourceHanSansCN, SourceHanSansCN-Bold;
      font-weight: 700;
      text-align: center;
      color: var(--font-color-0C0C0C);
      line-height: 45px;
      box-sizing: border-box;
      transform: translateY(2px);
      border: 1px solid var(--border-color-e5e5e5);
      border-bottom: 0;
      cursor: pointer;
      transition: linear 0.1s;
      margin: 0 -1px 0 0;
    }
    p.active {
      border-left: 2px solid var(--theme-color);
      border-right: 2px solid var(--theme-color);
      border-top: 2px solid var(--theme-color);
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      position: relative;
      z-index: 2;
      color: var(--theme-color);

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        left: 0;
        background-color: var(--bg-color-fff);
      }
    }
  }
  &-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    list-style: none;
    padding-top: 30px;
    min-height: 200px;
    margin-right: -20px;
    li {
      width: 386px;
      height: 191px;
      margin: 0 20px 30px 0;
      div {
        width: 100%;
        height: 158px;
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;

          background-size: 50% auto;
          background-repeat: no-repeat;
          background-color: var(--bg-color-f5f5f5);

          img {
            transition: all 0.4s linear;
          }

          .image-slot {
            height: 100%;
            background-color: var(--dark-theme-color-2c2c2c, var(--bg-color-f5f5f5));
            background-repeat: no-repeat;
            background-size: 50% auto;
            background-position: center center;
          }
        }
      }
      &:hover img {
        transform: scale(1.1);
      }
      p {
        background-color: var(--bg-color-43535d);
        border-radius: 0px 0px 4px 4px;
        font-size: 14px;
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: var(--font-color-fff);
        line-height: 33px;
        cursor: pointer;
        margin: 0;
      }
    }
  }

  .together {
    padding: 90px 0 132px;
    font-size: 18px;
    color: var(--font-color-000);

    .align-center-wrap {
      align-items: flex-start;

      .title {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        line-height: 25px;
        margin: 0 0 26px;
      }

      .cooperation {
        flex: 1;

        .layout-flex-center {
          div {
            margin: 0 100px;

            img {
              width: 250px;
              margin-bottom: 34px;
            }

            p {
              margin: 0 0 9px;
            }
          }
        }
      }

      .brand {
        font-size: 16px;
        text-align: left;
        padding-right: 97px;

        .title {
          padding-right: 100px;
        }

        img {
          width: 343px;
          margin-right: 19px;
        }
      }
    }
  }

  .discount-main-empty {
    text-align: center;
    margin-top: -60px;

    img {
      width: 126px;
    }

    p {
      font-size: 20px;
      color: var(--font-color-404040);
      margin: 20px 0;
    }
  }
}
</style>
