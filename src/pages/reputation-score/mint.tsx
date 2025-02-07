import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';
import { OciClient, UserAttestation } from 'oci-js-sdk';
import { Abi } from 'viem';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { engagementContracts } from '@/lib/contracts/engagement/contracts';

import TcCommunityPlatformIcon from '@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon';
import SEO from '@/components/global/SEO';
import TcBoxContainer from '@/components/shared/TcBox/TcBoxContainer';
import TcBreadcrumbs from '@/components/shared/TcBreadcrumbs';
import TcIconWithTooltip from '@/components/shared/TcIconWithTooltip';

import useAppStore from '@/store/useStore';

import { conf } from '@/configs';
import { useSnackbar } from '@/context/SnackbarContext';
import { capitalizeFirstLetter } from '@/helpers/helper';
import { defaultLayout } from '@/layouts/defaultLayout';
import { withRoles } from '@/utils/withRoles';

interface AttestationSectionProps {
  isConnected: boolean;
  isLoading: boolean;
  userProfile: UserAttestation[];
}

interface MintSectionProps {
  isLoading: boolean;
  engagementContract: any;
}

interface UserProfileBoxProps {
  profile: UserAttestation;
}

function Mint() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserAttestation[]>([]);

  const { isConnected, address, chainId } = useAccount();

  const engagementContract = engagementContracts.find(
    (contract) => contract.chainId === chainId
  );

  const fetchUserAttestations = useCallback(async () => {
    try {
      if (!isConnected) throw new Error('User is not connected');
      if (!address) throw new Error('User address is not available');
      if (!conf.APP_DEVELOPER_PUBLIC_ADDRESS)
        throw new Error('App developer address is not available');
      setLoading(true);

      const ociClient = new OciClient({ chainId: chainId as number });
      const result = await ociClient.getUserProfileWithAppPermissions(
        address,
        conf.APP_DEVELOPER_PUBLIC_ADDRESS as `0x${string}`
      );

      setUserProfile(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user attestations:', error);
      setUserProfile([]);
      setLoading(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserAttestations();
    }
  }, [fetchUserAttestations, address, isConnected]);

  return (
    <>
      <SEO titleTemplate='Mint Reputation Score' />
      <div className='container flex flex-col space-y-3 px-4 py-4 md:px-12'>
        <TcBreadcrumbs
          items={[
            { label: 'Reputation Score', path: '/reputation-score' },
            { label: 'Mint', path: '/Mint' },
          ]}
        />
        <TcBoxContainer contentContainerChildren={<ConnectWalletSection />} />

        <div className='relative space-y-3'>
          <div className='relative'>
            {!isConnected && (
              <Stack className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm'>
                <Alert severity='warning'>
                  <Typography variant='body2'>
                    Please connect your wallet to view this section.
                  </Typography>
                </Alert>
              </Stack>
            )}
            <TcBoxContainer
              contentContainerChildren={
                <AttestationSection
                  isConnected={isConnected}
                  isLoading={loading}
                  userProfile={userProfile}
                />
              }
            />
          </div>

          <div className='relative'>
            {(!isConnected || (!loading && userProfile.length === 0)) && (
              <Stack className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm'>
                <Alert severity='warning'>
                  <Typography variant='body2'>
                    {isConnected
                      ? 'Please ensure you have connected identifiers to mint your reputation score.'
                      : 'Please connect your wallet to mint your reputation score.'}
                  </Typography>
                </Alert>
              </Stack>
            )}
            <TcBoxContainer
              contentContainerChildren={
                <MintSection
                  isLoading={loading}
                  engagementContract={engagementContract}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

const ConnectWalletSection: React.FC = () => (
  <Stack className='space-y-4'>
    <Stack className='space-y-2 px-4 pb-[1rem] pt-4 md:px-10'>
      <Typography variant='h6'>Connect Your Wallet</Typography>
      <Typography variant='body2'>
        To mint your reputation score, please connect your wallet.
      </Typography>
      <Stack className='flex w-full flex-row justify-end'>
        <ConnectButton />
      </Stack>
    </Stack>
  </Stack>
);

const AttestationSection: React.FC<AttestationSectionProps> = ({
  isConnected,
  isLoading,
  userProfile,
}) => {
  const handleNavigation = () => {
    const url = 'https://app.logid.xyz/permissions';
    window.open(url, '_blank');
  };
  return (
    <Stack className='space-y-4'>
      <Stack className='space-y-2 px-4 pb-[1rem] pt-4 md:px-10'>
        <Typography variant='h6'>
          Verify your identity across platforms
        </Typography>
        <Typography variant='body2'>
          We use secure onchain verification through the LogID platform created
          by TogetherCrew. LogID enables you to verify your ID, create a privacy
          preserving proof (encrypted), and manage which applications can see
          your credentials by decrypting the data.
        </Typography>
        {isConnected && (
          <Stack
            display='flex'
            flexDirection='row'
            alignItems='center'
            spacing={2}
            className='space-x-3'
          >
            {isLoading ? (
              <Box
                width={200}
                height={140}
                mx='auto'
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <CircularProgress size={44} />
              </Box>
            ) : (
              <>
                {userProfile.length > 0 ? (
                  userProfile.map((profile, index) => (
                    <UserProfileBox key={index} profile={profile} />
                  ))
                ) : (
                  <Stack className='w-full space-y-3'>
                    <Alert severity='error'>
                      <AlertTitle>No Attestations Found</AlertTitle>
                      <Typography variant='body2'>
                        To mind your reputation score, please connect at least
                        one account and verify ownership.
                      </Typography>
                    </Alert>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleNavigation}
                    >
                      Register and grant permission
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

const MintSection: React.FC<MintSectionProps> = ({
  isLoading,
  engagementContract,
}) => {
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const { address } = useAccount();
  const { dynamicNFTModuleInfo } = useAppStore();
  const { data: hasMinted, refetch } = useReadContract({
    address: engagementContract?.address as `0x${string}`,
    abi: engagementContract?.abi as Abi,
    functionName: 'balanceOf',
    args: [address, dynamicNFTModuleInfo?.metadata[0]?.tokenId],
  });

  const {
    data: transactionHash,
    writeContractAsync,
    isPending,
  } = useWriteContract();

  const handleMintNFT = async () => {
    try {
      await writeContractAsync({
        address: engagementContract?.address as `0x${string}`,
        abi: engagementContract?.abi as Abi,
        functionName: 'mint',
        args: [address, dynamicNFTModuleInfo.metadata[0].tokenId, 1, '0x0'],
      });
    } catch (error: any) {
      console.error('Mint failed:', error);
    }
  };

  const {
    data: receipt,
    isSuccess,
    isError,
    isFetching: isWaitingForReceiptConfirmation,
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  useEffect(() => {
    if (receipt && isSuccess) {
      showMessage(
        'Your Reputation NFT has been successfully minted!',
        'success'
      );

      refetch();
    }
  }, [receipt, isSuccess, isError]);

  return (
    <Stack className='space-y-4'>
      <Stack className='space-y-2 px-4 pb-[1rem] pt-4 md:px-10'>
        <Typography variant='h6'>Mint Your Reputation Score</Typography>
        <Typography variant='body2'>
          Mint your reputation score to gain access to exclusive features and
          benefits.
        </Typography>
        {isLoading ? (
          <Box
            width={200}
            height={140}
            mx='auto'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <CircularProgress size={44} />
          </Box>
        ) : typeof hasMinted === 'bigint' && hasMinted > BigInt(0) ? (
          <>
            <Alert severity='success'>
              <AlertTitle>Reputation Score Minted</AlertTitle>
              <Typography variant='body2'>
                You have already minted your reputation score.
              </Typography>
            </Alert>
            <Stack className='flex flex-row justify-between space-x-3'>
              <Button
                fullWidth
                variant='outlined'
                onClick={() => router.push('/reputation-score')}
              >
                Back to Reputation Score
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={() =>
                  router.push(
                    `/reputation-score/score?tokenId=${dynamicNFTModuleInfo?.metadata[0]?.tokenId}&address=${address}`
                  )
                }
              >
                Show Daily Score
              </Button>
            </Stack>
          </>
        ) : (
          <Button
            variant='contained'
            color='primary'
            onClick={handleMintNFT}
            disabled={
              isPending ||
              isWaitingForReceiptConfirmation ||
              !dynamicNFTModuleInfo?.metadata[0]?.tokenId
            }
          >
            {isPending || isWaitingForReceiptConfirmation
              ? 'Minting...'
              : 'Mint Reputation Score'}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

const UserProfileBox: React.FC<UserProfileBoxProps> = ({ profile }) => {
  const router = useRouter();

  const handleNavigation = () => {
    const url = 'https://app.logid.xyz/permissions';
    router.push(url);
  };

  return (
    <Box
      mt={2}
      boxShadow={1}
      borderRadius={2}
      p={2}
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      width={200}
      height={140}
    >
      <TcCommunityPlatformIcon
        platform={capitalizeFirstLetter(profile.provider)}
      />
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='center'
        spacing={1}
        mt={1}
      >
        <Typography variant='h6' align='center'>
          {capitalizeFirstLetter(profile.provider)}
        </Typography>
        <TcIconWithTooltip tooltipText={profile.attestationId} />
      </Stack>
      <Button
        variant={profile.hasAccess ? 'outlined' : 'contained'}
        fullWidth
        color={profile.hasAccess ? 'secondary' : 'primary'}
        onClick={handleNavigation}
      >
        {profile.hasAccess ? 'Revoke' : 'Grant Access'}
      </Button>
    </Box>
  );
};

Mint.pageLayout = defaultLayout;

export default withRoles(Mint, ['view', 'admin']);
