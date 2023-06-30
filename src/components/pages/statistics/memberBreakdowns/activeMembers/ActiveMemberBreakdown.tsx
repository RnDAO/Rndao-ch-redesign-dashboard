import { useState, useEffect } from 'react';
import { StorageService } from '../../../../../services/StorageService';
import useAppStore from '../../../../../store/useStore';
import { IUser } from '../../../../../utils/types';
import CustomTable from '../CustomTable';
import {
  Column,
  activityCompositionOptions,
} from '../../../../../utils/interfaces';
import CustomPagination from '../CustomPagination';
import CustomButton from '../../../../global/CustomButton';
import clsx from 'clsx';

const columns: Column[] = [
  { id: 'username', label: 'Name' },
  { id: 'roles', label: 'Roles' },
  { id: 'activityComposition', label: 'Activity composition' },
  { id: 'joinedAt', label: 'DAO member since' },
];

const options: activityCompositionOptions[] = [
  { name: 'All active', value: 'all_active', color: '#3AAE2B' },
  { name: 'Newly active', value: 'all_new_active', color: '#FF9022' },
  { name: 'Consistently active', value: 'all_consistent', color: '#804EE1' },
  { name: 'Vital member', value: 'all_vital', color: '#313671' },
  { name: 'Became disengaged', value: 'all_new_disengaged', color: '#EB3E56' },
  { name: 'Others', value: 'others', color: '#AAAAAA' },
];

export default function ActiveMemberBreakdown() {
  const { getActiveMemberCompositionTable, isActiveMembersBreakdownLoading } =
    useAppStore();
  const [isExpanded, toggleExpanded] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState<string[]>([]);
  const [activityComposition, setActivityComposition] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [sortBy, setSortBy] = useState('desc');
  const [fetchedData, setFetchedData] = useState<{
    limit?: string | number;
    page?: string | number;
    results: any[];
    totalPages: number;
    totalResults: number;
  }>({
    results: [],
    totalResults: 0,
    totalPages: 0,
  });
  const user = StorageService.readLocalStorage<IUser>('user');
  const guild = user?.guild;

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  useEffect(() => {
    if (!guild) {
      return;
    }

    const fetchData = async () => {
      const res = await getActiveMemberCompositionTable(
        guild.guildId,
        activityComposition,
        roles,
        username,
        sortBy,
        page
      );
      setFetchedData(res);
    };

    fetchData();
  }, [page, roles, activityComposition, username, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [activityComposition, roles, username, sortBy]);

  const handleRoleSelectionChange = (selectedRoles: string[]) => {
    setRoles(selectedRoles);
  };

  const handleActivityOptionSelectionChange = (selectedOptions: string[]) => {
    setActivityComposition(selectedOptions);
  };

  const handleJoinedAtChange = (joinedAt: string) => {
    setSortBy(joinedAt);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  return (
    <>
      <div className="relative overflow-x-scroll md:overflow-hidden mb-1 md:mb-1">
        <h3 className="text-xl font-medium text-lite-black md:mb-4">
          Members breakdown
        </h3>
        <div
          className={clsx(
            !isExpanded ? 'max-h-[17.8rem]' : 'max-h-max',
            'mb-4'
          )}
        >
          {!isExpanded && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-20 pointer-events-none"></div>
          )}
          <div
            className={clsx(
              !isExpanded && fetchedData?.results.length > 0
                ? 'pointer-events-none'
                : ''
            )}
          >
            <CustomTable
              data={fetchedData?.results ? fetchedData.results : []}
              columns={columns}
              handleRoleSelectionChange={handleRoleSelectionChange}
              handleActivityOptionSelectionChange={
                handleActivityOptionSelectionChange
              }
              handleJoinedAtChange={handleJoinedAtChange}
              handleUsernameChange={handleUsernameChange}
              isLoading={isActiveMembersBreakdownLoading}
              activityCompositionOptions={options}
            />
          </div>
        </div>
      </div>
      <div className={clsx(!isExpanded ? 'hidden' : 'flex justify-end mb-8')}>
        <CustomPagination
          totalItems={fetchedData.totalResults}
          itemsPerPage={Math.ceil(
            fetchedData.totalResults / fetchedData.totalPages
          )}
          currentPage={page}
          onChangePage={handlePageChange}
        />
      </div>
      {fetchedData && fetchedData?.totalResults > 10 ? (
        <div className="flex justify-center mt-2 mb-12">
          <CustomButton
            label={isExpanded ? 'Show less' : 'Show member breakdown'}
            classes={'text-black'}
            variant="outlined"
            disabled={fetchedData?.totalResults === 0}
            onClick={() => toggleExpanded(!isExpanded)}
          />
        </div>
      ) : (
        ''
      )}
    </>
  );
}
