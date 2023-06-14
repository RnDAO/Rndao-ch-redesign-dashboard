export interface StatisticsProps {
  label: string;
  percentageChange: number;
  description?: string;
  value: number;
  colorBadge: string;
  hasTooltip: boolean;
  tooltipText?: React.ReactNode;
  customBackground?: boolean;
}

export interface SeriesData {
  name: string;
  data: number[];
}
