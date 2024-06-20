<template>
  <div
    class="box"
    :style="{
      gridTemplateColumns: alone ? '1fr' : '1fr 1fr',
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  alone: {
    type: Boolean,
    default: false,
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  text-align: center;
  width: 100%;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
