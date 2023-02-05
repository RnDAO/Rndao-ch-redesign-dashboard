import { Paper } from '@mui/material';
import { FaDiscord } from 'react-icons/fa';
import Image from 'next/image';
import polygon from '../../../assets/svg/polygon.svg';
import moment from 'moment';

type IProps = {
  guild: any;
  onClick: (guildId: string) => void;
};
export default function ConnectedCommunitiesItem({ guild, onClick }: IProps) {
  return (
    <div>
      <Paper className="text-center mx-auto h-[200px] border border-gray-300 w-[200px] py-3 shadow-box rounded-xl flex flex-col justify-between">
        <div>
          <div className="font-sm flex justify-center items-center text-center">
            <p className="pr-1">Discord</p>
            {guild.isInProgress}
            <span
              className={`md:h-3 md:w-3 rounded-full ${
                !guild.isInProgress ? 'bg-success' : 'bg-warning-500'
              }`}
            />
          </div>
          <FaDiscord size={30} className="mx-auto mt-2 mb-3" />
        </div>
        <div className="text-sm flex items-center justify-center">
          <Image src={polygon} alt="polygon" width="30" height="30" />
          <div className="flex flex-col text-left pl-1">
            <p className="font-bold">{guild.name}</p>
            <p
              className={`text-xs ${
                !guild.isInProgress ? 'text-black' : 'text-warning-500'
              }`}
            >
              {!guild.isInProgress
                ? `Connected ${moment(guild.connectedAt).format('DD MMM yyyy')}`
                : 'Data import in progress'}
            </p>
          </div>
        </div>
        {guild.isInProgress ? (
          <div
            className="border-t text-secondary font-bold pt-2  cursor-pointer"
            onClick={() => onClick(guild.guildId)}
          >
            Disconnect
          </div>
        ) : (
          <div className="min-h-[30px]" />
        )}
      </Paper>
    </div>
  );
}
