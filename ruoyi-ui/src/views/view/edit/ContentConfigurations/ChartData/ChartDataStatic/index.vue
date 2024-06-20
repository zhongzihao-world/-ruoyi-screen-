<template>
  <div class="chart-data-static">
    <ChartDataMatchingAndShow :ajax="false" />
  </div>
</template>

<script setup lang="ts">
import ChartDataMatchingAndShow from '../ChartDataMatchingAndShow/index.vue';
</script>

<style lang="scss" scoped>
.chart-data-static {
}
</style>
