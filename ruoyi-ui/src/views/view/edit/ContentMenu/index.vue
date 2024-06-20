<template>
  <el-card
    class="context-menu"
    v-click-outside="onClickOutSide"
    :style="contextMenuStyle"
  >
    <template v-for="item in menuOptions" :key="item.key">
      <template v-if="item.icon">
        <el-text
          class="context-menu-item"
          size="large"
          :type="item.type"
          @click="handleMenuSelect(item.key)"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          {{ item.label }}
        </el-text>
      </template>
      <el-divider v-else style="margin: 10px 0" />
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useContextMenu } from '../hooks/useContextMenu.hook';

const { menuOptions, onClickOutSide, mousePosition, handleMenuSelect } =
  useContextMenu();

const contextMenuStyle = computed(() => {
  return {
    left: `${mousePosition.x + 10}px`,
    top: `${mousePosition.y + 10}px`,
  };
});
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 8px 12px !important;
}
.context-menu {
  position: absolute;
  z-index: 99999;

  .context-menu-item {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-left: 8px;
    margin-right: 8px;
    cursor: pointer;
    font-size: 16px;
    &:not(:last-child) {
      margin-bottom: 6px;
    }

    &:hover {
      opacity: 0.7;
    }
    .el-icon {
      margin-right: 5px;
    }
  }
}
</style>
