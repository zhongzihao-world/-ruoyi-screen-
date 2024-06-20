<template>
  <!-- 通用配置 -->
  <EchartsSetting :optionData="optionData" />

  <el-collapse-item>
    <template #title>
      <span class="collapse-tit">地图设置</span>
    </template>

    <el-form-item label="地图配置">
      <FormSettingBox>
        <FormSettingItem name="">
          <el-select v-model="mapRegion.adcode">
            <el-option
              v-for="item in mapRegionOptions"
              :key="item.adcode"
              :value="item.adcode"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </FormSettingItem>

        <FormSettingItem name="南海诸岛">
          <el-switch v-model="mapRegion.showHainanIsLands" @click.stop />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="标签设置">
      <FormSettingBox>
        <FormSettingItem>
          <el-switch v-model="seriesList[0].label.show" @click.stop />
        </FormSettingItem>
      </FormSettingBox>

      <FormSettingBox>
        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="seriesList[0].label.color"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => seriesList[0].label.color = val"
          />
        </FormSettingItem>

        <FormSettingItem name="大小">
          <el-input-number v-model="seriesList[0].label.fontSize" :min="1" />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>

    <el-form-item label="边框设置">
      <FormSettingBox>
        <FormSettingItem name="颜色">
          <el-color-picker
            v-model="seriesList[0].itemStyle.borderColor"
            :show-alpha="true"
            :predefine="colorsPicker"
            @active-change="(val: string) => seriesList[0].itemStyle.borderColor = val"
          />
        </FormSettingItem>

        <FormSettingItem name="大小">
          <el-input-number
            v-model="seriesList[0].itemStyle.borderWidth"
            :min="1"
          />
        </FormSettingItem>
      </FormSettingBox>
    </el-form-item>
  </el-collapse-item>

  <el-divider content-position="center">
    <strong>数据项配置</strong>
  </el-divider>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import EchartsSetting from '@/components/EchartsSetting/index.vue';
import { GlobalThemeJsonType } from '@/settings/chartThemes/index';
import { colorsPicker } from '@/config';
import mapGeojson from './mapGeojson/china.json';

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true,
  },
});

const mapRegionOptions = ref([
  {
    adcode: 'china',
    name: '中国',
  },
  ...mapGeojson.features
    .filter(o => o.properties.name)
    .map(o => {
      return {
        adcode: o.properties.adcode,
        name: o.properties.name,
      };
    }),
]);

const seriesList = computed(() => {
  return props.optionData.series || [];
});
const mapRegion = computed(() => {
  return props.optionData.mapRegion || {};
});
</script>

<style lang="scss" scoped></style>
