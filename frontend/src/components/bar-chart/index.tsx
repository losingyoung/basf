import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
interface BarChartProps {
  data: [];
  height: number
  width: number
}
export default function BarChart(props: BarChartProps) {
  const chartEl = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();
  const {height, width} = props
  console.log(chartEl.current);
  useEffect(() => {
    window.onresize = function(){
      chartInstance.current?.resize()
    }
    if (chartEl.current) chartInstance.current = echarts.init(chartEl.current);
  }, []);

  // 绘制图表
  chartInstance.current?.setOption({
    title: {
      text: 'ECharts 入门示例',
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  });
  return (
    <div>
      <div style={{height: height + 'px'}} ref={chartEl}></div>
    </div>
  );
}
