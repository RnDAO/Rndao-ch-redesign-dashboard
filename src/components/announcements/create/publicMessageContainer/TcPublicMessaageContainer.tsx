import React, { useState } from 'react';
import TcText from '../../../shared/TcText';
import { MdAnnouncement } from 'react-icons/md';
import TcIconContainer from '../TcIconContainer';
import TcSelect from '../../../shared/TcSelect';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import TcInput from '../../../shared/TcInput';
import TcPublicMessagePreviewDialog from './TcPublicMessagePreviewDialog';

const mockPublicChannels = [
  {
    label: 'test',
    value: 1,
  },
  {
    label: 'test2',
    value: 2,
  },
];

function TcPublicMessaageContainer() {
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedChannels(event.target.value as number[]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const getSelectedChannelLabels = () => {
    return selectedChannels.map(
      (channelId) =>
        mockPublicChannels.find((channel) => channel.value === channelId)
          ?.label || ''
    );
  };

  const selectedChannelLabels = getSelectedChannelLabels();

  const isPreviewDialogEnabled =
    selectedChannels.length > 0 && message.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-1 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
          <TcIconContainer>
            <MdAnnouncement size={20} />
          </TcIconContainer>
          <TcText text="Public Message" variant="body1" fontWeight="bold" />
        </div>
        <TcPublicMessagePreviewDialog
          textMessage={message}
          isPreviewDialogEnabled={isPreviewDialogEnabled}
          selectedChannels={selectedChannelLabels}
        />
      </div>
      <div className="space-y-1.5">
        <FormControl variant="filled" fullWidth size="medium">
          <InputLabel id="select-standard-label">Select Channels</InputLabel>
          <TcSelect
            multiple
            labelId="select-standard-label"
            id="select-standard-label"
            label="Platform"
            options={mockPublicChannels}
            value={selectedChannels}
            renderValue={(selected) =>
              (selected as number[])
                .map(
                  (value) =>
                    mockPublicChannels.find(
                      (channel) => channel.value === value
                    )?.label
                )
                .join(', ')
            }
            onChange={(event) => handleSelectChange(event)}
          />
          <FormHelperText>
            The announcement will be sent by the a bot which will have access to
            send the following message within the selected channels
          </FormHelperText>
        </FormControl>
        <FormControl variant="filled" fullWidth size="medium">
          <TcInput
            label="Message"
            variant="filled"
            placeholder="Write your message here"
            rows={2}
            multiline
            value={message}
            onChange={handleChange}
            helperText={`${message.length} character${
              message.length !== 1 ? 's' : ''
            }`}
          />
        </FormControl>
      </div>
    </div>
  );
}

export default TcPublicMessaageContainer;
