import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { ethers } from 'ethers';
import masterChefABI from '../../assets/abi/MasterChef.json';

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const CollectAllRewardsButton = ({ pools, updateBalances }) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collectionStatus, setCollectionStatus] = useState([]);

  const collectAllRewards = async () => {
    setIsCollecting(true);
    setCollectionStatus([]); // Reset status for visual indication

    try {
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let successCount = 0;

      for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        if (parseFloat(pool.pendingBone) > 0) {
          const masterChefContract = new ethers.Contract(pool.MASTER_CHEF_ADDRESS, masterChefABI, signer);

          try {
            const tx = await masterChefContract.withdraw(pool.poolId, 0); // Withdraw 0 tokens to collect rewards

            await tx.wait(); // Wait for the transaction to be confirmed
            successCount++;
            setCollectionStatus(prev => [...prev, { poolId: pool.poolId, status: 'success' }]);
            console.log(`Rewards collected for pool ${pool.poolId}`);
          } catch (err) {
            console.error(`Failed to collect rewards for pool ${pool.poolId}:`, err);
            setCollectionStatus(prev => [...prev, { poolId: pool.poolId, status: 'failure' }]);
          }
        } else {
          setCollectionStatus(prev => [...prev, { poolId: pool.poolId, status: 'no rewards' }]);
        }
        
        // Update progress percentage
        setProgress(Math.round(((i + 1) / pools.length) * 100));
      }

      if (successCount > 0) {
        // If at least one pool's rewards were collected, update balances
        if (updateBalances) {
          await updateBalances(); // Call external function to refresh balances
        }
      }

      alert('All reward collection processes completed!');
    } catch (error) {
      console.error('Error collecting rewards:', error);
      alert(`Failed to collect rewards: ${error.message}`);
    } finally {
      setIsCollecting(false);
      setProgress(0); // Reset progress after completion
    }
  };

  // Visual indication: Progress bar and status for each pool
  const renderCollectionStatus = () => {
    return collectionStatus.map((status, index) => (
      <Typography key={index} variant="body2" color={status.status === 'success' ? 'green' : status.status === 'failure' ? 'red' : 'gray'}>
        {`Pool ${status.poolId}: ${status.status === 'success' ? 'Rewards Collected' : status.status === 'failure' ? 'Failed' : 'No Rewards'}`}
      </Typography>
    ));
  };

  return (
    <div>
      <StyledButton
        variant="contained"
        onClick={collectAllRewards}
        disabled={isCollecting}
        startIcon={isCollecting ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isCollecting ? 'Collecting Rewards...' : 'Collect All Rewards'}
      </StyledButton>

      {/* Progress Bar for Visual Feedback */}
      {isCollecting && <LinearProgress variant="determinate" value={progress} />}

      {/* Display collection status for each pool */}
      <div>{renderCollectionStatus()}</div>
    </div>
  );
};

export default CollectAllRewardsButton;
