import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type items = {
  name: string;
  path: string;
  icon: any;
};

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUserGroup, faHeartPulse } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { Drawer } from '@mui/material';

import { FaBars } from 'react-icons/fa';
import { MdKeyboardBackspace, MdOutlineAnnouncement } from 'react-icons/md';
import { conf } from '../../../configs';
import { FiSettings } from 'react-icons/fi';
import { useToken } from '../../../context/TokenContext';
import { ICommunityDiscordPlatfromProps } from '../../../utils/interfaces';
import TcText from '../../shared/TcText';

const Sidebar = () => {
  const router = useRouter();
  const currentRoute = router.pathname;

  const { community } = useToken();

  const [connectedPlatform, setConnectedPlatform] =
    useState<ICommunityDiscordPlatfromProps | null>(null);

  useEffect(() => {
    const storedCommunity = community;

    if (storedCommunity?.platforms) {
      const foundPlatform = storedCommunity.platforms.find(
        (platform) => platform.disconnectedAt === null
      );

      setConnectedPlatform(foundPlatform ?? null);
    }
  }, [community]);

  const menuItems: items[] = [
    {
      name: 'Community Insights',
      path: '/',
      icon: (
        <FontAwesomeIcon
          icon={faUserGroup}
          style={{ fontSize: 30, color: 'black' }}
        />
      ),
    },
    {
      name: 'Community Health',
      path: '/community-health',
      icon: (
        <FontAwesomeIcon
          icon={faHeartPulse}
          style={{ fontSize: 30, color: 'black' }}
        />
      ),
    },
    {
      name: 'Smart Announcements',
      path: '/announcements',
      icon: (
        <MdOutlineAnnouncement
          style={{ fontSize: 30, color: 'black', margin: '0 auto' }}
        />
      ),
    },
    {
      name: 'Community Settings',
      path: '/community-settings',
      icon: (
        <FiSettings
          style={{ fontSize: 30, color: 'black', margin: '0 auto' }}
        />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItem = menuItems.map((el) => (
    <li key={el.name} className='py-4'>
      <Link href={el.path} onClick={() => setOpen(false)}>
        <div
          className={
            currentRoute === el.path
              ? 'mx-auto w-1/2 cursor-pointer rounded-xl bg-white py-2 text-center delay-75 ease-in hover:bg-white'
              : 'mx-auto w-1/2 cursor-pointer rounded-xl py-2 text-center delay-75 ease-in hover:bg-white'
          }
        >
          {el.icon}
        </div>
        <p className='text-center text-lg'>{el.name}</p>
      </Link>
    </li>
  ));

  return (
    <>
      <div className='sticky top-0 z-50 flex flex-row items-center justify-between bg-gray-background py-4 px-5 md:hidden'>
        <div className='flex flex-row'>
          <div className='flex flex-row items-center space-x-3 text-center'>
            <div className='mb-2 mr-3 h-8 w-8'>
              <div className='mx-auto h-10 w-10'>
                {connectedPlatform &&
                connectedPlatform.metadata &&
                connectedPlatform.metadata.icon ? (
                  <Image
                    src={`${conf.DISCORD_CDN}icons/${connectedPlatform.metadata.id}/${connectedPlatform.metadata.icon}`}
                    width='100'
                    height='100'
                    alt={
                      connectedPlatform.metadata.name
                        ? connectedPlatform.metadata.name
                        : ''
                    }
                    className='rounded-full'
                  />
                ) : (
                  <div className='align-center flex h-10 w-10 flex-col justify-center rounded-full bg-secondary text-center text-xs' />
                )}
              </div>
            </div>
            <TcText text={community?.name} variant='h6' />
          </div>
        </div>
        <FaBars size={30} onClick={handleDrawerOpen} />
      </div>
      <Drawer
        variant='persistent'
        anchor='right'
        sx={{
          '& .MuiPaper-root': {
            width: '100%',
          },
        }}
        open={open}
      >
        <div className='h-screen bg-gray-background p-3'>
          <MdKeyboardBackspace size={30} onClick={handleDrawerClose} />
          <nav>
            <ul className='flex flex-col px-3'>{menuItem}</ul>
          </nav>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
