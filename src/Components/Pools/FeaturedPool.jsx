import React, { useState, useEffect } from 'react';
import { Button, Typography, CircularProgress, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner } from '../../utils/ethereumFunctions';
import boneTokenABI from "../../assets/abi/IERC20.json";
import masterChefABI from '../../assets/abi/MasterChef.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faGift } from '@fortawesome/free-solid-svg-icons';

// Styled components
const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ActionsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%', // Use full width
}));

const TokenField = styled(TextField)(({ theme }) => ({
  flexGrow: 1, // Allow to grow and fill space
  marginRight: theme.spacing(1),
  minWidth: '300px', // Minimum width
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  height: '56px', // Consistent height
  padding: theme.spacing(1, 2),
  minWidth: '120px', // Minimum width for buttons
}));

const StakingPool = ({ pool }) => {
  const { MASTER_CHEF_ADDRESS, poolId, lpTokenAddress } = pool;

  const [loading, setLoading] = useState(false);
  const [stakingAmount, setStakingAmount] = useState('');
  const [claimMessage, setClaimMessage] = useState('');
  const [maxBalance, setMaxBalance] = useState('0');

  useEffect(() => {
    const fetchMaxBalance = async () => {
      try {
        const provider = getProvider();
        const signer = getSigner(provider);
        const lpTokenContract = new Contract(lpTokenAddress, boneTokenABI, signer);
        const balance = await lpTokenContract.balanceOf(signer.getAddress());
        setMaxBalance(ethers.utils.formatUnits(balance, 18));
      } catch (error) {
        console.error('Error fetching max balance:', error);
      }
    };

    fetchMaxBalance();
  }, [lpTokenAddress]);

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

  const handleClaimRewards = async () => {
    try {
      setLoading(true);

      const provider = getProvider();
      const signer = getSigner(provider);

      const masterChefContract = new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
      const transaction = await masterChefContract.deposit(poolId, 0);  // 0 tokens deposited to claim rewards
      await transaction.wait();

      setClaimMessage('Rewards claimed successfully!');
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setClaimMessage('Failed to claim rewards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setStakingAmount(maxBalance);
  };

  return (
    <Root>
      <ActionsContainer>
        <TokenField
          label="Amount"
          variant="outlined"
          size="medium"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
          fullWidth
        />
        <ButtonStyled variant="outlined" onClick={handleMaxClick}>
          Max
        </ButtonStyled>
        <ButtonStyled
          variant="contained"
          color="primary"
          onClick={handleStakeTokens}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : <><FontAwesomeIcon icon={faArrowUp} /> Stake</>}
        </ButtonStyled>
        <ButtonStyled
          variant="outlined"
          color="secondary"
          onClick={handleWithdrawTokens}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : <><FontAwesomeIcon icon={faArrowDown} /> Withdraw</>}
        </ButtonStyled>
        <ButtonStyled
          variant="contained"
          color="success"
          onClick={handleClaimRewards}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : <><FontAwesomeIcon icon={faGift} /> Claim</>}
        </ButtonStyled>
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
