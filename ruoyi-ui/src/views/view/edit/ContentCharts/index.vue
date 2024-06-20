<template>
  <div class="component-hd">
    <el-text truncated><strong style="font-size: 18px">组件</strong></el-text>
    <ChartsSearch v-show="getCharts" />
  </div>

  <div class="component-bd">
    <el-button-group>
      <el-button
        size="small"
        style="font-size: 18px"
        v-for="item in menuOptions"
        :key="item.key"
        :icon="item.icon"
        :type="selectOptions.key === item.key ? 'primary' : ''"
        @click="clickItemHandle(item.key, item)"
      >
        <span style="margin-top: 5px; font-size: 12px">{{ item.label }}</span>
      </el-button>
    </el-button-group>

    <ChartsOptionContent
      v-if="selectOptions"
      :selectOptions="selectOptions"
      :key="selectValue"
    />
  </div>
</template>

<script setup lang="ts">
import ChartsSearch from './ChartsSearch/index.vue';
import ChartsOptionContent from './ChartsOptionContent/index.vue';
import {
  getCharts,
  selectOptions,
  selectValue,
  clickItemHandle,
  menuOptions,
} from './hooks/useAside.hook';
</script>

<style lang="scss" scoped>
.component-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 10px;
  height: 24px;
  margin-bottom: 6px;
}
.component-bd {
  display: flex;
  height: calc(100% - 30px);

  .el-button-group {
    display: flex;
    flex-direction: column;
    .el-button {
      display: flex;
      flex-direction: column;
      width: 60px;
      height: 60px;
      border: 0;
    }
  }
}
</style>
