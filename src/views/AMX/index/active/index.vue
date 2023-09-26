<template>
  <div class="active-wrap">
    <SubBanner id="1003" />
    <div class="active-body">
      <div class="align-center-wrap">
        <div class="layout-flex-between active-wrap-tabs">
          <div
            v-for="(item, index) in navList"
            :key="index"
            :class="[
              'layout-flex-center',
              data.activeIndex === item.type ? 'active' : '',
            ]"
            @click="goNav(item.type)"
          >
            <!-- <svg-icon :name="item.link" /> -->
            <span class="icon-text">{{ item.name }}</span>
          </div>
        </div>
        <ul class="active-wrap-list" v-loading="listLoading" v-if="data.list.length">
          <template
            v-for="(item, index) in data.list"
            :key="index"
            v-loading="item.id === activeId && adLoading"
          >
            <li @click="openDetail(item)">
              <div class="active-wrap-list-pic">
                <el-image
                  :src="item.index_pic"
                  style="width: 100%;height: 100%"
                  fit="cover"
                  @click="go(popData.url)"
                >
                  <template v-slot:error="error">
                    <!-- <img :src="$getSrc(`/src/assets/images/error.png`)" alt /> -->
                    <div></div>
                  </template>
                </el-image>
              </div>
              <div class="active-wrap-title">{{ item.name }}</div>
            </li>
          </template>
        </ul>
        <div v-else class="no-data flex">
          <div class="icon"></div>
          <p>{{ $t('暂无数据') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRequest } from 'ahooks-vue';
import { reactive, inject, ref } from 'vue';
import { allbenefit, activitydetail } from '@/api/active';
import SubBanner from '@/components/Banner/sub.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const data = reactive({
  activeIndex: 0,
  list: [],
});
const activeId = ref('');
const navList = [
  { name: global.$t('全部'), type: 0, link: 'brand-all' },
  { name: global.$t('VIP红利'), type: 5, link: 'active-vip' },
  { name: global.$t('新手红利'), type: 1, link: 'active-new' },
  { name: global.$t('专题红利'), type: 3, link: 'active-special' },
  { name: global.$t('常规红利'), type: 2, link: 'active-normal' },
  { name: global.$t('限时红利'), type: 4, link: 'active-time' },
];
const allType = [
  { className: 'newbie', text: '新手' },
  { nameclassName: 'regular', text: '常规' },
  { className: 'topic', text: '专题' },
  { className: 'time-limited', text: '限时' },
  { className: 'vip', text: 'VIP' },
  { className: 'regular', text: '常规' },
];

