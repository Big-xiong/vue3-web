<template>
    <div id="usdt-detail">
        <div class="section-one"></div>
        <div class="section2" v-if="data.note.length">
            <h2 class="title">
                <span>{{ $t('星级晋升机制') }}</span>
            </h2>
            <div class="section2-main" v-if="data.note.length">
                <div>
                    <img src="/src/views/index/activity/pastAppointments/img/img_waikuang.png" alt="" />
                    <h2>{{ $t('四品官员') }}</h2>
                    <p>{{ $t('有效投注额') }}{{ data.note[0].money.valid_bet }}W+ 月存款{{ data.note[0].money.deposite_money
                    }}W+</p>
                </div>
                <img src="/src/views/index/activity/pastAppointments/img/img_arrow.png" alt="" />
                <div>
                    <img src="/src/views/index/activity/pastAppointments/img/img_waikuang.png" alt="" />
                    <h2>{{ $t('三品官员') }}</h2>
                    <p>{{ $t('有效投注额') }}{{ data.note[1].money.valid_bet }}W+ 月存款{{ data.note[1].money.deposite_money
                    }}W+</p>
                </div>
                <img src="/src/views/index/activity/pastAppointments/img/img_arrow.png" alt="" />
                <div>
                    <img src="/src/views/index/activity/pastAppointments/img/img_waikuang.png" alt="" />
                    <h2>{{ $t('二品官员') }}</h2>
                    <p>{{ $t('有效投注额') }}{{ data.note[2].money.valid_bet }}W+ 月存款{{ data.note[2].money.deposite_money
                    }}W+</p>
                </div>
                <img src="/src/views/index/activity/pastAppointments/img/img_arrow.png" alt="" />
                <div>
                    <img src="/src/views/index/activity/pastAppointments/img/img_waikuang.png" alt="" />
                    <h2>{{ $t('一品官员') }}</h2>
                    <p>{{ $t('有效投注额') }}{{ data.note[3].money.valid_bet }}W+ 月存款{{ data.note[3].money.deposite_money
                    }}W+</p>
                </div>
                <img src="/src/views/index/activity/pastAppointments/img/img_arrow.png" alt="" />
                <div>
                    <img src="/src/views/index/activity/pastAppointments/img/img_waikuang.png" alt="" />
                    <h2>{{ $t(`乾隆大帝`) }}</h2>
                    <p>{{ $t('有效投注额') }}{{ data.note[4].money.valid_bet }}W+ 月存款{{ data.note[4].money.deposite_money
                    }}W+</p>
                </div>
            </div>
        </div>
        <div class="section3">
            <div class="main">
                <h2 class="title">
                    <span>{{ $t('星级特权福利') }}</span>
                </h2>
                <table>
                    <thead>
                        <tr>
                            <th>{{ $t('品职') }}</th>
                            <th>{{ $t('酒店') }}</th>
                            <th>{{ $t('美女') }}</th>
                            <th>{{ $t('年龄') }}</th>
                            <th>{{ $t('服务周期') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data.list" :key="index">
                            <td>{{ item.starClass }}</td>
                            <td>{{ item.hotel }}</td>
                            <td>{{ item.beauty }}</td>
                            <td>{{ item.age }}</td>
                            <td>{{ item.cycle }}</td>
                        </tr>
                    </tbody>
                </table>
                <p>{{ $t('温馨提示：① 会员提前联系客服专员，选取美女服务，只针对有机场直达的城市，AA集团承担交通服务费用；') }}</p>
                <p style="padding-left: 79px">② 相关隐私请参考当地法律，AA集团不干涉，为避免文字差异，{{ $t('AA集团保留最终解释权') }}</p>
            </div>
        </div>
        <div class="section4">
            <div class="main">
                <h2 class="title">
                    <span>{{ $t('活动规则') }}</span>
                </h2>
                <div class="bot-tips">
                    <p>
                        <svg-icon link="love-active" class="active" /><span>{{ $t('本活动所有二星及以上会员均可享受；') }}</span>
                    </p>
                    <p>
                        <svg-icon link="love-active" class="active" /><span>{{ $t('会员需要提前联系客服/专员，选取美女服务；') }}</span>
                    </p>
                    <p>
                        <svg-icon link="love-active" class="active" /><span>{{ $t('只针对有机场直达的城市，AA集团承担交') }}</span>
                    </p>
                    <p>
                        <svg-icon link="love-active" class="active" />
                        <span>{{ $t('本存款金额只限线下存款(银行卡转账)，微信，支付宝，在线支付等不计算在内；') }}</span>
                    </p>
                    <p>
                        <svg-icon link="love-active" class="active" /><span>{{ $t('本活动数据按月累计，转月之后自动清零；') }}</span>
                    </p>
                    <p>
                        <svg-icon link="love-active" class="active" />
                        <span>{{
                                $t('本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户、包括同一姓名、同一姓名、统一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，已经发现我们将保留冻结账户以及没收所有余额的权利；')
                        }}</span>
                    </p>
                    <p>
                        <svg-icon link="love-active" class="active" /><span>{{ $t('关于本活动本公司拥有最终解释权。') }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { specialdetail } from '@/api/activity';

const global = inject('global');

const data = reactive({
    note: [],
    list: [
        {
            starClass: global.$t('四品官员'),
            hotel: global.$t('三星酒店'),
            beauty: global.$t('模特'),
            age: global.$t('18-25周岁'),
            cycle: global.$t('1次/6个月'),
        },
        {
            starClass: global.$t('三品官员'),
            hotel: global.$t('四星酒店'),
            beauty: global.$t('模特'),
            age: global.$t('18-25周岁'),
            cycle: global.$t('1次/3个月'),
        },
        {
            starClass: global.$t('二品官员'),
            hotel: global.$t('五星酒店'),
            beauty: global.$t('模特,空姐,学生'),
            age: global.$t('18-25周岁'),
            cycle: global.$t('1次/1个月'),
        },
        {
            starClass: global.$t('一品官员'),
            hotel: global.$t('五星豪华酒店'),
            beauty: global.$t('二线明星'),
            age: global.$t('18-25周岁'),
            cycle: global.$t('1次/1个月'),
        },
        {
            starClass: global.$t('乾隆大帝'),
            hotel: global.$t('顶级豪华酒店'),
            beauty: global.$t('二线明星'),
            age: global.$t('18-25周岁'),
            cycle: global.$t('2次/1个月'),
        },
    ],
});
const $route = useRoute();

// 获取优惠详情
const getDetail = () => {
    specialdetail({
        id: $route.query.id,
    }).then((res) => {
        data.note = res.condition_setting;
    });
};

onMounted(() => {
    getDetail();
});
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#usdt-detail {
    // margin-top: 85px;

    .section-one {
        height: 669px;
        background-image: url('./img/banner_img.png');
        background-repeat: no-repeat;
        background-position: center top;
    }

    .title {
        font-size: 30px;
        color: #fff;
        margin-bottom: 60px;

        span {
            position: relative;

            &:before,
            &:after {
                content: '';
                position: absolute;
                width: 154px;
                height: 1px;
                background-color: #333;
                top: 50%;
            }

            &:before {
                right: calc(100% + 20px);
            }

            &:after {
                left: calc(100% + 20px);
            }
        }
    }

    .section2 {
        height: 341px;
        background-image: url('./img/banner_bg1.png');
        background-repeat: no-repeat;
        background-position: center top;
        padding-top: 20px;

        .section2-main {
            display: flex;
            align-items: center;
            justify-content: center;

            div {
                position: relative;

                h2 {
                    position: absolute;
                    top: 34px;
                    left: 23px;
                    font-size: 36px;
                    color: #fff;
                }

                p {
                    position: absolute;
                    font-size: 14px;
                    color: #fff;
                    top: 106px;
                    line-height: 24px;
                    width: 125px;
                    left: 27px;
                }
            }
        }
    }

    .section3 {
        background-color: #000;
        padding: 80px 0 75px;

        .main {
            width: 1200px;
            margin: 0 auto;

            p {
                font-size: 16px;
                color: #999;
                line-height: 26px;
                text-align: left;
            }
        }

        table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            background: #231537;
            margin-bottom: 40px;

            thead {
                tr {
                    height: 70px;
                    background: linear-gradient(120deg, #4634e0 0%, #6a05ca 100%);

                    th {
                        color: #fff;
                        font-size: 24px;
                    }
                }
            }

            tbody {
                border: 2px solid #4634e0;
                border-top: 0;
                box-sizing: border-box;

                tr:nth-child(even) {
                    background: rgba(0, 0, 0, 0.6);
                }

                tr:nth-child(odd) {
                    background: #231537;
                }

                td {
                    height: 65px;
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
    }

    .section4 {
        height: 669px;
        background-image: url('./img/bg.png');
        background-repeat: no-repeat;
        background-position: center top;
        padding-top: 55px;

        .main {
            width: 1200px;
            margin: 0 auto;

            .bot-tips {
                width: 1200px;
                margin: 70px auto 0;
                counter-reset: count;

                p {
                    display: flex;
                    align-items: flex-start;
                    font-size: 18px;
                    color: #fff;
                    line-height: 28px;
                    justify-content: flex-start;
                    text-align: left;
                    margin-bottom: 27px;
                    position: relative;

                    .svg-icon {
                        fill: #5514bf;
                        width: 28px;
                        height: 28px;
                        margin-top: 2px;
                    }

                    &:before {
                        content: counters(count, '') ' ';
                        counter-increment: count;
                        position: absolute;
                        left: 8px;
                        font-size: 20px;
                        top: 0;
                    }

                    span {
                        flex: 1;
                        margin-left: 9px;
                    }
                }
            }
        }
    }
}
</style>
