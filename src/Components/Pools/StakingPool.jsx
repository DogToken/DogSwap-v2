import React, { useState } from 'react';
import { Button, Typography, CircularProgress, TextField, Card } from '@mui/material';
import { styled } from '@mui/system';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner } from '../../utils/ethereumFunctions';
import boneTokenABI from '../../build/BoneToken.json';
import masterChefABI from '../../build/MasterChef.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

// Styled components
const Root = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  maxWidth: '250px', // Adjusted max width
  margin: 'auto',
}));

const ActionsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ButtonRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

const StakingPool = ({ pool }) => {
  const { MASTER_CHEF_ADDRESS, poolId, lpTokenAddress } = pool;
  
  const [loading, setLoading] = useState(false);
  const [stakingAmount, setStakingAmount] = useState('');
  const [claimMessage, setClaimMessage] = useState('');

  const handleStakeTokens = async () => {
    try {
      setLoading(true);
      const amountToStake = ethers.utils.parseUnits(stakingAmount, 18);

      if (amountToStake.lte(0)) {
        throw new Error('Please enter a valid amount to stake.');
      }

      const provider = getProvider();
      const signer = getSigner(provider);
      const lpTokenContract = new Contract(lpTokenAddress, boneTokenABI, signer);

      const approveTx = await lpTokenContract.approve(MASTER_CHEF_ADDRESS, amountToStake);
      await approveTx.wait();

      const masterChefContract = new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
      const transaction = await masterChefContract.deposit(poolId, amountToStake, { value: 0 });
      await transaction.wait();

      setClaimMessage('Tokens staked successfully!');
    } catch (error) {
      console.error('Error staking tokens:', error);
      setClaimMessage('Failed to stake tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawTokens = async () => {
    try {
      setLoading(true);
      const amountToWithdraw = ethers.utils.parseUnits(stakingAmount, 18);

      if (amountToWithdraw.lte(0)) {
        throw new Error('Please enter a valid amount to withdraw.');
      }

      const provider = getProvider();
      const signer = getSigner(provider);

      const masterChefContract = new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
      const transaction = await masterChefContract.withdraw(poolId, amountToWithdraw);
      await transaction.wait();

      setClaimMessage('Tokens withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setClaimMessage('Failed to withdraw tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <TextField
        label="Amount"
        variant="outlined"
        size="small"
        margin="dense"
        value={stakingAmount}
        onChange={(e) => setStakingAmount(e.target.value)}
        fullWidth
      />
      <ActionsContainer>
        <ButtonRow>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStakeTokens}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <FontAwesomeIcon icon={faArrowUp} />}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleWithdrawTokens}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <FontAwesomeIcon icon={faArrowDown} />}
          </Button>
        </ButtonRow>
      </ActionsContainer>
      {claimMessage && (
        <Typography variant="body2" color="textPrimary" sx={{ marginTop: 2 }}>
          {claimMessage}
        </Typography>
      )}
    </Root>
  );
};

export default StakingPool;
