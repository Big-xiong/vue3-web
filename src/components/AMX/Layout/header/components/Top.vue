<template>
  <div class="app-header-top">
    <div class="align-center-wrap-1200">
      <div class="layout-flex-center">
        <div class="layout-flex-center app-header-top-notice">
          <svg-icon name="top_gg" />
          <ul :class="{ anim: data.animate }"
            @click="$router.push({ name: 'centerNotice', params: { title: '最新公告' } })">
            <li v-for="notice in data.noticeArr" :key="notice.id">{{ `${notice.title}: ${notice.content}` }}</li>
          </ul>
        </div>
        <div class="layout-flex-center app-header-top-right">
          <!-- <el-tooltip
            :content="$t('新手教程')"
            placement="bottom"
            popper-class="header-tooltip"
            class="app-header-top-right-appdown"
            effect="light"
            :visible-arrow="false"
          >
            <div
              class="pointer"
              @click="$router.push({ name: 'helpQuestion' })"
            >
              <svg-icon name="discovery" />
            </div>
          </el-tooltip>-->

          <el-tooltip :content="$t('APP下载')" placement="bottom" popper-class="header-tooltip"
            class="app-header-top-right-appdown" effect="light" :visible-arrow="false">
            <div class="pointer" @click="$router.push({ name: 'appDownload' })">
              <img src="@img/header/APP.png" alt />
              <!-- <svg-icon name="phone" /> -->
            </div>
          </el-tooltip>
          <el-tooltip :content="$t('收藏')" placement="bottom" class="love" popper-class="header-tooltip" effect="light"
            :visible-arrow="false">
            <div @click="addFavorite">
              <!-- <svg-icon name="love" /> -->
              <img src="@img/header/sc.png" alt />
            </div>
          </el-tooltip>
          <el-tooltip :content="$t('保存到桌面')" placement="bottom" popper-class="header-tooltip" effect="light"
            :visible-arrow="false">
            <div class="love" @click="toDesktop">
              <!-- <svg-icon name="computer" /> -->
              <img src="@img/header/dn.png" alt />
            </div>
          </el-tooltip>
          <div class="mail-show">
            <!-- <svg-icon
              name="mail"
              v-login
              @click="$router.push({ name: 'centerSiteMail' })"
            />-->
            <img src="@img/header/email.png" v-login
              @click="$router.push({ name: 'centerSiteMail', params: { title: '站内信' } })" alt />
            <div v-if="user?.userInfo && user?.userInfo.user_notice_unread_counts > 0" class="nums">{{ user?.userInfo ?
                user?.userInfo.user_notice_unread_counts : ''
            }}</div>
            <div v-if="user?.userInfo && user?.userInfo.user_notice_unread_counts > 0" class="mail">
              <div class="title">
                {{ $t('通知事项') }}
                <span>{{ $t('您有') }}{{ user?.userInfo ? user?.userInfo.user_notice_unread_counts : 0 }}{{ $t('条新通知')
                }}</span>
              </div>
              <div class="list">
                <div v-for="(item, $index) in messageList" v-show="$index < 4" :key="item.id" class="item pointer"
                  @click="$router.push({ name: 'centerSiteMail', params: { title: '站内信' } })">
                  <div v-show="item.is_read !== 2" class="dot" />
                  <div class="title" v-if="msgTypeList && msgTypeList?.length">{{ msgTypeList[item.type] }}</div>
                  <div class="content">{{ item.content }}</div>
                  <div class="time">{{ item.updated_at }}</div>
                </div>
              </div>
              <div class="bottom pointer" @click="$router.push({ name: 'centerSiteMail', params: { title: '站内信' } })">{{
                  $t('更多消息动态')
              }}</div>
            </div>
          </div>
          <!-- <Lang /> -->
          <el-dropdown trigger="click" class="language" popper-class="language-dropdown"
            @command="lang => $store.commit('app/SET_LANGUAGE', { lang, global })">
            <span class="el-dropdown-link">
              <img src="/src/assets/images/header/zh-CN.png" alt />
              <i class="icon-white el-icon-arrow-down" />
            </span>
            <template #dropdown>
              <el-dropdown-menu class="language-drop">
                <el-dropdown-item command="zh">
                  <img :src="$getSrc('/src/assets/images/header/cn.png')" alt />
                  <span class="languagesChoice">{{ $t("中文") }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  inject, reactive, computed, watch, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { saveAs } from 'file-saver';
import { message, messagetypelist, sitenotice } from '@/api/center';
import Lang from '@/components/Layout/header/components/Lang.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const isLogin = computed(() => user.isLogin);

const { run: messageRun, data: messageList } = useRequest(() => message({ t: Date.parse(new Date()) }), {
  manual: true,
  formatResult: (res) => res.data,
});
const { run: typeRun, data: msgTypeList } = useRequest(messagetypelist, {
  manual: true,
  onSuccess(res) {
    messageRun({ noCancel: true });
  },
});

watch(() => user.isLogin, () => {
  if (user.isLogin) {
    typeRun({ noCancel: true });
  }
}, { immediate: true });
const data = reactive({
  animate: false,
  noticeArr: [],
});

function ScrollUp() {
  setInterval(() => {
    data.animate = true;
    setTimeout(() => {
      data.noticeArr.push(data.noticeArr[0]);
      data.noticeArr.shift();
      data.animate = false;
    }, 800);
  }, 3000);
}

sitenotice().then((res) => {
  data.noticeArr = res.data;
  ScrollUp();
});

function addFavorite() {
  const url = window.location;
  const { title } = document;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('msie 8') > -1) {
    external.AddToFavoritesBar(url, title, '');// IE8
  } else {
    try {
      window.external.addFavorite(url, title);
    } catch (error) {
      try {
        window.sidebar.addPanel(title, url, '');// firefox
      } catch (errors) {
        // this.addFavoriteDialogVisible = true
        global.$alert(global.$t('请使用 Ctrl + D 加入收藏'), {
          confirmButtonText: '确定',
          center: true,
        });
      }
    }
  }
}
const subConfig = inject('subConfig');
function toDesktop() {
  const { origin } = window.location;
  const txtBlob = new Blob([
    `[InternetShortcut]\n`,
    `URL=${origin}\n`,
    `IconFile=${`${origin}/src/assets/images/favicon.ico`}\n`,
    `IconIndex=0\n`,
    `HotKey=1613\n`,
    `IDList=[{000214A0-0000-0000-C000-000000000046}]\n`,
    `Prop3=19,2\n`,
  ], {
    type: 'charset=utf-8',
  });
  saveAs(txtBlob, `${subConfig.desktopFileName}.html`);
}

