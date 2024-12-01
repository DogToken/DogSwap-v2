import React, { useState, useEffect } from 'react';
import { 
  Button, Typography, CircularProgress, TextField, Box, 
  Dialog, DialogActions, DialogContent, DialogTitle, 
  Tooltip, InputAdornment
} from '@mui/material';
import { styled } from '@mui/system';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner } from '../../utils/ethereumFunctions';
import boneTokenABI from "./../../assets/abi/IERC20.json";
import masterChefABI from './../../assets/abi/MasterChef.json';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RedeemIcon from '@mui/icons-material/Redeem';

// Styled components
const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: '40px',
  padding: theme.spacing(0.5),
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const MaxButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  minWidth: '60px',
}));

const StakingPool = ({ pool }) => {
  const { MASTER_CHEF_ADDRESS, poolId, lpTokenAddress } = pool;
  
  const [loading, setLoading] = useState(false);
  const [stakingAmount, setStakingAmount] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState('');
  const [message, setMessage] = useState('');
  const [maxAmount, setMaxAmount] = useState('0');

  useEffect(() => {
    if (dialogOpen) {
      fetchMaxAmount();
    }
  }, [dialogOpen, action]);

  const fetchMaxAmount = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const lpTokenContract = new Contract(lpTokenAddress, boneTokenABI, signer);
      const masterChefContract = new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);

      let amount;
      if (action === 'stake') {
        amount = await lpTokenContract.balanceOf(signer.getAddress());
      } else if (action === 'withdraw') {
        const userInfo = await masterChefContract.userInfo(poolId, signer.getAddress());
        amount = userInfo.amount;
      } else {
        amount = ethers.constants.Zero;
      }

      setMaxAmount(ethers.utils.formatUnits(amount, 18));
    } catch (error) {
      console.error('Error fetching max amount:', error);
      setMaxAmount('0');
    }
  };

  const handleOpenDialog = (actionType) => {
    if (actionType !== 'claim') {
      setAction(actionType);
      setDialogOpen(true);
      setStakingAmount('');
      setMessage('');
    } else {
      handleClaimRewards();
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setStakingAmount('');
    setMessage('');
  };

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

      setMessage('Tokens staked successfully!');
    } catch (error) {
      console.error('Error staking tokens:', error);
      setMessage('Failed to stake tokens. Please try again later.');
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

      setMessage('Tokens withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setMessage('Failed to withdraw tokens. Please try again later.');
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

      setMessage('Rewards claimed successfully!');
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setMessage('Failed to claim rewards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    switch(action) {
      case 'stake':
        handleStakeTokens();
        break;
      case 'withdraw':
        handleWithdrawTokens();
        break;
      default:
        break;
    }
  };

  const handleMaxClick = () => {
    setStakingAmount(maxAmount);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tooltip title="Stake Tokens">
          <ActionButton
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog('stake')}
            disabled={loading}
          >
            <ArrowUpwardIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Withdraw Tokens">
          <ActionButton
            variant="outlined"
            color="secondary"
            onClick={() => handleOpenDialog('withdraw')}
            disabled={loading}
          >
            <ArrowDownwardIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Claim Rewards">
          <ActionButton
            variant="contained"
            color="success"
            onClick={handleClaimRewards}
            disabled={loading}
          >
            <RedeemIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
      </Box>

      <StyledDialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {action === 'stake' ? 'Stake Tokens' : 'Withdraw Tokens'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={stakingAmount}
            onChange={(e) => setStakingAmount(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton
                    variant="outlined"
                    size="small"
                    onClick={handleMaxClick}
                  >
                    Max
                  </MaxButton>
                </InputAdornment>
              ),
            }}
          />
          {message && (
            <Typography color={message.includes('success') ? 'success.main' : 'error.main'} variant="body2" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default StakingPool;
