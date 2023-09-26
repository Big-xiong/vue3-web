<template>
  <div class="popularize-link-wrap">
    <MaterialDownload @toEdit="handleToEdit($event)" v-if="selectType === 'download'" />
    <OnlineEdit :url="backgroundUrl" @toDownload="handleToDownload" v-else />
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import MaterialDownload from './MaterialDownload.vue';
import OnlineEdit from './OnlineEdit.vue';

const global = inject('global');
const selectType = ref('download');
const backgroundUrl = ref('');

function handleToDownload() {
  selectType.value = 'download';
}

function handleToEdit(event) {
  selectType.value = 'edit';
  backgroundUrl.value = event;
}
</script>

<style lang="scss" scoped>
</style>
