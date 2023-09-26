<template>
  <div class="appDownload-wrap">
    <h2 class="appDownload-wrap-title">{{ $t(`{0}手机APP`, [subConfig.title]) }}</h2>
    <div class="align-center-wrap layout-flex-center">
      <!-- <img
        class="device"
        :src="$getSrc('@img/appDownload/bg.jpg')"
        alt
      />-->
      <img class="device" src="@img/appDownload/device.png" alt />
      <div class="right">
        <!-- <img
          src="@img/appDownload/title.png"
          alt
          class="right-title"
        />-->
        <div class="load">
          <div class="intro">
            <div class="ios">
              <img width="39" height="45" src="@img/appDownload/ios.png" alt />
              <div>
                <h4>{{ $t('iOS版') }}</h4>
                <p>{{ $t('更新日期') }}：{{ dicts?.siteinfo?.ios_update_date }}</p>
                <p v-html="dicts?.siteinfo?.ios_update_text" />
              </div>
            </div>
            <div class="android">
              <img width="47" height="45" src="@img/appDownload/android.png" alt />
              <div>
                <h4>{{ $t('安卓版') }}</h4>
                <p>{{ $t('更新日期') }}：{{ dicts?.siteinfo?.android_update_date }}</p>
                <p v-html="dicts?.siteinfo?.android_update_text" />
              </div>
            </div>
          </div>
          <div class="errcode">
            <img id="er_code" :src="er_pic" alt />
            <h5>{{ $t('扫码下载APP') }}</h5>
            <p>{{ $t('请勿使用微信扫码') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, reactive, ref, watch,
} from 'vue';
import qrcode from 'qrcode';

const er_pic = ref('');
const ios_update_text = ref('');
const android_update_text = ref('');
const subConfig = inject('subConfig');
const $store = inject('store');
$store.dispatch('app/getDict', ['siteinfo']);
const { dicts } = $store.state.app;

watch(() => dicts.siteinfo, () => {
  ios_update_text.value = dicts?.siteinfo?.ios_update_text.split('\n').join('<br>');
  android_update_text.value = dicts?.siteinfo?.android_update_text.split('\n').join('<br>');
});

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};

onMounted(() => {
  const link = `https://m.${window.location.host}/appDownload`;
  qrcode.toDataURL(link, opts, (err, url) => {
    if (err) throw err;
    er_pic.value = url;
  });
});

</script>

<style lang="scss" scoped>
.appDownload-wrap {
  background: url("@img/appDownload/bg.jpg") center no-repeat;
  background-size: cover;
  height: 1178px;
  width: 100%;

  > .layout-flex-center {
    align-items: flex-start;
  }

  &-title {
    color: var(--font-color-fff);
    font-size: 62px;
    font-weight: bold;
    padding: 83px 0 48px;
    margin: 0;
  }

  .title {
    font-size: 72px;
    color: var(--font-color-fff);
    text-align: center;
    padding: 60px 0 0;
  }

  .device {
    width: 466px;
    margin-right: 128px;
  }

  .right {
    width: 622px;
    text-align: left;
    padding-top: 450px;

    &-title {
      width: 228px;
      margin-top: 120px;
    }

    > h3 {
      font-size: 60px;
      color: var(--theme-color);
      padding-top: 75px;
      height: 135px;
      margin: 0 0 55px;
      text-align: left;
      box-sizing: border-box;
    }

    > p {
      font-size: 40px;
      height: 60px;
      color: var(--font-color-ccc);
      text-align: left;
      margin: 0;
    }

    .load {
      display: flex;
      margin-top: 50px;

      .intro {
        .ios,
        .android {
          border-radius: 4px;
          padding: 26px 18px 23px;
          text-align: left;
          display: flex;

          > img {
            margin-right: 20px;
          }

          h4 {
            font-size: 22px;
            margin: 0 0 16px;
          }

          p {
            font-size: 16px;
            line-height: 22px;
            margin: 0;
          }

          width: 345px;
          background: var(--bg-color-282828);
          color: var(--font-color-fff);
        }

        .ios {
          background: linear-gradient(
            214deg,
            var(--bg-color-7A654C) 4%,
            var(--bg-color-69543B) 90%
          );
          margin-bottom: 20px;
        }

        .android {
          background: radial-gradient(
            var(--bg-color-3C3C3C),
            var(--bg-color-272727)
          );
        }
      }

      .errcode {
        width: 220px;
        height: 300px;
        background: var(--cur-bg-color-fff);
        margin-left: 30px;
        border-radius: 4px;
        color: var(--font-color-fff);
        padding: 20px 20px 0 20px;
        text-align: center;
        box-sizing: border-box;

        > img {
          width: 180px;
          height: 180px;
          margin-bottom: 20px;
        }

        h5 {
          font-size: 18px;
          line-height: 30px;
          color: #000;
          margin: 0;
        }

        p {
          font-size: 14px;
          color: var(--font-color-ccc);
          margin: 0;
        }
      }
    }
  }
}
</style>
