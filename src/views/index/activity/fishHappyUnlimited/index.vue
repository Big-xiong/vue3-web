<template>
  <div id="roulette-detail">
    <div class="enter-desc">
      <p>{{$t('累计投注额')}}<img src="/src/views/index/activity/fishHappyUnlimited/img/img_9999.png" alt="">{{$t('即可领取彩金，')}}</p>
      <p>{{$t('每日投注，每日最高可领')}}<img src="/src/views/index/activity/fishHappyUnlimited/img/img_1888.png" alt=""></p>
    </div>
    <img class="enter-button" v-login @click="toGame" src="/src/views/index/activity/fishHappyUnlimited/img/title_img.png" alt="">
    <div class="enter-info">
      <table>
        <tr>
          <th></th>
          <th>{{$t('当日累积有效投注')}}</th>
          <th>{{$t('优惠金额')}}</th>
        </tr>
        <tr v-for="(item,index) in data.list" :key="index">
          <td>
            <img v-if="index===0" src="/src/views/index/activity/fishHappyUnlimited/img/icon_img5.png" alt="">
            <img v-if="index===1" src="/src/views/index/activity/fishHappyUnlimited/img/icon_img4.png" alt="">
            <img v-if="index===2" src="/src/views/index/activity/fishHappyUnlimited/img/icon_img3.png" alt="">
            <img v-if="index===3" src="/src/views/index/activity/fishHappyUnlimited/img/icon_img2.png" alt="">
            <img v-if="index===4" src="/src/views/index/activity/fishHappyUnlimited/img/icon_img1.png" alt="">
          </td>
          <td>{{item.bet}}</td>
          <td>{{item.money}}</td>
        </tr>
      </table>
    </div>
    <p class="tit">{{$t('活动规则')}}</p>
    <div class="enter-tips">
      <p>{{$t('此活动仅限AG捕鱼王，其他捕鱼游戏不参与此活动。')}}</p>
      <p>{{$t('每日仅可领取最高等级奖金，如您当日有效投注额为6万，则您可以获得88元礼金。')}}</p>
      <p>{{$t('礼金仅需5倍流水即可提款。')}}</p>
      <p>{{$t('此活动和网站其他优惠可共享，投注还可以同时享受高额洗码返水。')}}</p>
      <p>{{$t('同一IP、同一台设备、同一联系方式、同一银行卡只能有一个账户参与活动。如有历史已注册的用户参与该活动，违规套利者将取消获奖资格，严重舞弊者本公司有权在不事先通知的情况下作封号处理或扣除相关获利。')}}</p>
      <p>{{$t('会员参与本次活动，即视为同意本活动条款。')}}</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { fishHappyUnlimited, fishHappyPlay } from '@/api/activity';

const global = inject('global');
const $route = useRoute()

const data = reactive({
    list: [],
    agData: {
        default_game_id: 12,
        game_platform_id: 1,
        game_platform_name: global.$t(`AG捕鱼王3D`),
        game_platform_mark: global.$t(`顶级渔场一炮致富`),
        name: 'AG',
        title: global.$t(`AG捕鱼王3D`),
        desc: [global.$t(`顶级渔场，一炮致富`)]
      }
})

const getData = () => {
    fishHappyUnlimited({
        gid: data.agData.default_game_id,
        id: $route.query.id,
    }).then( res => {
        console.log(res);
        data.list = res;
    })
};
const toGame = () => {
    fishHappyPlay({
        gid: data.agData.default_game_id,
        id: $route.query.id,
    }).then( res => {
        console.log(res);
    })
    global.$playGame(this.agData)
};

onMounted(() => {
    getData()
})
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#roulette-detail{
    // margin-top: 85px;
    background-image: url('./img/img_bg.png');
    background-repeat: no-repeat;
    background-position: center top;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 725px;
    padding-bottom: 112px;
    .enter-desc{
        display: flex;
        font-size: 24px;
        color: #fff;
        justify-content: space-around;
        margin-bottom: 57px;
        p{
        padding: 0 60px;
        }
    }
    .enter-button{
        transition: .3s;
        cursor: pointer;
        &:hover{
        transform: scale(1.1);
        }
    }
    .enter-info{
        width: 1296px;
        height: 733px;
        background: url('./img/img_zhuangshi.png');
        padding: 120px 220px 0 250px;
        table{
        table-layout: fixed;
        width: 100%;
        th{
            font-size: 30px;
            color: #FFE823;
            height: 120px;
        }
        td{
            font-size: 30px;
            color: #fff;
            height: 88px;
        }
        }
    }
    .tit{
        font-size: 40px;
        color: #FFE823;
        margin: 135px 0 50px;
    }
    .enter-tips{
        width: 1030px;
        p{
        font-size: 20px;
        color: #fff;
        line-height: 42px;
        padding-left: 22px;
        position: relative;
        text-align: left;
        &:after{
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            background: #FFE823;
            left: 0;
            top: 15px;
        }
        }
    }
}
</style>
