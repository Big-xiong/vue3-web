<template>
  <div class="security-wrap">
    <h3>{{$t(`安全保障`)}}</h3>
    <div class="main-body">
      <div class="top">
        <div class="top-text">
          <h3>{{$t(`${subConfig?.title ?? ''}持有菲律宾（PAGCOR）合法博彩执照。`)}}</h3>
          <p>{{$t(`该执照由菲律宾娱乐及博彩公司（PAGCOR）所核发和监管，以便提供网上投注服务。菲律宾娱乐及博彩公司（PAGCOR）是菲律宾共和国总统办公室100%由政府拥有和控制的公司，菲律宾娱乐及博彩公司（PAGCOR）是一家拥有合法经营权的公司。`)}}</p>
        </div>
        <img
          src="/src/assets/images/help/pz@2x.png"
          alt=""
        />
      </div>

      <div class="gov-wrapper">
        <div class="gov-inner">
          <div class="gov">
            <img
              :src="$getSrc('/src/assets/images/help/K19FLITFPBZL0.png')"
              style="width: 196px;"
              alt
            />
          </div>
          <div class="gov">
            <img
              :src="$getSrc('/src/assets/images/help/K19FM0HKL5IV2.png')"
              style="width: 173px;"
              alt
            />
          </div>
          <div class="gov">
            <img
              :src="$getSrc('/src/assets/images/help/K19FLUWMZANQT.png')"
              style="width: 125px;"
              alt
            />
          </div>
          <div class="gov">
            <img
              :src="$getSrc('/src/assets/images/help/K19FL8TQSD0VI.png')"
              style="width: 160px;"
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
const subConfig = inject('subConfig');

</script>

<style lang="scss" scoped>
.security-wrap {
  padding: 0 30px 30px;
  width: 995px;
  box-sizing: border-box;
  box-shadow: 0px 3px 15px 0px rgba(0, 34, 80, 0.1);
  background-color: var(--dark-bg-color-191919, var(--bg-color-fff));
  text-align: left;
  line-height: 30px;
  min-height: 200px;

  > h3 {
    font-size: 24px;
    margin: 0 0 20px;
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    color: var(--font-color-333);
    border-bottom: 1px solid var(--dark-theme-border-fff-1, var(--border-color-e2e2e2));
  }

  .gov-wrapper {
    width: 100%;
    height: 96px;
    position: relative;
    margin-bottom: 40px;
    padding: 30px 0;

    .gov-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--current-border-color-2B4C6F, var(--border-color-ccc));
      height: 118px;
      border-radius: 6px;
    }
  }

  .top {
    display: flex;
    margin-bottom: 60px;

    img {
      width: 257px;
    }

    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: normal;
    }

    h3,
    p {
      width: 542px;
      font-size: 18px;
      color: var(--font-color-333);
    }

    > div {
      margin-right: 60px;
    }
  }

  .gov {
    text-align: center;
    position: relative;
    flex: 1;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      width: 1px;
      box-sizing: border-box;
      height: 75px;
      border-right: 1px solid var(--border-color-e6ecf1);
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    div {
      margin-top: 10px;
      color: var(--font-color-999);
      font-size: 16px;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
