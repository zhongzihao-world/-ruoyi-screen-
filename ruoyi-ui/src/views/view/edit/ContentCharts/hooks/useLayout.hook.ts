import { toRefs } from 'vue';

// 布局
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore';

// 结构控制
const { setItem } = useChartLayoutStore();
const { getCharts } = toRefs(useChartLayoutStore());

export { setItem, getCharts };
