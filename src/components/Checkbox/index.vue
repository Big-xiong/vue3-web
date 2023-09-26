<template>
  <div class="check-box-wrap">
    <input type="checkbox" :id="inputId" @change="$emit('update:checked', !checked)" />
    <label :for="inputId" :class="`check-box-label ${checked ? 'checked' : ''}`" />
    <label :for="inputId">{{ label }}</label>
  </div>
</template>

<script setup>

defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
});

const inputId = new Date().getTime();

</script>

<style lang="scss" scoped>
@keyframes dothatopcheck {
  0% {
    height: 0;
  }

  50% {
    height: 0;
  }

  100% {
    height: 14px;
  }
}

.check-box-wrap {
  display: flex;
  align-items: center;
  height: 20px;

  input[type="checkbox"] {
    display: none;
  }

  >label:last-child {
    padding-left: 10px;
    cursor: pointer;
    color: var(--font-color-999);
    line-height: 1.2;
  }
}

.check-box-label {
  height: 20px;
  width: 20px;
  background-color: transparent;
  border: 2px solid var(--theme-color);
  border-radius: 50%;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  transition: border-color ease 0.2s;
  cursor: pointer;

  &.checked {
    background: var(--theme-color);

    &::before,
    &::after {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      height: 0;
      width: 2px;
      background-color: var(--font-color-333);
      display: inline-block;
      transform-origin: left top;
      border-radius: 5px;
      content: " ";
      -webkit-transition: opacity ease 0.5;
      -moz-transition: opacity ease 0.5;
      transition: opacity ease 0.5;
    }
  }
}

.check-box-label::before {
  top: 15px;
  left: 7px;
  transform: rotate(-135deg);
}

.check-box-label::after {
  top: 9px;
  left: 0;
  transform: rotate(-45deg);
}

input[type="checkbox"]:checked+.check-box-label,
.check-box-label.checked {
  border-color: var(--theme-color);
}

input[type="checkbox"]:checked+.check-box-label::after,
.check-box-label.checked::after {
  height: 8px;
  animation: dothabottomcheck 0.2s ease 0s forwards;
}

input[type="checkbox"]:checked+.check-box-label::before,
.check-box-label.checked::before {
  height: 14px;
  animation: dothatopcheck 0.3s ease 0s forwards;
}
</style>