const { run, loading: listLoading } = useRequest(
  () => allbenefit({ b_type: data.activeIndex }),
  {
    manual: false,
    onSuccess: (res, params) => {
      data.list = res.data;
    },
  },
);
const { data: adData, run: adRun, loading: adLoading } = useRequest(activitydetail, {
  manual: true,
});
function goNav(type) {
  data.activeIndex = type;
  data.list = [];
  run();
}
function goDetail(item, bool) {
  const { id, url, type } = item;
  if (bool) {
    global.$router.push(
      user?.isLogin ? '/center/fund-management/deposit' : '/register',
    );
    return;
  }

  // 后台配置了url的
  if (url) {
    // 第三方链接url
    if (url.startsWith('http') || url.startsWith('//')) {
      window.open(url, 'thirdActivity');
    } else if (url.startsWith('/')) {
      global.$router.push({
        path: url,
        query: {
          id,
        },
      });
    } else {
      global.$router.push({
        path: url,
      });
    }
    return;
  }
  if (type === 23) {
    global.$router.push({
      name: 'euroCup',
      query: {
        id,
      },
    });
    return;
  }

  global.$router.push({
    name: 'activeDetail',
    query: {
      id,
    },
  });
}
function openDetail(item) {
  if (!user?.isLogin && item.unsigned_option === 2) {
    global.$dialog({ tpl: 'GamePop' });
  } else {
    global.$router.push({
      name: 'promosDetail',
      query: {
        id: item.id,
        option: !user.isLogin ? adData.value?.unsigned_option : adData.value?.signed_option,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.active-wrap {
  padding-bottom: 50px;

  .active-body {
    > .align-center-wrap {
      width: 1250px;
      background-color: var(--bg-color-1e1e1e);
      padding: 0;
      .active-wrap-title {
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        color: var(--font-color-000);
        padding: 15px;
      }
    }
  }

  &-tabs {
    margin-top: 40px;
    padding-bottom: 20px;
    background: var(--bg-color-14223b);
    justify-content: center;
    > div {
      min-width: 72px;
      cursor: pointer;
      border-radius: 6px;
      font-size: 18px;
      font-weight: 500;
      color: var(--cur-font-color-999);
      line-height: 25px;
      padding: 25px 25px 12px;
      position: relative;
      > .svg-icon {
        display: block;
        width: 30px;
        height: 30px;
        fill: var(--font-color-717171);
        margin-right: 10px;
      }
      &.active {
        > span {
          color: var(--theme-color);
        }

        > .svg-icon {
          fill: var(--color-white) !important;
        }
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 3px;
          background: var(--theme-color);
        }
      }
    }
  }

  &-list {
    overflow: hidden;
    padding: 25px 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    min-height: 50vh;
    justify-content: flex-start;
    background: var(--bg-color-282828);
    > li {
      position: relative;
      width: 380px;
      height: 250px;
      margin-left: 28px;
      transition: all 0.45s ease;
      border: 1px solid var(--border-color-3c3c3c);
      margin-bottom: 16px;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 10px 15px rgba(40, 40, 40, 0.4);
      }
    }

    &-pic {
      width: 380px;
      height: 200px;
      cursor: pointer;
      background-image: url('/src/current_project/assets/images/error/error.png');
      background-position: center;
      background-repeat: no-repeat;
      background-size: auto 50%;
      background-color: var(--dark-666, var(--bg-color-f1f1f1));
      > img {
        display: block;
        height: 100%;
        width: 100%;
      }
    }

    &-content {
      position: relative;
      padding: 30px 20px 30px 30px;
      background: var(--bg-color-282828);

      > .title {
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 24px;
        font-weight: 500;
        color: var(--font-color-fff);
        line-height: 33px;
      }

      > .center {
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        text-align: left;
        margin-top: 18px;
        width: 340px;
        height: 84px;
        font-size: 16px;
        color: var(--font-color-666);
        line-height: 28px;

        :deep(h2),
        :deep(p) {
          margin: 0;
          font-size: 16px;
        }
      }

      > .bottom {
        margin-top: 20px;

        > .btn {
          font-weight: 500;
          width: 175px;
          height: 44px;
          line-height: 44px;
          padding: 0;

          &:hover {
            background-color: var(--theme-color);
            color: var(--font-color-fff);
          }
        }
      }

      > .icon {
        position: absolute;
        top: 25px;
        right: 20px;
        width: 54px;
        height: 26px;
        line-height: 26px;
        border-radius: 2px;
        font-size: 16px;
        font-weight: 500;
        color: var(--font-color-fff);
        text-align: center;
      }

      > .vip {
        background: linear-gradient(90deg, var(--theme-color) 0%, var(--theme-color) 99%);
      }

      > .topic {
        background: linear-gradient(90deg, rgba(124, 134, 233, 1) 0%, rgba(84, 95, 208, 1) 100%);
      }

      > .newbie {
        background: linear-gradient(135deg, rgba(255, 154, 93, 1) 0%, rgba(255, 57, 55, 1) 100%);
      }

      > .regular {
        background-image: linear-gradient(135deg, #464646 0%, #383838 100%);
      }

      > .time-limited {
        background-image: linear-gradient(129deg, #d75dff 0%, #b543e2 100%);
      }
    }

    > li:nth-child(3n + 3) {
      margin-right: 0;
    }
  }
  .no-data {
    width: 100%;
    height: 200px;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .icon {
      width: 79px;
      height: 80px;
      // background: url(@img/promos/nodata.png) no-repeat center;
      background-size: contain;
    }
    p {
      margin-top: 10px;
      height: 26px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 26px;
    }
  }
}
</style>
