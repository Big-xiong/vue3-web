<template>
  <div
    class="together"
    :theme-dark="$route.path === '/vip'"
  >
    <div class="align-center-wrap layout-flex-center">
      <div class="cooperation">
        <p class="title">{{ $t(`合作伙伴`) }}</p>
        <div class="layout-flex-center">
          <div>
            <img
              src="/src/assets/images/home/cooperation01.png"
              alt
            />
            <p>{{ $t(`官方球衣赞助商`) }}</p>
            <p>Slavia Prague</p>
          </div>
          <div>
            <img
              src="/src/assets/images/home/cooperation02.png"
              alt
            />
            <p>{{ $t(`官方球衣赞助商`) }}</p>
            <p>Slavia Prague</p>
          </div>
        </div>
      </div>
      <div class="brand">
        <p class="title">{{ $t(`品牌大使`) }}</p>
        <div class="layout-flex-center">
          <img
            src="/src/assets/images/home/brand.png"
            alt
          />
          <p>
            {{ $t(`维尔科斯基`) }}
            <br />
            {{ $t(`北马其顿-前锋`) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const global = inject('global');
</script>

<style lang="scss">
.together {
  background: var(--bg-color-fff);
  padding: 65px 0 132px;
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
      flex: 1.3;

      .layout-flex-center {
        div {
          margin: 0 10%;

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
      white-space: nowrap;
      flex: 1;

      img {
        width: 343px;
        margin-right: 19px;
      }
    }
  }
}
</style>
