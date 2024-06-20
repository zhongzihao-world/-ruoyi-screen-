<template>
  <!-- 渲染器设置 -->
  <el-collapse-item>
    <template #title>
      <span class="collapse-tit">渲染方式</span>
    </template>

    <el-form-item label="全局">
      <el-radio-group v-model="themeSetting.renderer">
        <el-radio-button key="svg" label="svg">svg</el-radio-button>
        <el-radio-button key="canvas" label="canvas">canvas</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="单个">
      <el-radio-group v-model="optionData.renderer">
        <el-radio-button key="svg" label="svg">svg</el-radio-button>
        <el-radio-button key="canvas" label="canvas">canvas</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-collapse-item>

  <!-- grod 填充 -->
  <el-collapse-item v-if="grid">
    <template #title>
      <span class="collapse-tit">图表填充</span>
    </template>

    <el-form-item label="主标题">
      <FormSettingBox>
        <FormSettingItem name="上">
          <el-input-number v-model="grid.top" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="下">
          <el-input-number v-model="grid.bottom" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="左">
          <el-input-number v-model="grid.left" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="右">
          <el-input-number v-model="grid.right" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>

  <!-- 标题 -->
  <el-collapse-item v-if="title">
    <template #title>
      <span class="collapse-tit">标题显示</span>
      <el-switch v-model="title.show" @click.stop />
    </template>

    <el-form-item label="主标题">
      <FormSettingBox alone>
        <FormSettingItem>
          <el-input v-model="title.text" />
        </FormSettingItem>
      </FormSettingBox>

      <FormSettingBox>
        <FormSettingItem name="字体大小">
          <el-input-number v-model="title.textStyle.fontSize" :min="1" />
        </FormSettingItem>

        <FormSettingItem name="字体颜色">
          <el-color-picker
            v-model="title.textStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (title && (title.textStyle.color = val))"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="副标题">
      <FormSettingBox alone>
        <FormSettingItem>
          <el-input v-model="title.subtext" />
        </FormSettingItem>
      </FormSettingBox>

      <FormSettingBox>
        <FormSettingItem name="字体大小">
          <el-input-number v-model="title.subtextStyle.fontSize" :min="1" />
        </FormSettingItem>

        <FormSettingItem name="字体颜色">
          <el-color-picker
            v-model="title.subtextStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (title && (title.subtextStyle.color = val))"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="对齐方式">
      <el-radio-group v-model="title.x">
        <el-radio-button key="left" label="left">左对齐</el-radio-button>
        <el-radio-button key="center" label="center">居中</el-radio-button>
        <el-radio-button key="right" label="right">右对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <!-- <el-form-item label="偏移值">
      <FormSettingBox>
        <FormSettingItem name="水平">
          <el-input-number v-model="title.left" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="垂直">
          <el-input-number v-model="title.top" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item> -->
  </el-collapse-item>

  <!-- x 轴 -->
  <el-collapse-item v-if="xAxis">
    <template #title>
      <span class="collapse-tit">x 轴显示</span>
      <el-switch v-model="xAxis.show" @click.stop />
    </template>

    <el-form-item label="单位">
      <FormSettingBox>
        <FormSettingItem name="值">
          <el-input v-model="xAxis.name" />
        </FormSettingItem>

        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="xAxis.nameTextStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (xAxis && (xAxis.nameTextStyle.color = val))"
          />
        </FormSettingItem>

        <FormSettingItem name="大小">
          <el-input-number v-model="xAxis.nameTextStyle.fontSize" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="位置">
          <el-input-number v-model="xAxis.nameGap" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>

  <!-- y 轴 -->
  <el-collapse-item v-if="yAxis">
    <template #title>
      <span class="collapse-tit">y 轴显示</span>
      <el-switch v-model="yAxis.show" @click.stop />
    </template>

    <el-form-item label="单位">
      <FormSettingBox>
        <FormSettingItem name="值">
          <el-input v-model="yAxis.name" />
        </FormSettingItem>

        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="yAxis.nameTextStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (yAxis && (yAxis.nameTextStyle.color = val))"
          />
        </FormSettingItem>

        <FormSettingItem name="大小">
          <el-input-number v-model="yAxis.nameTextStyle.fontSize" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="位置">
          <el-input-number v-model="yAxis.nameGap" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>

  <!-- 图例 -->
  <el-collapse-item v-if="legend">
    <template #title>
      <span class="collapse-tit">图例显示</span>
      <el-switch v-model="legend.show" @click.stop />
    </template>

    <el-form-item label="文字">
      <FormSettingBox>
        <FormSettingItem name="大小">
          <el-input-number v-model="legend.textStyle.fontSize" :min="1" />
        </FormSettingItem>

        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="legend.textStyle.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => (legend && (legend.textStyle.color = val))"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>

  <!-- visualMap -->
  <el-collapse-item v-if="visualMap">
    <template #title>
      <span class="collapse-tit">数据映射</span>
      <el-switch v-model="visualMap.show" @click.stop />
    </template>

    <el-form-item label="映射类型">
      <el-radio-group v-model="visualMap.type">
        <el-radio-button key="continuous" label="continuous">
          连续型
        </el-radio-button>
        <el-radio-button key="piecewise" label="piecewise">
          离散型
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="数据范围">
      <FormSettingBox>
        <FormSettingItem name="最小值">
          <el-input-number v-model="visualMap.min" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="最大值">
          <el-input-number v-model="visualMap.max" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="控制图层">
      <el-radio-group v-model="visualMap.orient">
        <el-radio-button key="vertical" label="vertical">竖直</el-radio-button>
        <el-radio-button key="horizontal" label="horizontal">
          水平
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="位置">
      <FormSettingBox>
        <FormSettingItem name="水平">
          <el-input-number v-model="visualMap.left" :min="0" />
        </FormSettingItem>

        <FormSettingItem name="垂直">
          <el-input-number v-model="visualMap.top" :min="0" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { GlobalThemeJsonType } from '@/settings/chartThemes/index';
import { colorsPicker } from '@/config';

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true,
  },
});

const chartEditStore = useChartEditStore();
const themeSetting = computed(() => {
  const chartThemeSetting =
    chartEditStore.getEditCanvasConfig.chartThemeSetting;
  return chartThemeSetting;
});

const grid = computed(() => {
  return props.optionData.grid;
});
const title = computed(() => {
  return props.optionData.title;
});
const xAxis = computed(() => {
  return props.optionData.xAxis;
});
const yAxis = computed(() => {
  return props.optionData.yAxis;
});
const legend = computed(() => {
  return props.optionData.legend;
});
const visualMap = computed(() => {
  return props.optionData.visualMap;
});
</script>

<style lang="scss" scoped></style>
