import { ReactElement, SyntheticEvent, useState } from 'react';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';

interface ICustomTab {
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  labels: string[];
  content: ReactElement[];
  tabWidth?: string;
}

function CustomTab({
  activeTab,
  onTabChange,
  labels,
  content,
  tabWidth,
}: ICustomTab) {
  return (
    <Box sx={{ typography: 'body5' }}>
      <TabContext value={activeTab}>
        <TabList
          onChange={onTabChange}
          aria-label="custom tabs"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            },
          }}
        >
          {labels.map((label: string, index: number) => (
            <Tab
              key={index}
              label={label}
              value={`${index + 1}`}
              sx={{
                width: tabWidth ? tabWidth : '214px',
                height: '40px',
                '@media (max-width: 600px)': {
                  width: '50%',
                },
              }}
            />
          ))}
        </TabList>
        {content.map((con: ReactElement, index: number) => (
          <TabPanel
            key={index}
            value={`${index + 1}`}
            className="shadow-lg rounded-md"
          >
            {con}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}

export default CustomTab;
