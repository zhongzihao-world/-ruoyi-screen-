<template>
  <div class="borderBase-box">
    <div class="borderBase-tit" style="width: 300px; left: 40%">
      {{ borderTitle }}
    </div>

    <div class="t_line_box">
      <i class="t_l_line"></i>
      <i class="l_t_line"></i>
    </div>

    <div class="t_line_box">
      <i class="t_r_line"></i>
      <i class="r_t_line"></i>
    </div>

    <div class="t_line_box">
      <i class="l_b_line"></i>
      <i class="b_l_line"></i>
    </div>

    <div class="t_line_box">
      <i class="r_b_line"></i>
      <i class="b_r_line"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue';

import { CreateComponentType } from '@/packages/index.d';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

const borders = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];

const { w, h } = toRefs(props.chartConfig.attr);
const { borderTitle } = toRefs(props.chartConfig.option);
</script>

<style lang="scss" scoped>
.borderBase-box {
  position: relative;
  box-sizing: border-box;
  border: 2px solid #2c58a6;
  box-shadow: 0 0 10px #2c58a6;

  .borderBase-tit {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 220px;
    height: 35px;
    background-color: #2c58a6;
    border-radius: 18px;
    position: absolute;
    top: -17px;
    left: 50%;
    margin-left: -110px;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }

  .t_line_box i {
    background-color: #4788fb;
    box-shadow: 0px 0px 10px #4788fb;
    position: absolute;
  }
  .t_l_line {
    height: 5px;
    width: 26px;
    left: -3px;
    top: -3px;
  }

  .l_t_line {
    width: 5px;
    height: 24px;
    left: -3px;
    top: -3px;
  }

  .t_r_line {
    height: 5px;
    width: 26px;
    right: -3px;
    top: -3px;
  }

  .r_t_line {
    width: 5px;
    height: 24px;
    right: -3px;
    top: -3px;
  }

  .l_b_line {
    width: 5px;
    height: 24px;
    left: -3px;
    bottom: -3px;
  }

  .b_l_line {
    height: 5px;
    width: 26px;
    left: -3px;
    bottom: -3px;
  }

  .r_b_line {
    width: 5px;
    height: 24px;
    right: -3px;
    bottom: -3px;
  }

  .b_r_line {
    height: 5px;
    width: 26px;
    right: -3px;
    bottom: -3px;
  }
}
</style>
