<template>
  <div class="chart-setting" v-if="targetData">
    <el-form label-width="auto" label-position="left" size="default">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template #title>
            <span class="collapse-tit">基础设置</span>
          </template>

          <el-form-item label="组件名称">
            <el-input
              v-model="targetData.chartConfig.title"
              placeholder="请输入名称"
              type="text"
              show-word-limit
              :min="1"
              :max="20"
            />
          </el-form-item>

          <el-form-item label="组件尺寸">
            <FormSettingBox>
              <FormSettingItem name="宽度">
                <el-input-number
                  v-model="targetData.attr.w"
                  :disabled="targetData.isGroup"
                  :min="100"
                />
              </FormSettingItem>

              <FormSettingItem name="高度">
                <el-input-number
                  v-model="targetData.attr.h"
                  :disabled="targetData.isGroup"
                  :min="100"
                />
              </FormSettingItem>
            </FormSettingBox>
          </el-form-item>

          <el-form-item label="组件位置">
            <FormSettingBox>
              <FormSettingItem name="水平">
                <el-input-number v-model="targetData.attr.x" />
              </FormSettingItem>

              <FormSettingItem name="垂直">
                <el-input-number v-model="targetData.attr.y" />
              </FormSettingItem>
            </FormSettingBox>
          </el-form-item>

          <el-form-item label="不透明度">
            <el-slider
              v-model="targetData.styles.opacity"
              :min="0"
              :max="100"
              :marks="marks"
              style="width: 92%"
            />
          </el-form-item>

          <el-form-item label="填充设置">
            <FormSettingBox>
              <FormSettingItem name="上">
                <el-input-number
                  v-model="targetData.styles.paddingTop"
                  :min="0"
                />
              </FormSettingItem>

              <FormSettingItem name="下">
                <el-input-number
                  v-model="targetData.styles.paddingBottom"
                  :min="0"
                />
              </FormSettingItem>

              <FormSettingItem name="左">
                <el-input-number
                  v-model="targetData.styles.paddingLeft"
                  :min="0"
                />
              </FormSettingItem>

              <FormSettingItem name="右">
                <el-input-number
                  v-model="targetData.styles.paddingRight"
                  :min="0"
                />
              </FormSettingItem>
            </FormSettingBox>
          </el-form-item>
        </el-collapse-item>

        <component
          :is="targetData.chartConfig.conKey"
          :optionData="targetData.option"
        />
      </el-collapse>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import FormSettingBox from '@/components/FormSettingBox/index.vue';
import FormSettingItem from '@/components/FormSettingBox/item.vue';
import { useTargetData } from '../hooks/useTargetData.hook';

const { targetData } = useTargetData();

const activeNames = ref(['1']);
const marks = reactive({
  0: '0',
  50: '50',
  100: '100',
});
</script>

<style lang="scss" scoped>
.chart-setting {
  padding: 20px 10px;
}

:deep(.collapse-tit) {
  margin-right: 8px;
  font-size: 16px;
  font-weight: bold;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

:deep(.el-form-item) {
  display: flex;
  align-items: start;
}

:deep(.el-slider__marks-text) {
  margin-top: 8px;
  font-weight: bold;
}
</style>
