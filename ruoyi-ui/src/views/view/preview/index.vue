<template>
  <suspense>
    <suspenseIndex />

    <template #fallback>
      <div id="loader-wrapper">
        <div class="spinner">
          <div class="dot1"></div>
          <div class="dot2"></div>
        </div>
        <div class="load_title">正在初始化数据......</div>
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
import suspenseIndex from './suspenseIndex.vue';
</script>
