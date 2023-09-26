<template>
  <div class="app-footer">
    <div class="app-footer-link">
      <div class="align-center-wrap-1200">
        <div class="app-footer-link-list layout-flex-center">
          <div class="layout-flex-center">
            <svg-icon name="footer-phone"></svg-icon>
            <div>
              <p>{{ $t('联系我们') }}</p>
              <p>{{ $t('24X7为您提供服务') }}</p>
              <a :href="`mailto:${dicts?.siteinfo?.email || ''}`">
                <!--{{ $t("免费电话") }}-->{{ dicts?.siteinfo?.email }}
              </a>
            </div>
          </div>
          <div class="layout-flex-center">
            <svg-icon name="footer-new"></svg-icon>
            <div>
              <p>{{ $t('新手教程') }}</p>
              <p>{{ $t('24X7为您提供服务') }}</p>
              <router-link :to="{ name: 'helpQuestion', query: { id: '0-0' } }">{{ $t("立即查看") }}></router-link>
            </div>
          </div>
          <div class="layout-flex-center">
            <svg-icon name="footer-agent"></svg-icon>
            <div>
              <p>{{ $t('加入合营') }}</p>
              <p>{{ $t('24X7为您提供服务') }}</p>
              <router-link :to="{ name: 'agentLanding' }">{{ $t("立即加入") }}></router-link>
            </div>
          </div>
        </div>
        <IconLinks />
      </div>
    </div>
    <CopyRight />
  </div>
</template>
<script setup>
import {
  inject, reactive, computed, watchEffect,
} from 'vue';
import CopyRight from './components/CopyRight.vue';
import IconLinks from './components/IconLinks.vue';

const props = defineProps({
  isShowLinkList: {
    type: Boolean,
    default: false,
  },
});

const global = inject('global');
const $store = inject('store');
$store.dispatch('app/getDict', ['siteinfo']);
const { dicts } = $store.state.app;

const navList = [
  {
    en: global.$t('AA集团'),
    link: 'ace-advanture.com',
    logo: 1,
  },
  {
    en: global.$t('万趣娱乐'),
    link: 'wanqu.bet',
    logo: 7,
  },
  {
    en: global.$t('AA电投'),
    link: 'aadiantou.com',
    logo: 5,
  },
  {
    en: global.$t('AA游艇会'),
    link: 'aa-yth.com',
    logo: 4,
  },
  {
    en: global.$t('AA俱乐部'),
    link: 'aavipjlb.com',
    logo: 6,
  },
];
const routes = [
  {
    title: global.$t('常见问题'),
    name: '',
  },
  {
    title: global.$t('品牌实力'),
    name: '',
  },
  {
    title: global.$t('游戏手册'),
    name: '',
  },
  {
    title: global.$t('安全保障'),
    name: '',
  },
];
</script>
<style lang="scss" scoped>
/* stylelint-disable */
.app-footer {
  background-color: var(--bg-color-191919);

  &-middle {
    width: 1200px;
    margin: 0 auto;
  }

  &-link {
    border-bottom: 1px solid var(--border-color-353435);
    padding: 30px 0 20px;

    &-list {
      margin-bottom: 30px;

      >div {
        text-align: left;

        &:not(:first-child) {
          margin-left: 170px;

          a:hover {
            color: var(--font-color-ccc);
          }
        }
      }

      .svg-icon {
        width: 60px;
        height: 60px;
        margin-right: 15px;
        fill: var(--font-color-fff) !important;
      }

      p:first-child {
        margin: 0;
        font-size: 16px;
        color: var(--font-color-ccc);
        line-height: 22px;
      }

      p:nth-child(2) {
        font-size: 14px;
        color: var(--font-color-ccc);
        margin: 5px 0;
        line-height: 20px;
      }

      a:nth-child(3) {
        font-size: 14px;
        color: var(--theme-color);
        margin: 0;
        text-decoration: none;
      }
    }

    &-icon {
      i {
        margin-right: 40px;
        transition: all 0.45s ease-out;
        cursor: pointer;
        width: 60px;
        margin-top: 10px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;

        @for $i from 1 through 11 {
          &:nth-child(#{$i}) {
            height: 35px;
            background-image: url('/src/assets/images/footer/logo/#{$i}.png');

            &:hover {
              background-image: url('/src/assets/images/footer/logo/#{$i}_active.png');
            }
          }
        }
      }
    }
  }

  &-copyright {
    padding: 30px 0;

    &-title {
      color: var(--font-color-949494);
      text-align: center;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    &-list {
      margin-top: 20px;
      text-align: center;

      >p {
        margin: 0 25px;
      }

      img {
        height: 28px;
      }

      span {
        display: block;
        font-size: 12px;
        color: var(--ffont-color-4d4c4d);
        margin-top: 10px;
      }
    }

    &-rights {
      font-size: 14px;
      color: var(--border-color-525152);
      text-align: center;
      margin: 0;
    }
  }
}
</style>
