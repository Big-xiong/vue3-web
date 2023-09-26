<template>
  <div id="sign-detail">
    <div class="bg1"></div>
    <div class="bg2"></div>
    <div class="bg3"></div>
    <div class="main">
      <img src="/src/views/index/activity/downAppInfo/img/img_money.png" alt="">
      <div class="block">
        <img src="/src/views/index/activity/downAppInfo/img/title_img2.png" alt="">
        <p>{{$t('活动期间，每日有效投注额达到2888即可签到，每次签到可获得一张刮刮卡，刮刮卡最高获奖10万元； 每月累积签到7天，14天，21天，28天，可分别获得额外福利金18元，28元，38元，88元，天天现金兑不停 ')}}</p>
        <img src="/src/views/index/activity/downAppInfo/img/img_huodong.png" alt="">
        <div class="button" @click="$router.push({path:'/appDownload'})">{{$t('前往移动端领取')}}</div>
        <img src="/src/views/index/activity/downAppInfo/img/img_liucheng.png" alt="">
      </div>
      <div class="block block02">
        <img src="/src/views/index/activity/downAppInfo/img/title_img.png" alt="">
        <h2>{{$t('活动规则')}}</h2>
        <p>{{$t('1. 活动时间：2020年5月1日起；')}}</p>
        <p>2. 此优惠只针对首次下载使用APP的VIP1以上会员，同IP、同设备ID、同账号、同银行卡、同电话号码等均视为同一人，
          仅限领取一次，需在APP活动页点击领取；</p>
        <p>3. 任何用户或团体以不正常的方式进行的投注或套取活动优惠，如无风险投注、多窗口投注、对赌行为或欺骗等方式，
          本公司保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，用户将会被列入黑名单；</p>
        <p>{{$t('4. 为避免文字理解差异，本公司将保留对该活动的最终解释权。')}}</p>
        <div class="downapp">
          <img src="/src/views/index/activity/downAppInfo/img/img_pic1.png" alt="">
          <div class="qrcode">
            <img
              id="er_code"
              :src="data.er_pic"
              alt=""
            >
            <p>
              <img src="/src/views/index/activity/downAppInfo/img/ios.png" alt="">
              <img src="/src/views/index/activity/downAppInfo/img/android.png" alt="">
              <span>{{$t('支持iOS&安卓全部移动设备')}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="game-item">
        <div v-for="(item, index) in data.gameList" @click="$router.push({path:item.path})" :key="index">
          <img :src="item.pic" alt="">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import qrcode from 'qrcode';

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};
const global = inject('global');

const data = reactive({
      gameList:[
        {
          name: global.$t('真人娱乐'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_zr_people1.png',
          path: '/real'
        },
        {
          name: global.$t('体育投注'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_ty_people1.png',
          path: '/sport'
        },
        {
          name: global.$t('电子游戏'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_dz_people1.png',
          path: '/slot'
        },
        {
          name: global.$t('彩票投注'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_cp_people1.png',
          path: '/lottery'
        },
        {
          name: global.$t('电子竞技'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_es_people1.png',
          path: '/esport'
        },
        {
          name: global.$t('棋牌游戏'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_qp_people1.png',
          path: '/chess'
        },
        {
          name: global.$t('捕鱼游戏'),
          pic: '/src/views/index/activity/downAppInfo/img/banner_py_people1.png',
          path: '/fishing'
        },
      ],
      er_pic:''
});

onMounted(() => {
  qrcode.toDataURL(`https://m.${window.location.host}/appDownload`, opts, (err, url) => {
    if (err) throw err;
    data.er_pic = url;
  });
});
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#sign-detail{
    // margin-top: 85px;
    position: relative;
    .bg1{
        height: 908px;
        background: url("./img/banner_img1.png") center top no-repeat;
    }
    .bg2{
        height: 908px;
        background: url("./img/img_bg3.png") center top no-repeat;
    }
    .bg3{
        height: 908px;
        background: url("./img/img_bg2.png") center top no-repeat;
    }
    .main{
        position: absolute;
        width: 100%;
        top: 425px;
        text-align: center;
        .block{
        width: 1202px;
        height: 709px;
        background: url("./img/img_bg1.png") center top no-repeat;
        margin: 0 auto;
        padding: 87px 67px 0;
        text-align: center;
        p{
            text-align: left;
            font-size: 16px;
            color: #ACA9D5;
            line-height: 22px;
            margin: 30px 0 46px;
        }
        .button{
            width: 300px;
            height: 50px;
            background: linear-gradient(90deg, #E68434 0%, #FF424B 100%);
            border-radius: 25px;
            text-align: center;
            line-height: 50px;
            margin: 53px auto 49px;
            font-size: 20px;
            color: #fff;
        }
        &.block02{
            margin: 60px auto 100px;
            p{
            margin: 0;
            line-height: 30px;
            width: 80%;
            }
            h2{
            font-size: 20px;
            font-family: SFNSDisplay;
            color: #FEDC80;
            line-height: 23px;
            text-align: left;
            margin: 20px 0 9px;
            }

        }
        }
        .game-item{
        display: flex;
        align-items: center;
        justify-content: center;
        > div{
            position: relative;
            margin: 0 10px;
            cursor: pointer;
            p{
            position: absolute;
            font-size: 16px;
            color: #ACA9D5;
            width: 100%;
            text-align: center;
            left: 0;
            bottom: 20px;
            }
        }
        }
        .downapp{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .qrcode{
            width: 334px;
            height: 334px;
            background: #434693;
            border-radius: 10px;
            margin-right: 49px;
            padding-top: 30px;
            #er_code{
            width: 240px;
            height: 240px;
            background: #FFFFFF;
            border-radius: 10px;
            }
            p{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #ACA9D5;
            width: 100%;
            margin-top: 20px;
            img{
                width: 22px;
            }
            }
        }
        }
    }
}
</style>
