import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRequest } from 'ahooks-vue';
import { indexbanner } from '@/api/home';
import activityMaps from '@/utils/activityMaps';

export default () => {
  const $router = useRouter();

  const bannerActive = ref(0);
  const bannerRef = ref(null);

  const { data: bannerList, loading: bannerLoading } = useRequest(indexbanner);

  const bannerItemClick = (item) => {
    const { link_config } = item;
    const { pc } = link_config ? JSON.parse(link_config) : {};
    if (pc?.type) {
      const { link } = pc;
      switch (pc.type.pop()) {
        case '1-1-1':
          if (link) {
            $router.push(`/promosDetail?id=${link}`);
          } else {
            $router.push('/promos');
          }
          break;
        case '1-1-2':
          $router.push({ name: activityMaps[pc.special_type], query: { id: pc.link } });
          break;
        case '1-2':
          $router.push({ name: 'centerDeposit' });
          break;
        case '1-3':
          $openKefu();
          break;
        default:
          link && window.open(link);
      }
    }
  };

  return {
    bannerRef,
    bannerList,
    bannerLoading,
    bannerActive,
    setBannerActive: (index) => {
      bannerActive.value = index;
      bannerRef.value?.setActiveItem?.(index);
    },
    bannerItemClick,
  };
};
