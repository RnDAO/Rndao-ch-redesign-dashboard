import { useEffect, useState } from 'react';
import useAppStore from '../../../store/useStore';
import LineGraph from '../../global/LineGraph';
import StatisticalData from './StatisticalData';
import { SeriesData, StatisticsProps } from '../../../utils/interfaces';
import { FiCalendar } from 'react-icons/fi';
import RangeSelect from '../../global/RangeSelect';
import { communityActiveDates } from '../../../lib/data/dateRangeValues';
import Loading from '../../global/Loading';

export interface IntractionsProps {
  activePeriod: number;
  handleDateRange: (range: number) => void;
}

const defaultOptions = {
  chart: {
    zoomType: 'x',
  },
  rangeSelector: {
    enabled: true,
  },
  title: {
    text: '',
  },
  xAxis: {
    categories: [],
    gridLineWidth: 1.5,
    tickmarkPlacement: 'on',
    gridLineDashStyle: 'Dash', // set to 'Dash' for a dashed line
  },
  yAxis: {
    title: {
      text: '',
    },
    min: 0,
    max: 250,
  },
  series: [],
  legend: {
    enabled: true,
    align: 'left',
    verticalAlign: 'bottom',
    x: 10,
    y: -10,
  },
  plotOptions: {
    series: {
      turboThreshold: 10000,
      dataGrouping: {
        enabled: true,
        groupPixelWidth: 20,
      },
    },
  },
};

export default function InteractionsSection({
  activePeriod,
  handleDateRange,
}: IntractionsProps) {
  const { interactions, interactionsLoading } = useAppStore();
  const [options, setOptions] = useState(defaultOptions);
  const [statistics, setStatistics] = useState<StatisticsProps[]>([]);

  useEffect(() => {
    // Copy options on each changes
    const newOptions = JSON.parse(JSON.stringify(defaultOptions));

    if (interactions && interactions.series) {
      const maxDataValue = Math.max(
        ...interactions.series.map((s: SeriesData) => Math.max(...s.data))
      );

      if (maxDataValue > 0) {
        newOptions.yAxis.max = null;
      }
    }

    const newSeries = interactions?.series?.map((interaction: SeriesData) => {
      if (interaction.name === 'messages') {
        return {
          ...interaction,
          name: 'Messages',
          color: '#804EE1',
        };
      } else if (interaction.name === 'emojis') {
        return {
          ...interaction,
          name: 'Emojis',
          color: '#FF9022',
        };
      }
      return interaction;
    });

    newOptions.series = newSeries;
    newOptions.xAxis.categories = interactions.categories;

    setOptions(newOptions);

    setStatistics([
      {
        label: 'Messages',
        percentageChange: interactions.msgPercentageChange
          ? interactions.msgPercentageChange
          : 0,
        value: interactions.messages,
        colorBadge: 'bg-secondary',
        hasTooltip: false,
      },
      {
        label: 'Emojis',
        percentageChange: interactions.emojiPercentageChange
          ? interactions.emojiPercentageChange
          : 0,
        value: interactions.emojis,
        colorBadge: 'bg-warning-500',
        hasTooltip: false,
      },
    ]);
  }, [interactions]);

  return (
    <>
      <div className='flex flex-row justify-between'>
        <div className='w-full'>
          <div>
            <h3 className='text-xl font-medium text-lite-black'>
              Type of interaction
            </h3>
          </div>
        </div>
      </div>
      <div className='overflow-y-hidden overflow-x-scroll md:overflow-hidden'>
        <StatisticalData statistics={[...statistics]} />
      </div>
      <div className='w-full'>
        <div className='flex flex-col items-center justify-between space-y-2 pb-4 md:flex-row md:space-y-0'>
          <h3 className='text-xl font-medium text-lite-black'>
            Members activity over time
          </h3>
          <RangeSelect
            options={communityActiveDates}
            icon={<FiCalendar size={18} />}
            active={activePeriod}
            onClick={handleDateRange}
          />
        </div>
      </div>
      {interactionsLoading ? (
        <Loading height='400px' />
      ) : (
        <LineGraph options={options} />
      )}
    </>
  );
}
