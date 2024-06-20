<template>
  <div class="box-item">
    <slot />

    <soan>{{ name }}</soan>
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.box-item {
  display: flex;
  flex-direction: column;
}
</style>
