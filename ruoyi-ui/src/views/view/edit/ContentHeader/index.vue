<template>
  <el-header>
    <div class="header-item left">
      <el-space>
        <HeaderLeftBtn />
      </el-space>
    </div>

    <div class="header-item center">
      <HeaderTitle />
    </div>

    <div class="header-item right">
      <el-space>
        <HeaderRightBtn />
        <ThemeSelect />
      </el-space>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { loadAsyncComponent } from '@/utils';

const ThemeSelect = loadAsyncComponent(
  () => import('@/components/ThemeSelect/index.vue'),
);
const HeaderLeftBtn = loadAsyncComponent(
  () => import('./HeaderLeftBtn/index.vue'),
);
const HeaderRightBtn = loadAsyncComponent(
  () => import('./HeaderRightBtn/index.vue'),
);
const HeaderTitle = loadAsyncComponent(() => import('./HeaderTitle/index.vue'));
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
  .header-item {
    display: flex;
    align-items: center;
    width: 33.3%;
  }

  .left {
    justify-content: start;
  }

  .center {
    justify-content: center;
  }
  .right {
    justify-content: end;
  }
}
</style>
