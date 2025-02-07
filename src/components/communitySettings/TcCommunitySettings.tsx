import React, { useState } from 'react';
import { AlertTitle, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { BiError } from 'react-icons/bi';
import { IoIosSwap } from 'react-icons/io';
import { MdDeleteOutline, MdExpandMore } from 'react-icons/md';

import TcAlert from '../shared/TcAlert';
import TcAvatar from '../shared/TcAvatar';
import TcButton from '../shared/TcButton';
import TcDialog from '../shared/TcDialog';
import TcInput from '../shared/TcInput';
import TcText from '../shared/TcText';
import { conf } from '../../configs';
import { useSnackbar } from '../../context/SnackbarContext';
import { useToken } from '../../context/TokenContext';
import { StorageService } from '../../services/StorageService';
import useAppStore from '../../store/useStore';

function TcCommunitySettings() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteCommunityDialog, setOpenDeleteCommunityDialog] =
    useState<boolean>(false);
  const [activeDialogStep, setActiveDialogStep] = useState<1 | 2>(1);
  const [communityNameInput, setCommunityNameInput] = useState<string>('');
  const { showMessage } = useSnackbar();
  const { deleteCommunityById } = useAppStore();
  const { deleteCommunity, community } = useToken();

  const router = useRouter();

  const activePlatform = community?.platforms.find(
    (platform) =>
      platform.disconnectedAt === null && platform.name === 'discord'
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDeleteCommunityDialog = () => {
    setAnchorEl(null);
    setOpenDeleteCommunityDialog(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityNameInput(e.target.value);
  };

  const handleDeleteCommunity = async () => {
    if (communityNameInput === community?.name) {
      const data = await deleteCommunityById(community?.id);

      if (data !== undefined) {
        StorageService.removeLocalStorage('community');
        showMessage('Community deleted successfully', 'success');
        deleteCommunity();
        setOpenDeleteCommunityDialog(false);
        setCommunityNameInput('');
        router.push('/centric/select-community');
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
      <TcText text='Community Settings' variant='h5' />

      <TcButton
        text={
          <div className='flex items-center justify-between space-x-1.5'>
            <TcAvatar
              sx={{
                height: 34,
                width: 34,
              }}
              src={`${conf.DISCORD_CDN}icons/${activePlatform?.metadata.id}/${activePlatform?.metadata.icon}`}
            />
            <TcText
              text={community?.name}
              variant='subtitle2'
              fontWeight='bold'
              className='text-black'
            />
          </div>
        }
        endIcon={<MdExpandMore color='black' />}
        onClick={handleClick}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => router.push('/centric/select-community')}>
          <div className='flex items-center space-x-1.5'>
            <IoIosSwap />
            <TcText text='Change Community' variant='subtitle2' />
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleOpenDeleteCommunityDialog()}>
          <div className='flex items-center space-x-1.5'>
            <MdDeleteOutline />
            <TcText text='Delete Community' variant='subtitle2' />
          </div>
        </MenuItem>
      </Menu>
      <TcDialog
        open={openDeleteCommunityDialog}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '640px',
              borderRadius: '10px',
            },
          },
        }}
      >
        <div className='space-y-3 px-10 py-8 text-center'>
          {activeDialogStep === 1 ? (
            <>
              <div className='flex justify-center'>
                <BiError size={40} className='text-error-600' />
              </div>
              <TcText
                variant='h6'
                text={`Are you sure you want to delete ${community?.name} community?`}
              />
              <TcAlert
                severity='error'
                icon={false}
                className='flex justify-center rounded-sm bg-error-600/40 p-0 text-center'
              >
                <AlertTitle color='black' className='p-0'>
                  If you don't read this, unexpected bad things will happen!{' '}
                </AlertTitle>
              </TcAlert>
              <TcText
                className='text-center'
                variant='body2'
                text={
                  <>
                    Once the community account is deleted, there is{' '}
                    <strong>no way back</strong>. If you delete your community
                    account, all data from the platforms you had connected will
                    be <strong>deleted</strong> from our databases.
                  </>
                }
              />
              <TcButton
                text='I Understand'
                variant='contained'
                sx={{
                  minWidth: '13rem',
                }}
                onClick={() => setActiveDialogStep(2)}
              />
            </>
          ) : (
            <div className='mx-auto flex flex-col justify-center space-y-8 px-8 text-center'>
              <TcText
                variant='h6'
                text={
                  <>
                    To confirm that you want to delete the community, please
                    type <b>{community?.name}</b> in the field below:
                  </>
                }
              />
              <div className='mx-auto text-center'>
                <TcInput
                  label='Community name'
                  variant='filled'
                  placeholder='Write community name'
                  value={communityNameInput}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex justify-between'>
                <TcButton
                  text='Cancel'
                  variant='outlined'
                  onClick={() => {
                    setOpenDeleteCommunityDialog(false), setActiveDialogStep(1);
                  }}
                />
                <TcButton
                  text='Delete community'
                  variant='contained'
                  color='secondary'
                  onClick={handleDeleteCommunity}
                  disabled={community?.name !== communityNameInput}
                />
              </div>
            </div>
          )}
        </div>
      </TcDialog>
    </div>
  );
}

export default TcCommunitySettings;
