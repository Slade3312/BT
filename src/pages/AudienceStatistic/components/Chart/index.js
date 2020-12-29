import {
  ChartDoubleBar,
  ChartPictorialBar,
  ChartPie,
  ChartSimpleBar,
  ChartTree,
  ChartTreeMap,
  ChartTriplePieBars,
} from '../ChartBricks';
import { withChartView } from './enhancers';

// sync and update all chart state (on update and change): 'echarts' options and frameControls
export const Chart = {
  Pie: withChartView(ChartPie),
  SimpleBar: withChartView(ChartSimpleBar),
  DoubleBar: withChartView(ChartDoubleBar),
  TreeMap: withChartView(ChartTreeMap),
  PictorialBar: withChartView(ChartPictorialBar),
  TriplePieBars: withChartView(ChartTriplePieBars),
};

// 'echarts' options will be synced only on chart init
export const ChartNotSyncedOptions = {
  Tree: withChartView(ChartTree),
};
