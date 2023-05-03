import { useEffect, useState } from 'react';

import Highcharts from 'highcharts';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import HighchartsReact from 'highcharts-react-official';

import { FiCalendar } from 'react-icons/fi';
import RangeSelect from '../../global/RangeSelect';
import ZonePicker from '../../global/ZonePicker';
import FilterByChannels from '../../global/FilterByChannels';
import useAppStore from '../../../store/useStore';
import moment from 'moment';
import 'moment-timezone';
import momentTZ from 'moment-timezone';
import SimpleBackdrop from '../../global/LoadingBackdrop';
import { StorageService } from '../../../services/StorageService';
import { IGuildChannels, ISubChannels, IUser } from '../../../utils/types';
import NumberOfMessages from './NumberOfMessages';

if (typeof Highcharts === 'object') {
  HighchartsHeatmap(Highcharts);
}

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
const WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const HOURE_DAYS = [
  '12',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

const Chart = () => {
  const [heatmapChart, setHeatmapChart] = useState({});
  const {
    isLoading,
    fetchHeatmapData,
    getUserGuildInfo,
    fetchGuildChannels,
    getSelectedChannelsList,
    selectedChannelsList,
  } = useAppStore();
  const [user, setUser] = useState<IUser>();
  const [active, setActive] = useState(1);
  const [dateRange, setDateRange] = useState<any>([null, null]);
  let [selectedZone, setSelectedZone] = useState(momentTZ.tz.guess());
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = StorageService.readLocalStorage<IUser>('user');
      if (!user) {
        return; // Exit early if there is no user
      }

      setUser(user);

      try {
        const guildId = user.guild.guildId;
        getUserGuildInfo(guildId);
        fetchGuildChannels(guildId);
        const channelsList: IGuildChannels[] | [] =
          await getSelectedChannelsList(guildId);

        if (!Array.isArray(channelsList) || !channelsList.length) {
          return; // Exit early if there are no selected channels
        }

        setDateRange([
          moment().subtract(7, 'days'),
          moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        ]);

        const channelIds = channelsList
          .flatMap((channel) => channel.subChannels) // Flatten the subChannels arrays
          .filter((subChannel) => Boolean(subChannel)) // Filter out falsy subChannels
          .map((subChannel) => subChannel.id);

        setChannels(channelIds);

        if (!channelIds.length) {
          return; // Exit early if there are no valid subChannels
        }

        await Promise.all([
          fetchHeatmap(
            guildId,
            moment().subtract(7, 'days'),
            moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            selectedZone,
            channelIds
          ),
        ]);
      } catch (error) {
        console.error(error);
        // Handle any errors that occur
      }
    };

    fetchData();
  }, []);

  const fetchHeatmap = (
    guildId: string,
    startDate: any,
    endDate: any,
    timezone: string,
    channelIds: string[]
  ) => {
    if (guildId) {
      fetchHeatmapData(guildId, startDate, endDate, timezone, channelIds).then(
        (_res: any) => {
          setHeatmapChart({
            chart: {
              type: 'heatmap',
              plotBorderWidth: 0,
            },
            title: {
              text: null,
            },
            legend: {
              enabled: false,
            },
            xAxis: {
              categories: HOURE_DAYS,
              tickInterval: 1,
              labels: {
                step: 1,
                style: {
                  fontSize: '14px',
                  fontFamily: 'Inter',
                },
              },
              opposite: true,
              gridLineWidth: 0,
              lineWidth: 0,
              lineColor: 'rgba(0,0,0,0.75)',
              tickWidth: 0,
              tickLength: 0,
              tickColor: 'rgba(0,0,0,0.75)',
              title: {
                text: 'Hour',
                style: {
                  fontSize: '14px',
                  fontFamily: 'Inter',
                },
                align: 'low',
              },
            },
            yAxis: {
              categories: WEEK_DAYS,
              lineWidth: 0,
              gridLineWidth: 0,
              title: 'Weekdays',
              reversed: true,
              labels: {
                style: {
                  fontSize: '14px',
                  fontFamily: 'Inter',
                },
              },
            },
            tooltip: {
              enabled: false,
            },
            colorAxis: {
              min: 0,
              minColor: '#F3F3F3',
              maxColor: '#45367B',
              max: 100,
              stops: [
                [0, '#F1F3F3'],
                [0.1, '#EBF2F5'],
                [0.15, '#E0F1F7'],
                [0.2, '#C4D8F8'],
                [0.25, '#AEDFF0'],
                [0.3, '#DAD0FF'],
                [0.5, '#AE9DF0'],
                [0.7, '#8474C0'],
                [1, '#45367B'],
              ],
            },
            series: [
              {
                name: 'Revenue',
                borderWidth: 0.5,
                borderColor: 'white',
                states: {
                  hover: {
                    enabled: false,
                  },
                },
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    textOutline: 'none',
                    fontWeight: 'normal',
                  },
                },
                pointPadding: 1.5,
                data: _res?.map((item: any[]) => [
                  item[1],
                  item[0],
                  item[2] || 0,
                ]),
                colsize: 0.9,
                rowsize: 0.8,
              },
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 600,
                  },
                  // Make the labels less space demanding on mobile
                  chartOptions: {
                    chart: {
                      scrollablePlotArea: {
                        minWidth: 1080,
                      },
                    },
                    legend: {
                      title: {
                        text: 'Number of interactions',
                        style: {
                          fontStyle: 'bold',
                          fontSize: '10px',
                          fontFamily: 'Inter',
                        },
                      },
                      align: 'left',
                      layout: 'horizental',
                      margin: 0,
                      verticalAlign: 'bottom',
                      y: 0,
                      x: 25,
                      symbolHeight: 20,
                    },
                    xAxis: {
                      width: 1000,
                      labels: {
                        step: 1,
                        style: {
                          fontSize: '10px',
                          fontFamily: 'Inter',
                        },
                      },
                    },
                    yAxis: {
                      labels: {
                        style: {
                          fontSize: '10px',
                          fontFamily: 'Inter',
                        },
                      },
                    },
                    series: [
                      {
                        name: 'Revenue',
                        borderWidth: 0.5,
                        borderColor: 'white',
                        dataLabels: {
                          enabled: true,
                          style: {
                            fontSize: '10px',
                            fontFamily: 'Inter',
                          },
                        },
                        pointPadding: 0.8,
                        data: _res?.map((item: any[]) => [
                          item[1],
                          item[0],
                          item[2] || 0,
                        ]),
                        colsize: 0.9,
                        rowsize: 0.9,
                      },
                    ],
                  },
                },
              ],
            },
          });
        }
      );
    }
  };

  const handleSelectedZone = (zone: string) => {
    setSelectedZone(zone);

    if (user) {
      const { guildId } = user.guild;
      fetchHeatmap(guildId, dateRange[0], dateRange[1], zone, channels);
    }
  };

  const handleSelectedChannels = (selectedChannels: string[]) => {
    setChannels(selectedChannels);

    if (user) {
      const { guildId } = user.guild;
      fetchHeatmap(
        guildId,
        dateRange[0],
        dateRange[1],
        selectedZone,
        selectedChannels
      );
    }
  };

  const handleDateRange = (dateRangeType: string | number) => {
    let dateTime: string[] = [];
    switch (dateRangeType) {
      case 1:
        setActive(dateRangeType);
        dateTime = [
          moment().subtract('7', 'days').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        ];
        break;
      case 2:
        setActive(dateRangeType);
        dateTime = [
          moment().subtract('1', 'months').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        ];
        break;
      case 3:
        setActive(dateRangeType);
        dateTime = [
          moment().subtract('3', 'months').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        ];
        break;
      case 4:
        setActive(dateRangeType);
        dateTime = [
          moment().subtract('6', 'months').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        ];
        break;
      case 5:
        setActive(dateRangeType);
        dateTime = [
          moment().subtract('1', 'year').format('YYYY-MM-DDTHH:mm:ss[Z]'),
          moment().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        ];
        break;
      default:
        break;
    }
    setDateRange([...dateTime]);
    if (user) {
      const { guildId } = user.guild;
      fetchHeatmap(guildId, dateTime[0], dateTime[1], selectedZone, channels);
    }
  };

  if (isLoading) return <SimpleBackdrop />;

  return (
    <div className="bg-white shadow-box rounded-lg p-5 min-h-[400px]">
      <div className="flex flex-col md:flex-row justify-between items-baseline">
        <div className="px-3">
          <h3 className="font-bold text-xl md:text-2xl">
            When is the community most active?
          </h3>
          <p className="text-md md:text-base pt-4 text-gray-700 font-light">
            Hourly messages summed over the selected time period.
          </p>
        </div>
        <div className="flex flex-col-reverse px-2.5 w-full md:w-auto md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <RangeSelect
            options={communityActiveDates}
            icon={<FiCalendar size={18} />}
            active={active}
            onClick={handleDateRange}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-center md:py-2 px-3">
        <div className="flex flex-col md:flex-row md:space-x-3 md:mt-3 w-full">
          <ZonePicker
            selectedZone={selectedZone}
            handleSelectedZone={handleSelectedZone}
          />
          <FilterByChannels
            guildChannels={selectedChannelsList}
            filteredChannels={channels}
            handleSelectedChannels={handleSelectedChannels}
          />
        </div>
        <div className="hidden md:block">
          <NumberOfMessages numberOfMessages={0} />
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={heatmapChart}
        allowChartUpdate
      />
      <div className="block ml-3 md:hidden">
        <NumberOfMessages numberOfMessages={0} />
      </div>
    </div>
  );
};

export default Chart;