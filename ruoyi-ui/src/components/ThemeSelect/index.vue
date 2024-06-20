<template>
  <div
    style="display: flex; align-items: center; cursor: pointer"
    @click="changeTheme"
  >
    <el-icon size="32px">
      <Moon v-if="isDark" />
      <Sunny v-else />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();

const changeTheme = () => {
  const toggleDark = useToggle(isDark);
  toggleDark();
};
</script>
