<template>
  <div class="password-input">
    <el-input ref="pwd" v-model="data.msg" type="tel" maxlength="6" class="pwd" @blur="blur"></el-input>
    <div class="cells" @click="focus">
      <div v-for="(i, index) in length" :key="index" class="cell" :class="cursor(index)">
        <i v-if="data.msg.length > index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive, ref, watch,
} from 'vue';

const props = defineProps({
  length: { type: Number, default: 6 },
  value: { type: String, default: '' },

});

const data = reactive({
  msg: '',
  isFocus: false,
});

const emit = defineEmits(['input']);
watch(() => data.msg, (curVal) => {
  if (/[^\d]/g.test(curVal)) {
    data.msg = data.msg.replace(/[^\d]/g, '');
  }
  emit('input', data.msg);
});

function cursor(index) {
  return (data.msg.length === index || (data.msg.length === props.length && data.msg.length === index + 1)) && data.isFocus ? 'blink' : '';
}

function blur() {
  data.isFocus = false;
}

const pwd = ref('');
function focus() {
  data.isFocus = true;
  pwd.value.focus();
}

defineExpose({
  focus,
});

</script>

<style lang="scss" scoped>
.password-input {
  width: auto;
  position: relative;
  display: flex;
  justify-content: center;

  .el-input {
    color: transparent;
    position: absolute;
    top: 0;
    background: var(--bg-color-000);
    left: 0;
    border: none;
    font-size: 18px;
    opacity: 0;
    z-index: -1;
  }

  .cells {
    padding-bottom: 1px;
    z-index: 10;
    display: flex;

    .cell {
      list-style-type: none;
      text-align: center;
      width: 46px;
      height: 46px;
      background-color: var(--curent-cell-bg-color, var(--bg-color-efefef));
      border-radius: 6px;
      line-height: 46px;
      margin-right: 25px;

      &:last-child {
        margin-right: 0;
      }

      i {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: var(--theme-color);
        display: inline-block;
      }

      &.blink {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 2px;
          height: 50%;
          background-color: var(--theme-color);
          border-radius: 2px;
          transform: translateY(-50%);
          animation: fade 1s infinite;
        }

        @keyframes fade {
          from {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
