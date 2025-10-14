import {memo} from 'react';
// 图表库
import ApexChart from 'react-apexcharts';
import type {Props as ApexChartProps} from 'react-apexcharts';
import {chartWrapper} from './styles.css';

function Chart(props: ApexChartProps) {
  return (
    <div className={chartWrapper}>
      <ApexChart options={props.options} series={props.series} type='area' />
    </div>
  );
}

export default memo(Chart);
