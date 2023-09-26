<template>
  <div></div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { runPop } from '@/utils/sitenotice';

import IndexPop from '@/components/Dialog/IndexPop.vue';
import SiteNotice from '@/components/Dialog/SiteNotice.vue';

import { indexpop } from '@/api/news';
import { sitenotice } from '@/api/center';
import { useDicts } from '../utils/hooks';

// const $router = useRouter();
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const route = useRoute();

// const popData = reactive({
//   name: '',
//   h5_pop_pic: '',
//   url: '',
// });

// let timer = null;

// let isOpen = false;
// function showNotice(notice) {
//   isOpen = true;
//   global.$dialog({
//     tpl: 'SiteNotice',
//     notice,
//     callback() {
//       isOpen = false;
//     },
//   });
// }

// function showPop() {
//   global.$dialog({
//     tpl: 'IndexPop',
//     popData,
//   });
// }

// function loadIndexPop() {
//   indexpop().then((data) => {
//     if (data) {
//       popData.name = data.name;
//       popData.h5_pop_pic = data.h5_pop_pic;
//       popData.url = data.url;
//     }
//     if (
//       !window.sessionStorage.getItem('pop_status')
//       && popData.pc_pop_pic
//     ) {
//       showPop();
//     }

//     // else if (
//     //   Boolean(window.sessionStorage.getItem('pop_status'))
//     //     && popData.pc_pop_pic
//     // ) {
//     //   show.value = false;
//     // }
//   });
// }

// function listen() {
//   timer = setInterval(() => {
//     if (isOpen) {
//       return;
//     }
//     sitenotice().then((data) => {
//       runPop(data?.data, (noticeData) => {
//         if (noticeData.length) {
//           showNotice(noticeData);
//         }
//       });
//     });
//   }, 15000);
// }

let isImageOpen = false;
const noticeArray = ref([]);
const imageArray = ref([]);

function showImageNotice(notice) {
  isImageOpen = true;
  global.$dialog({
    tpl: 'SiteImageNotice',
    notice,
    callback() {
      isImageOpen = false;
    },
  });
}

const { run } = useRequest(sitenotice, {
  manual: true,
  pollingInterval: 15000,
  onSuccess(res) {
    if (res.data.length > 0) {
      noticeArray.value = res.data.filter((item) => item.title.toLowerCase() !== 'image-type');
      imageArray.value = res.data
        .filter((item) => item.title.toLowerCase() === 'image-type')
        .sort((a, b) => {
          const aTime = a.publish_time || a.updated_at || a.created_at;
          const bTime = b.publish_time || b.updated_at || b.created_at;
          return new Date(aTime).getTime() - new Date(bTime).getTime();
        });
      noticeArray.value.sort((a, b) => dayjs(b.publish_time) - dayjs(a.publish_time));
      // 存入store 供公告界面使用
      $store.dispatch('app/updateSiteNotice', noticeArray.value);
    }
    if (noticeArray.value.length > 0) {
      runPop(noticeArray.value, (noticeData) => {
        if (noticeData.length && route.name === 'index') {
          global.$dialog({
            tpl: 'SiteNotice',
            notice: noticeData,
            callback() {
              if (imageArray.value.length && route.name === 'index') {
                runPop(imageArray.value, (imageData) => {
                  if (imageData.length) {
                    showImageNotice(imageData[0]);
                  }
                });
              }
            },
          });
        }
      });
    } else if (imageArray.value.length > 0) {
      if (route.name === 'home' && !isImageOpen) {
        runPop(imageArray.value, (imageData) => {
          if (imageData.length) {
            showImageNotice(imageData[0]);
          }
        });
      }
    }
    // if (imageArray.value.length > 0) {
    //   if (route.name === 'index' && !isImageOpen) {
    //     runPop(imageArray, (imageData) => {
    //       if (imageData.length) {
    //         imageNotice.value = imageData[imageData.length - 1];
    //         showImageNotice();
    //       }
    //     });
    //   }
    // } else {
    //   runPop(res?.data, (notice) => {
    //     if (notice.length) {
    //       global.$dialog({
    //         tpl: 'SiteNotice',
    //         notice,
    //       });
    //     }
    //   });
    // }
  },
});

const noticeShow = ref(0);

useDicts('siteinfo', (info) => {
  noticeShow.value = Number(info.notice_show || 1);
}, { immediate: true });

watch(() => noticeShow.value, () => {
  if (!user.gottenUserInfo) {
    return;
  }

  if (noticeShow.value === 1 && !user.isLogin) {
    run();
  } else if (noticeShow.value === 2 && user.isLogin) {
    run({ uid: $store?.state?.user?.userInfo?.id ?? '' });
  }
});

watch(() => user.isLogin, () => {
  if (noticeShow.value === 2 && user.isLogin) {
    run({ uid: $store?.state?.user?.userInfo?.id ?? '' });
  }
});

// onMounted(() => {
//   if ($store.state.user.isLogin) {
//     run({ uid: $store?.state?.user?.userInfo?.id ?? '' });
//   } else {
//     run();
//   }
//
//   //   // watch($router.currentRoute, (val) => {
//   //   //   if (val.path === '/' || val.path === '/esport'){
//   //   //     loadIndexPop();
//   //   //   }
//   //   // });
//   //   // 测试
//   //   // sitenotice().then((data) => {
//   //   //   handleNoticeData(data);
//   //   //   // showPop();
//   //   // });
//   //   listen();
// });
//
// onUnmounted(() => {
//   clearInterval(timer);
// });
</script>
