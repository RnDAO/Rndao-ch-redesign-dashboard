import React, { useEffect, useState } from 'react';
import { debounce } from '@mui/material';
import Image from 'next/image';
import { MdGroups } from 'react-icons/md';

import Loading from '../../global/Loading';
import TcAvatar from '../../shared/TcAvatar';
import TcInput from '../../shared/TcInput';
import { conf } from '../../../configs';
import { useSnackbar } from '../../../context/SnackbarContext';
import { StorageService } from '../../../services/StorageService';
import useAppStore from '../../../store/useStore';
import { IDiscordModifiedCommunity } from '../../../utils/interfaces';

const updateCommunityName = debounce(
  async (communityId, newName, updateFunc, fetchFunc, showSnackbar) => {
    try {
      await updateFunc({
        communityId,
        name: newName.endsWith(' ') ? newName.slice(0, -1) : newName,
      });
      await fetchFunc();
      showSnackbar('Community name updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating community name:', error);
      showSnackbar('Failed to update community name', 'error');
    }
  },
  1000
);

function TcActiveCommunity() {
  const { retrieveCommunityById, patchCommunityById } = useAppStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [community, setCommunity] = useState<IDiscordModifiedCommunity | null>(
    null
  );

  const { showMessage } = useSnackbar();

  useEffect(() => {
    async function initFetch() {
      try {
        setLoading(true);
        await fetchCommunity();
      } catch (error) {
        console.error('Failed to fetch community data:', error);
      } finally {
        setLoading(false);
      }
    }

    initFetch();
  }, []);

  async function fetchCommunity() {
    try {
      const storedCommunityId =
        StorageService.readLocalStorage<IDiscordModifiedCommunity>(
          'community'
        )?.id;
      if (storedCommunityId) {
        const fullCommunityData =
          await retrieveCommunityById(storedCommunityId);

        setCommunity(fullCommunityData);
        StorageService.writeLocalStorage('community', fullCommunityData);
      }
    } catch (error) {
      StorageService.removeLocalStorage('community');
      setLoading(false);
      console.error('Failed to fetch community data:', error);
    }
  }

  const handleCommunityNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newName = event.target.value;
    if (community && community.id) {
      setCommunity({ ...community, name: newName });
      updateCommunityName(
        community.id,
        newName,
        patchCommunityById,
        fetchCommunity,
        showMessage
      );
    }
  };

  const renderPlatformAvatar = (community: IDiscordModifiedCommunity) => {
    let activeCommunityPlatformIcon;

    if (community?.platforms) {
      activeCommunityPlatformIcon = community.platforms.find(
        (platform) =>
          platform.disconnectedAt === null && platform.name === 'discord'
      );
    }

    if (
      activeCommunityPlatformIcon &&
      activeCommunityPlatformIcon.metadata &&
      activeCommunityPlatformIcon.metadata.icon
    ) {
      return (
        <Image
          src={`${conf.DISCORD_CDN}icons/${activeCommunityPlatformIcon.metadata.id}/${activeCommunityPlatformIcon.metadata.icon}`}
          width='100'
          height='100'
          alt={activeCommunityPlatformIcon.metadata.name || ''}
          className='rounded-full'
        />
      );
    }

    return <MdGroups size={28} />;
  };

  if (loading) {
    return (
      <div className='mt-4 flex items-center justify-center border-b border-b-gray-200 py-4'>
        <Loading height='250' size={30} />
      </div>
    );
  }

  return (
    <div className='mt-4 flex flex-col border-b border-b-gray-200 md:flex-row md:items-center md:justify-between md:py-4'>
      <div className='flex flex-col space-y-3 space-x-2 md:flex-row md:items-center md:space-y-0 md:px-3'>
        {community && community.avatarURL ? (
          <TcAvatar className='mx-auto' src={community.avatarURL} />
        ) : (
          <TcAvatar className='mx-auto'>
            {community ? (
              renderPlatformAvatar(community)
            ) : (
              <MdGroups size={28} />
            )}
          </TcAvatar>
        )}
        {loading ? (
          <Loading height='40px' size={30} />
        ) : (
          <TcInput
            label='Community name'
            variant='filled'
            placeholder='Write community name'
            size='small'
            value={community?.name || ''}
            disabled={!community?.name}
            onChange={handleCommunityNameChange}
            sx={{
              minWidth: '14rem',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default TcActiveCommunity;
