import Chart from '@/components/chart';
import useChart from '@/components/chart/useChart';
import {Card, Select, Typography} from 'antd';
import {useState} from 'react';

export default function AreaDownload() {
  const [year, setYear] = useState('2023');
  const series: Record<string, ApexAxisChartSeries> = {
    '2022': [
      {name: 'China', data: [10, 41, 35, 51, 49, 61, 69, 91, 148, 35, 51]},
      {name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 45, 13, 56, 77]},
    ],

    '2023': [
      {name: 'China', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 35, 51]},
      {name: 'America', data: [56, 13, 34, 10, 77, 99, 88, 45, 13, 56, 77]},
    ],
  };

  return (
    <Card className='flex-col'>
      {/* align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性 */}
      <header className='flex w-full justify-between self-start'>
        <Typography.Title level={5}>Area Download</Typography.Title>
        <Select
          size='small'
          defaultValue={year}
          onChange={setYear}
          options={[
            {value: 2023, label: '2023'},
            {value: 2022, label: '2022'},
          ]}
        />
      </header>
      <main>
        <ChartArea series={series[year]} />
      </main>
    </Card>
  );
}

function ChartArea({series}: {series: ApexAxisChartSeries}) {
  const chartOptions = useChart({
    xaxis: {
      type: 'category',
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jut',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    tooltip: {},
  });

  return (
    <Chart type='area' options={chartOptions} series={series} height='300' />
  );
}
