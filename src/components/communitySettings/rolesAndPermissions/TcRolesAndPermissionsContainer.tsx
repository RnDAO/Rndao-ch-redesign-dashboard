import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

import TcRolesAutoComplete from '../../announcements/create/privateMessaageContainer/TcRolesAutoComplete';
import TcUsersAutoComplete from '../../announcements/create/privateMessaageContainer/TcUsersAutoComplete';
import TcButton from '../../shared/TcButton';
import TcText from '../../shared/TcText';
import { useToken } from '../../../context/TokenContext';
import useAppStore from '../../../store/useStore';
import { IRoles, IUser } from '../../../utils/interfaces';
import { toast } from 'react-toastify';
import { useSnackbar } from '../../../context/SnackbarContext';

interface IPermissionsPayload {
  roleType: 'view' | 'admin';
  source: {
    platform: 'discord';
    identifierType: 'role' | 'member';
    identifierValues: string[];
    platformId: string;
  };
}

function TcRolesAndPermissionsContainer() {
  const { showMessage } = useSnackbar();
  const { patchCommunityById, retrieveCommunityById } = useAppStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { community } = useToken();

  const [adminByRole, setAdminByRole] = useState<IRoles[]>([]);
  const [adminByMember, setAdminByMember] = useState<IUser[]>([]);

  const [viewerByRole, setViewerByRole] = useState<IRoles[]>([]);
  const [viewerByMember, setViewerByMember] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchAndUpdateCommunity = async () => {
      const { roles } = await retrieveCommunityById(community?.id as string);

      const adminRoleIds = roles
        .filter(
          (role: IPermissionsPayload) =>
            role.roleType === 'admin' && role.source.identifierType === 'role'
        )
        .map(
          (filteredRole: IPermissionsPayload) =>
            filteredRole.source.identifierValues
        )
        .flat();

      const adminMemberIds = roles
        .filter(
          (role: IPermissionsPayload) =>
            role.roleType === 'admin' && role.source.identifierType === 'member'
        )
        .map(
          (filteredRole: IPermissionsPayload) =>
            filteredRole.source.identifierValues
        )
        .flat();

      const viewerRoleIds = roles
        .filter(
          (role: IPermissionsPayload) =>
            role.roleType === 'view' && role.source.identifierType === 'role'
        )
        .map(
          (filteredRole: IPermissionsPayload) =>
            filteredRole.source.identifierValues
        )
        .flat();

      const viewerMemberIds = roles
        .filter(
          (role: IPermissionsPayload) =>
            role.roleType === 'view' && role.source.identifierType === 'member'
        )
        .map(
          (filteredRole: IPermissionsPayload) =>
            filteredRole.source.identifierValues
        )
        .flat();
    };
    fetchAndUpdateCommunity();
  }, []);

  const createPermissionPayload = (
    roleType: 'admin' | 'view',
    identifierType: 'member' | 'role',
    identifiers: string[]
  ): IPermissionsPayload => ({
    roleType,
    source: {
      platform: 'discord',
      identifierType,
      identifierValues: identifiers,
      platformId: community?.platforms[0].id as string,
    },
  });

  const handlePermissionsChange = async () => {
    const adminMemberDiscordIds = adminByMember.map(
      (member) => member.discordId
    );
    const adminRoleRoleIds = adminByRole.map((role) => role.roleId);
    const viewMemberDiscordIds = viewerByMember.map(
      (member) => member.discordId
    );
    const viewRoleRoleIds = viewerByRole.map((role) => role.roleId);

    const permissionsPayload = [
      ...(adminRoleRoleIds.length > 0
        ? [createPermissionPayload('admin', 'role', adminRoleRoleIds)]
        : []),
      ...(adminMemberDiscordIds.length > 0
        ? [createPermissionPayload('admin', 'member', adminMemberDiscordIds)]
        : []),
      ...(viewRoleRoleIds.length > 0
        ? [createPermissionPayload('view', 'role', viewRoleRoleIds)]
        : []),
      ...(viewMemberDiscordIds.length > 0
        ? [createPermissionPayload('view', 'member', viewMemberDiscordIds)]
        : []),
    ];

    try {
      setIsLoading(true);
      await patchCommunityById({
        communityId: community?.id as string,
        roles: permissionsPayload,
      });
      showMessage('Permissions updated successfully!', 'success');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='flex w-full flex-col justify-between space-y-3 md:flex-row md:items-center md:space-y-0'>
        <div className='space-y-1.5 md:space-y-0'>
          <TcText text='Roles & Permissions' variant='h6' />
          <TcText
            text='Configure the following for Admins vs. Viewers'
            variant='body2'
            className='text-gray-400'
          />
        </div>
        <TcButton
          text={
            isLoading ? (
              <CircularProgress className='text-white' size={20} />
            ) : (
              'Save Changes'
            )
          }
          variant='contained'
          onClick={handlePermissionsChange}
          className='min-w-[10rem]'
        />
      </div>
      <div className='space-y-1.5 md:space-y-0'>
        <div className='py-1'>
          <TcText text='Admins' variant='subtitle1' />
          <TcText
            text='Admins have full access to the account. They can manage members, permissions and other settings of the account.'
            variant='body2'
            className='text-gray-400'
          />
        </div>
        <div className='py-1'>
          <TcText text='Add admin by:' variant='subtitle2' />
          <div className='flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-3 md:space-y-0'>
            <div className='md:w-1/2'>
              <TcUsersAutoComplete
                isEdit={true}
                privateSelectedUsers={adminByMember}
                handleSelectedUsers={(users) => setAdminByMember(users)}
              />
            </div>
            <div className='md:w-1/2'>
              <TcRolesAutoComplete
                isEdit={true}
                privateSelectedRoles={adminByRole}
                handleSelectedRoles={(roles) => setAdminByRole(roles)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='space-y-1.5 md:space-y-0'>
        <div className='py-1'>
          <TcText text='Viewers' variant='subtitle1' />
          <TcText
            text="Viewers can see all the metrics but don't have permission to change the settings."
            variant='body2'
            className='text-gray-400'
          />
        </div>
        <div className='py-1'>
          <TcText text='Add viewer by:' variant='subtitle2' />
          <div className='flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-3 md:space-y-0'>
            <div className='md:w-1/2'>
              <TcUsersAutoComplete
                isEdit={true}
                privateSelectedUsers={viewerByMember}
                handleSelectedUsers={(users) => setViewerByMember(users)}
              />
            </div>
            <div className='md:w-1/2'>
              <TcRolesAutoComplete
                isEdit={true}
                privateSelectedRoles={viewerByRole}
                handleSelectedRoles={(roles) => setViewerByRole(roles)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TcRolesAndPermissionsContainer;
