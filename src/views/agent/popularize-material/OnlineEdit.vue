<template>
  <div class="online-edit-wrap">
    <EditorPanel :url="url" @back="toDownload" :qrcode="qrcode" :options="options" />
    <EditOptions @qrcodeChange="handleQrcodeChange($event)" @optionsChange="handleOptionsChange($event)" />
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import EditOptions from './components/EditOptions.vue';
import EditorPanel from './components/EditorPanel.vue';

const global = inject('global');
defineProps({
  url: String,
});

const qrcode = ref({});
const options = ref([]);

const emit = defineEmits(['toDownload']);
function toDownload() {
  emit('toDownload');
}

function handleQrcodeChange(event) {
  qrcode.value = { ...event };
}

function handleOptionsChange(event) {
  options.value = { ...event };
}

</script>

<style lang="scss" scoped>
.online-edit-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
