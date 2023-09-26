<template>
  <div
    class="home-my-promos-wrap"
    v-loading="loading"
  >
    <div
      class="align-center-wrap"
      v-if="data?.length"
    >
      <div class="home-card-title">{{ $t(`我的优惠`) }}</div>
      <div
        class="layout-flex-center home-hot-game"
        v-loading="loading"
      >
        <!-- :style="{ 'background-image': `url('${promos.index_pic}')` }" -->
        <div
          v-for="promos in data"
          :key="promos.title"
          class="game-item"
        >
          <div class="cover">
            <!-- <img
              :src="getPic(promos, app)"
              alt
            />-->
            <el-image
              :src="promos.index_pic"
              fit="cover"
            >
              <template #error>
                <div
                  class="image-slot"
                  :style="{ 'background-image': `url(${$getSrc('/src/assets/images/placeholder.png')})` }"
                ></div>
              </template>
            </el-image>
          </div>
          <div class="bot">
            <p>{{ promos.name }}</p>
            <el-button
              type="primary"
              class="btn"
              @click="openDetail(promos)"
            >{{ $t(`查看详情`) }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { allbenefit, activitydetail } from '@/api/active';
import { getPic } from '@/utils/index';

const global = inject('global');
const $store = inject('store');
const { user, app } = $store.state;

const { data, loading } = useRequest(() => allbenefit({ b_type: 0 }), {
  formatResult: (res) => res?.data?.slice?.(0, 4) ?? [],
});

const { data: adData, run: detailRun, loading: adLoading } = useRequest(activitydetail, {
  manual: true,
});

async function openDetail(item) {
  if (!user?.isLogin && item.unsigned_option === 2) {
    global.$dialog({ tpl: 'GamePop' });
  } else {
    (async () => {
      await detailRun({ CACHE: true, id: item.id });
      global.$dialog({
        tpl: 'DiscountDetail',
        title: adData.value?.title ?? global.$t('更多详情'),
        name: adData?.name,
        content: adData.value?.detail_content ?? JSON.parse(adData.value?.detail_content_trans)?.[app.lang],
        option: user.isLogin ? adData.value?.signed_option : adData.value?.unsigned_option,
        id: adData.value?.id,
        showBtn: true,
      });
    })();
  }
}

</script>

<style lang="scss">
.home-my-promos-wrap {
  padding: 46px 0 46px;
  .home-hot-game {
    margin: 30px -20px 0 0;
    box-sizing: border-box;
    justify-content: flex-start;
    .game-item {
      width: calc(100% / 4 - 20px);
      position: relative;
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position: center;
      transition: background-size 0.4s linear;
      margin-right: 20px;

      .cover {
        overflow: hidden;

        .el-image {
          display: block;
          width: 100%;
          height: 175px;
          object-fit: cover;

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
      .bot {
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-color-000-6);
        padding: 0 10px 0 28px;
        p {
          font-size: 20px;
          font-family: var(--font-family-medium);
          font-weight: 500;
          text-align: left;
          color: var(--font-color-fff);
          line-height: 24px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .el-button {
          min-width: 156px;
          font-size: 18px;
          color: var(--font-color-fff);
          border-radius: 0;
          height: 40px;
          min-height: 40px;
          padding: 0;
        }
      }
    }
  }
}
</style>