</script>
<style lang="scss" scoped>
.app-header-top {
  position: relative;
  height: 35px;
  line-height: 35px;
  font-size: 12px;
  -webkit-transition: all 0.45s ease-out;
  transition: all 0.45s ease-out;
  z-index: 2;
  color: var(--font-color-ccc);
  border-bottom: 1px solid var(--border-color-fff-1);

  img {
    width: 24px;
    fill: var(--bg-color-525152);

    &:hover {
      color: var(--color-white);
    }
  }

  &-notice {
    position: relative;
    height: 36px;
    justify-content: flex-start;
    color: var(--font-color-fff);

    .icon-top_gg {
      width: 19px;
      height: 18px;
      fill: var(--font-color-fff);
      margin-right: 7px;
    }

    ul {
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      transition: top 0.8s;
      padding: 0;
      margin: 0;
      list-style: none;
      flex: 1;

      &.anim {
        transition: all 0.8s;
        margin-top: -36px; //高度等于行高
        overflow: hidden;
        height: 72px;
      }

      li {
        text-align: left;
        cursor: pointer;
        width: 660px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &-right {
    justify-content: flex-end;
    flex: 1;

    >div {
      cursor: pointer;
      margin-left: 35px;
    }

    .svg-icon {
      width: 20px;
      height: 20px;
    }

    &-help {
      .svg-icon {
        margin-left: 5px;
      }
    }

    .language {
      .el-dropdown-link {
        cursor: pointer;
        margin-left: 35px;

        img {
          width: 18px;
          height: 18px;
          display: inline-block;
          vertical-align: middle;
          border-radius: 50px;
          margin-right: 5px;
        }
      }
    }

    .mail-show {
      position: relative;

      &:hover {
        .mail {
          display: block;
        }
      }

      .nums {
        position: absolute;
        top: 4px;
        left: 100%;
        width: 14px;
        height: 14px;
        background: var(--font-color-f66);
        border-radius: 10px;
        line-height: 14px;
        font-size: 12px;
        text-align: center;
        color: var(--font-color-fff);
        padding: 0 2px;
      }

      .mail {
        position: absolute;
        right: 0;
        width: 360px;
        z-index: 800;
        display: none;

        >.title {
          background: var(--theme-color);
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          color: var(--font-color-fff);
          text-align: left;
          padding-left: 20px;

          span {
            float: right;
            margin-right: 20px;
            font-size: 12px;
            color: var(--font-color-fff);
          }
        }

        .list {
          background: var(--bg-color-181818);
          line-height: normal;
          text-align: left;

          .item {
            position: relative;
            border-bottom: var(--border-color-fff-1) 1px solid;
            padding: 10px 20px;
            box-sizing: border-box;

            &:hover {
              background: var(--bg-color-353435);
            }

            .dot {
              position: absolute;
              top: 23px;
              left: 10px;
              background: #f66;
              width: 6px;
              height: 6px;
              border-radius: 20px;
            }

            .title {
              font-size: 14px;
              color: var(--font-color-f5f5f5);
            }

            .content {
              font-size: 12px;
              color: var(--font-color-000);
              margin: 5px 0 10px 0;
              width: 320px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .time {
              font-size: 12px;
              color: var(--font-color-525152);
            }
          }
        }

        .bottom {
          height: 50px;
          line-height: 50px;
          background: var(--theme-color);
          border-radius: 0 0 10px 10px;
          font-size: 14px;
          color: var(--font-color-fff);
          text-align: center;
        }
      }
    }
  }
}
</style>
