<template>
  <div class="component-content">
    <el-button-group>
      <el-button
        size="small"
        v-for="item in packages.menuOptions"
        :key="item.key"
        :type="selectValue === item.key ? 'primary' : ''"
        @click="clickItemHandle(item.key)"
      >
        <span style="font-size: 12px">{{ item.label }}</span>
      </el-button>
    </el-button-group>

    <div class="component-list">
      <ChartsItemBox :menuOptions="packages.selectOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';

import { ConfigType } from '@/packages/index.d';
import ChartsItemBox from '../ChartsItemBox/index.vue';

const props = defineProps({
  selectOptions: {
    type: Object,
    default: () => {},
  },
});

let packages = reactive<{
  [T: string]: any;
}>({
  // 侧边栏
  menuOptions: [],
  // 当前选择
  selectOptions: {},
  // 分类归档
  categorys: {
    all: [],
  },
  categoryNames: {
    all: '全部',
  },
  // 分类归档数量
  categorysNum: 0,
  // 存储不同类别组件进来的选中值
  saveSelectOptions: {},
});

const selectValue = ref<string>();

// 设置初始列表
const setSelectOptions = (categorys: any) => {
  for (const val in categorys) {
    packages.selectOptions = categorys[val];
    break;
  }
};

watch(
  // @ts-ignore
  () => props.selectOptions,
  (newData: { list: ConfigType[] }) => {
    packages.categorysNum = 0;
    if (!newData) return;
    newData.list.forEach((e: ConfigType) => {
      const value: ConfigType[] = (packages.categorys as any)[e.category];
      // @ts-ignore
      packages.categorys[e.category] =
        value && value.length ? [...value, e] : [e];
      packages.categoryNames[e.category] = e.categoryName;
      packages.categorys['all'].push(e);
    });
    for (const val in packages.categorys) {
      packages.categorysNum += 1;
      packages.menuOptions.push({
        key: val,
        label: packages.categoryNames[val],
      });
    }
    setSelectOptions(packages.categorys);
    // 默认选中处理
    selectValue.value = packages.menuOptions[0]['key'];
  },
  {
    immediate: true,
  },
);

// 处理点击事件
const clickItemHandle = (key: string) => {
  selectValue.value = key;
  packages.selectOptions = packages.categorys[key];
};
</script>

<style lang="scss" scoped>
$width: 300px;
$widthCollapse: 60px;

.component-content {
  display: flex;
  width: $width - $widthCollapse;
  height: 100%;

  .el-button-group {
    display: flex;
    flex-direction: column;

    .el-button {
      width: $widthCollapse;
      height: 32px;
      border: 0;
    }
  }

  .component-list {
    flex: 1;
  }
}
</style>
