<template>
  <div
    class="notice-wrap"
    v-loading="noticeLoading"
  >
    <div class="notice-wrap-btn">
      <el-button
        type="primary"
        @click="allRead"
        :loading="allReadLoading"
      >{{ $t('标记全部为已读') }}</el-button>
    </div>
    <div
      class="notice-wrap-item"
      v-for="(item,index) in data.noticeList"
      :key="index"
      @click="readNotice(item)"
    >
      <div :class="['layout-flex-between notice-wrap-item-title', { 'unRead': !item.is_read }]">
        <h2 class="layout-flex-center">
          <!-- <img
            v-if="item.is_important===1"
            src="@/assets/images/center/important.png"
            alt=""
            class="icon-important"
          >-->
          <svg-icon
            name="important"
            v-if="item.is_important === 1"
            class="icon-important"
          />
          <span>{{ item.title }}</span>
          <!-- <el-tag
            effect="plain"
            size="medium"
            v-if="item.is_important === 1"
          >{{$t('重要')}}</el-tag>-->
        </h2>
        <p>{{ item.updated_at }}</p>
      </div>
      <p class="notice-wrap-item-con">{{ item.content }}</p>
    </div>
    <div class="record-nodata" v-show="!data.noticeList.length">
      <svg-icon name="bell" />
      <p>{{ $t('暂无任何信息') }}</p>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :page-count="data.totalPage"
      :current-page="data.page"
      @current-change="pageUpdate"
    />
  </div>
</template>

<script setup>
import { inject, reactive, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import {
  sitenotice, readallnotice, readnotice,
} from '@/api/center';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;

const data = reactive({
  page: 1,
  totalPage: 0,
  noticeList: [],
});

const { run: noticeRun, loading: noticeLoading } = useRequest(() => sitenotice({
  per_page: 3, page: data.page, uid: user?.userInfo?.id, is_pic: 0,
}), {
  manual: false,
  onSuccess: (res) => {
    data.noticeList = res.data;
    data.totalPage = res.last_page;
  },
});
const { run: allRead, loading: allReadLoading } = useRequest(() => readallnotice({ uid: user?.userInfo?.id }), {
  manual: true,
  onSuccess: (res) => {
    noticeRun();
    $store.dispatch('user/getUserInfo');
  },
});
function pageUpdate(val) {
  data.page = val;
  noticeRun();
}

const { run: itemRead, loading: itemReadLoading } = useRequest(readnotice, {
  manual: true,
  onSuccess: (res) => {
    $store.dispatch('user/getUserInfo');
  },
});
function readNotice(item) {
  const { id } = item;
  itemRead({ site_notice_id: `${id}` });
  item.is_read = true;
}
</script>

<style lang="scss" scoped>
.notice-wrap {
  position: relative;
  &-btn {
    text-align: right;
    margin-bottom: 30px;
    position: absolute;
    top: -93px;
    right: 0;
  }

  &-item {
    border-radius: 6px;
    transition: 0.3s;
    padding: 30px 30px 30px 46px;
    cursor: pointer;
    color: var(--font-color-999);
    font-size: 14px;

    &:nth-child(even) {
      background-color: var(--bg-color-efefef);
    }

    &.is-read {
      background-color: var(--bg-color-f66);
    }

    .el-tag--plain {
      background-color: transparent;
      border-color: var(--theme-color);
      color: var(--theme-color);
      margin-left: 10px;
      font-size: 12px;
      height: 24px;
      line-height: 22px;
    }

    &:hover {
      background-color: var(--theme-color);

      h2,
      p {
        color: var(--font-color-fff);
      }

      .el-tag--plain {
        border-color: var(--border-color-fff);
        color: var(--border-color-fff);
      }

      .icon-important {
        color: var(--font-color-fff) !important;
        fill: var(--font-color-fff) !important;
      }
    }

    &-title {
      position: relative;

      &.unRead::before {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        opacity: 1;
        background: var(--danger-color);
        border-radius: 50%;
        left: -16px;
        top: 50%;
        transform: translateY(-50%);
      }

      h2 {
        flex: 1;
        color: var(--font-color-000);
        font-size: 20px;
        margin: 0;
        justify-content: flex-start;
        font-weight: 600;
      }

      p {
        margin: 0;
        color: var(--font-color-000);
      }
    }

    &-con {
      line-height: 24px;
      text-align: left;
      margin: 10px 0 0;
      color: var(--font-color-000);
    }
  }
  .record-nodata i {
    color: var(--theme-color);
    font-size: 40px;

    .svg-icon {
      width: 47px;
      height: 60px;
    }
  }
  .icon-important {
    width: 13px;
    margin-right: 7px;
    color: var(--theme-color) !important;
    fill: var(--theme-color) !important;
  }
}
</style>
