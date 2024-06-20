<template>
  <div style="display: flex;align-items: center;padding: 0 15px" @click="toggleClick">
    <el-icon size="22px">
      <Fold v-if="isActive"></Fold>
      <Expand v-else></Expand>
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggleClick']);
const toggleClick = () => {
  emit('toggleClick');
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
