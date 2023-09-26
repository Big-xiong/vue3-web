<template>
  <div
    class="restricted-wrapper"
    :style="{ 'background-image': `url(${$getSrc('/src/assets/images/restricted/bg.jpg')})` }"
  >
    <div class="content">
      <h1>{{ $t('访问受限') }}</h1>
      <ul>
        <li class="en">
          <div class="left en"></div>
          <div class="right">
            <h2>Dear members</h2>
            <div class="text">
              The page that you are trying to access has been restricted in this location. We apologize for any inconvenience that
              this may have caused. Should you have any inquiries, please contact our customer service centre at
              <span>customerservice@blizzwin.com</span> or Live Help
            </div>
          </div>
        </li>
        <li class="zh">
          <div class="left zh"></div>
          <div class="right">
            <h2>登录限制</h2>
            <div class="text">
              抱歉！您所在地区受到限制，无法正常游览我们的网站哦。若有不便之处，请多多原谅。若您有任何疑问，请联系我们的在线客服。
              或发邮件至<span>customerservice@blizzwin.com</span>
            </div>
          </div>
        </li>
        <li class="th">
          <div class="left th"></div>
          <div class="right">
            <h2>การเข้าสู่ระบบถูกจำกัด</h2>
            <div class="text">
              หน้าที่คุณเชื่อมต่อได้ถูกจำกัด ขออภัยในความไม่สะดวก หากคุณมีข้อสงสัยกรุณาติดต่อพนักงานฝ่ายบริการลูกค้าที่ เบอร์โทร
              +66 600 035 187 อีเมล: <span>customerservice@blizzwin.com</span> หรือ ห้องช่วยเหลือสด
            </div>
          </div>
        </li>
        <li class="vi">
          <div class="left vi"></div>
          <div class="right">
            <h2>Đường dẫn hạn chế</h2>
            <div class="text">
              Đường dẫn mà quý khách đang truy nhập trên trang này bị hạn chế. Chúng tôi thành thật xin lỗi cho những bất tiện gây
              ra. Nếu quý khách có thắc mắc về vấn đề này, vui lòng liên hệ Bộ phận Chăm sóc Khách hàng tại Hotline (+84) 9077 605
              94 <span>customerservice@blizzwin.com</span> hoặc hoặc Hồ Trợ Trực Tuyến
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

function initialDomStyle() {
  document.querySelector('html').setAttribute('style', 'height: 100%;');
  document.querySelector('body').setAttribute('style', 'height: inherit;');
  document.querySelector('body>#app').setAttribute('style', 'height: inherit;');
  document.querySelector('#app>.app-wrap').setAttribute('style', 'padding-top:0;height: inherit');
}

onMounted(() => {
  initialDomStyle();
});
</script>

<style lang="scss" scoped>
.restricted-wrapper {
  position: relative;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: auto 100vh;
  padding: 73px 0;
  text-align: left;
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
  }
  .content {
    position: absolute;
    left: 50%;
    width: 45%;
    height: calc(100% - 73px - 73px);
    h1 {
      height: 64px;
      line-height: 64px;
      padding-left: 64px;
      color: var(--theme-color);
      background: url('/src/assets/images/restricted/stop.png') left center no-repeat;
      background-size: contain;
      margin: 0;
      font-weight: normal;
    }
    ul {
      margin-top: 58px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      height: calc(100% - 58px - 64px);
      li {
        .left {
          width: 64px;
          height: 64px;
          float: left;
          &.en {
            background: url('/src/assets/images/restricted/en.jpg') top center no-repeat;
            background-size: 43px 29px;
          }
          &.zh {
            background: url('/src/assets/images/restricted/zh.jpg') top center no-repeat;
            background-size: 44px 30px;
          }
          &.th {
            background: url('/src/assets/images/restricted/th.jpg') top center no-repeat;
            background-size: 42px 29px;
          }
          &.vi {
            background: url('/src/assets/images/restricted/vi.jpg') top center no-repeat;
            background-size: 44px 30px;
          }
        }
        .right {
          float: left;
          width: calc(100% - 64px);
          h2 {
            margin: 0;
            height: 18px;
            line-height: 18px;
            color: var(--font-color-2e2e2e);
            font-size: 18px;
            font-weight: normal;
          }
          .text {
            line-height: 25px;
            font-size: 14px;
            color: var(--dark-color-fff, #817f7f);
            margin-top: 5px;
            span {
              color: var(--theme-color);
            }
          }
        }
      }
    }
  }
}
</style>
