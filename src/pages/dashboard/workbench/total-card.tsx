import Chart from '@/components/chart';
import useChart from '@/components/chart/useChart';
import {SvgIcon} from '@/components/icon';
import {Card} from 'antd';

type Props = {
  title: string;
  increase: boolean;
  percent: string;
  count: string;
  chartData: number[];
};

export default function TotalCard({
  title,
  increase,
  percent,
  count,
  chartData,
}: Props) {
  return (
    <Card>
      {/* flex-grow 属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。 */}
      <div className='flex-grow'>
        <h6 className='text-sm font-medium'>{title}</h6>
        <div className='mb-2 mt-4 flex flex-row'>
          {increase ? (
            <SvgIcon icon='ic_rise' color='rgb(34, 197, 94)' size='24' />
          ) : (
            <SvgIcon icon='ic_decline' color='rgb(255, 86, 48)' size='24' />
          )}
          <div className='ml-2'>
            <span>{increase ? '+' : '-'}</span>
            <span>{percent}</span>
          </div>
        </div>
        <h3 className='text-2xl font-bold'>{count}</h3>
      </div>

      <ChartLine data={chartData} />
    </Card>
  );
}

function ChartLine({data}: {data: number[]}) {
  const series = [
    {
      name: '',
      data,
    },
  ];
  const chartOptions = useChart({
    tooltip: {
      x: {
        show: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
        showDuplicates: false,
      },
      tooltip: {
        enabled: false,
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      crosshairs: {
        show: false,
      },
    },
    grid: {
      show: false, // 隐藏网格
    },
  });
  return <Chart type='line' series={series} options={chartOptions} />;
}
