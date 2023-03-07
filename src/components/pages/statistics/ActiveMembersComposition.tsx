import { useEffect, useState } from 'react';
import useAppStore from '../../../store/useStore';
import LineGraph from '../../global/LineGraph';
import StatisticalData from './StatisticalData';
import { FiCalendar } from 'react-icons/fi';
import RangeSelect from '../../global/RangeSelect';

const defaultOptions = {
  title: {
    text: '',
  },
  xAxis: {
    categories: ['03 May', '04 May', '05 May', '06 May'],
  },
  yAxis: {
    title: {
      text: '',
    },
  },
  series: [
    {
      name: 'Total active members',
      data: [2, 4, 56, 233],
      color: '#3AAE2B',
    },
    {
      name: 'Newly active',
      data: [22, 43, 156, 233],
      color: '#FF9022',
    },
    {
      name: 'Consistently active',
      data: [12, 14, 52, 23],
      color: '#804EE1',
    },
    {
      name: 'Vital members',
      data: [25, 43, 16, 33],
      color: '#313671',
    },
    {
      name: 'Became disengaged',
      data: [5, 40, 18, 50],
      color: '#FB3E56',
    },
  ],
  legend: {
    enabled: false,
  },
};

const communityActiveDates = [
  {
    title: 'Last 7 days',
    value: 1,
  },
  {
    title: '1M',
    value: 2,
  },
  {
    title: '3M',
    value: 3,
  },
  {
    title: '6M',
    value: 4,
  },
  {
    title: '1Y',
    value: 5,
  },
];

export default function ActiveMembersComposition({
  activePeriod,
  handleDateRange,
}: any) {
  const { interactions } = useAppStore();
  const [options, setOptions] = useState(defaultOptions);
  const [statistics, setStatistics] = useState<
    {
      label: string;
      percentageChange: any;
      description: string;
      value: any;
      colorBadge: string;
    }[]
  >([]);

  useEffect(() => {
    // Copy options on each changes
    // const newOptions = JSON.parse(JSON.stringify(defaultOptions));

    // const newSeries = interactions?.series?.map((interaction: any) => {
    //   if (interaction.name === 'messages') {
    //     return {
    //       ...interaction,
    //       color: '#804EE1',
    //     };
    //   } else if (interaction.name === 'emojis') {
    //     return {
    //       ...interaction,
    //       color: '#FF9022',
    //     };
    //   }
    //   return interaction;
    // });

    // newOptions.series = newSeries;
    // newOptions.xAxis.categories = interactions.categories;

    // setOptions(newOptions);

    setStatistics([
      {
        label: 'Total active members',
        description: 'Interacted at least once in the last 7 days',
        percentageChange: 0,
        value: 0,
        colorBadge: 'bg-green',
      },
      {
        label: 'Newly active',
        description:
          'Started interacting for the first time in the last 7 days',
        percentageChange: 0,
        value: 0,
        colorBadge: 'bg-warning-500',
      },
      {
        label: 'Consistently active',
        description: 'Interacted weekly for at least 3 out of 4 weeks',
        percentageChange: 0,
        value: 0,
        colorBadge: 'bg-secondary',
      },
      {
        label: 'Vital members',
        description: 'Are consistently active and very connected',
        percentageChange: 0,
        value: 0,
        colorBadge: 'bg-info-600',
      },
      {
        label: 'Became disengaged',
        description: "Were active, but didn't interact in the last 2 weeks",
        percentageChange: 0,
        value: 0,
        colorBadge: 'bg-error-500',
      },
    ]);
  }, [interactions]);

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="w-full">
          <div className="flex flex-row justify-between items-center">
            <h3 className="text-lg font-medium text-lite-black">
              Active members composition
            </h3>
            <RangeSelect
              options={communityActiveDates}
              icon={<FiCalendar size={18} />}
              active={activePeriod}
              onClick={handleDateRange}
            />
          </div>
        </div>
      </div>
      <StatisticalData statistics={[...statistics]} />
      <LineGraph options={options} />
    </>
  );
}
