import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiShare2 } from 'react-icons/fi';

import GaugeChart from '@/components/global/GaugeChart';
import SimpleBackdrop from '@/components/global/LoadingBackdrop';
import SEO from '@/components/global/SEO';
import TcBoxContainer from '@/components/shared/TcBox/TcBoxContainer';

import useAppStore from '@/store/useStore';

import { useSnackbar } from '@/context/SnackbarContext';

const ScorePage = () => {
  const { showMessage } = useSnackbar();
  const { retrieveReputationScore } = useAppStore();
  const router = useRouter();

  const [reputationScore, setReputationScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const parseUrl = () => {
      const pathSegments = router.asPath.split('/');
      const tokenIndex = pathSegments.indexOf('reputation-score') + 1;

      if (tokenIndex > 0 && tokenIndex + 1 < pathSegments.length) {
        setTokenId(pathSegments[tokenIndex]);
        setAddress(pathSegments[tokenIndex + 1]);
      }
    };

    parseUrl();
  }, [router.asPath]);

  useEffect(() => {
    if (tokenId && address) {
      const fetchReputationScore = async () => {
        setLoading(true);
        try {
          console.log('Fetching reputation score for:', { tokenId, address });

          const score = await retrieveReputationScore({
            tokenId,
            address,
          });

          console.log('Reputation Score Retrieved:', score);
          setReputationScore(score ?? 0);
        } catch (error) {
          console.error('Error fetching reputation score:', error);
          showMessage('Failed to load reputation score.', 'error');
        } finally {
          setLoading(false);
        }
      };

      fetchReputationScore();
    }
  }, [tokenId, address]);

  const gaugeOptions = {
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: {
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc',
      },
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.1, '#DF5353'],
        [0.5, '#DDDF0D'],
        [0.9, '#55BF3B'],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16,
        style: {
          fontSize: '14px',
        },
      },
    },
    series: [
      {
        name: 'Score',
        data: [reputationScore ?? 0],
        tooltip: {
          valueSuffix: ' /100',
        },
      },
    ],
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        showMessage('URL copied to clipboard.', 'success');
      })
      .catch(() => {
        showMessage('Failed to copy URL to clipboard.', 'error');
      });
  };

  if (loading) {
    return <SimpleBackdrop />;
  }

  return (
    <>
      <SEO titleTemplate='Daily Report Reputation Score' />

      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4'>
        <TcBoxContainer
          className='w-full max-w-xl rounded-lg border border-gray-200 bg-white shadow-lg'
          contentContainerChildren={
            <div className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Reputation Score</h1>
                <button
                  onClick={handleShare}
                  className='text-primary-600 rounded-full bg-primary-100 p-2 hover:bg-primary-200'
                  aria-label='Share Score'
                >
                  <FiShare2 size={24} />
                </button>
              </div>
              <p className='text-gray-600'>
                Your reputation score is calculated based on your activity in
                the community. A higher score indicates greater trustworthiness
                and active participation.
              </p>
            </div>
          }
        />

        <div className='mt-4 w-full max-w-xl overflow-hidden'>
          <TcBoxContainer
            className='rounded-lg border border-gray-200 bg-white shadow-lg'
            contentContainerChildren={
              <div className='flex flex-col items-center space-y-6 py-10'>
                <GaugeChart options={gaugeOptions} />
                <p className='text-center text-sm text-gray-500'>
                  Your score is dynamically calculated from platform activity.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default ScorePage;
