import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
interface BarChartProps {
  height: number
  // width: number
  options: echarts.EChartsCoreOption
}
export default function BarChart(props: BarChartProps) {
  const chartEl = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();
  const {height, options} = props
  useEffect(() => {
    window.onresize = function(){
      chartInstance.current?.resize()
    }
    if (chartEl.current) chartInstance.current = echarts.init(chartEl.current);
  }, []);

  // 绘制图表
  chartInstance.current?.setOption(options);
  chartInstance.current?.resize()
  return (
    <div>
      <div style={{height: height + 'px'}} ref={chartEl}></div>
    </div>
  );
}
