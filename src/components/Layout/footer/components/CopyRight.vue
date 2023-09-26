<template>
  <div class="app-footer-copyright">
    <div class="align-center-wrap">
      <p class="app-footer-copyright-title">{{$t(`{0}拥有欧洲马耳他博彩管理局（MGA）、英国GC监督委员会（GamblingCommission）和菲律宾政府博彩委员会（PAGCOR）颁发的合法执照`,[subConfig.title])}}<br />{{$t('照。注册于英属维尔京群岛，是受国际博彩协会认可的合法博彩公司')}}</p>
      <div class="app-footer-copyright-list layout-flex-center">
        <p>
          <img
            src="/src/assets/images/footer/logo/commission.png"
            alt=""
          />
          <span>{{$t('英国GC监督委员会')}}</span>
        </p>
        <p>
          <img
            src="/src/assets/images/footer/logo/mga.png"
            alt=""
          />
          <span>{{$t('马耳他博彩牌照(MGA)认证')}}</span>
        </p>
        <p>
          <img
            src="/src/assets/images/footer/logo/financial.png"
            alt=""
          />
          <span>{{$t('英属维尔京群岛(BVI)认证')}}</span>
        </p>
        <p>
          <img
            src="/src/assets/images/footer/logo/pagcor.png"
            alt=""
          />
          <span>{{$t('菲律宾监督博彩牌照')}}</span>
        </p>
      </div>
      <p class="app-footer-copyright-link layout-flex-center">
        <router-link
          v-for="(item, $index) in routes"
          :key="$index"
          :to="{ name: item.name }"
        >
          {{ item.title }}
        </router-link>
      </p>
      <p class="app-footer-copyright-rights">{{$t(`Copyright©{0}娱乐.Allrightsreserved.`,[subConfig.title])}}</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const subConfig = inject('subConfig');
const global = inject('global');
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
.app-footer-copyright {
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

    > p {
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

  &-link {
    text-align: center;
    font-size: 16px;
    margin: 40px 0 20px;
    line-height: 1;

    > a {
      color: var(--font-color-ccc);
      text-decoration: none;
      padding: 0 15px;
      line-height: 1;
      font-size: 16px;
      transition: all 0.45s ease-out;

      &:not(:last-child) {
        border-right: 1px solid var(--font-color-ccc);
      }

      &:hover {
        color: var(--theme-color);
      }
    }
  }

  &-rights {
    font-size: 14px;
    color: var(--border-color);
    text-align: center;
    margin: 0;
  }
}
</style>
