import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Button, TextField, Typography, 
  Grid, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

const DepositWithdrawTab = ({ contract, account, pools }) => {
  const [poolId, setPoolId] = useState(0);
  const [amount, setAmount] = useState('');
  const [pendingBone, setPendingBone] = useState('0');

  const fetchPendingBone = async () => {
    if (contract && account) {
      try {
        const pending = await contract.pendingBone(poolId, account);
        setPendingBone(ethers.utils.formatEther(pending));
      } catch (error) {
        console.error('Error fetching pending BONE:', error);
      }
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchPendingBone();
      const interval = setInterval(fetchPendingBone, 30000);
      return () => clearInterval(interval);
    }
  }, [contract, account, poolId]);

  const handleDeposit = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.deposit(poolId, ethers.utils.parseEther(amount));
        await tx.wait();
        console.log('Deposit successful');
        fetchPendingBone();
      } catch (error) {
        console.error('Error depositing:', error);
      }
    }
  };

  const handleWithdraw = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.withdraw(poolId, ethers.utils.parseEther(amount));
        await tx.wait();
        console.log('Withdrawal successful');
        fetchPendingBone();
      } catch (error) {
        console.error('Error withdrawing:', error);
      }
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="pool-select-label">Pool ID</InputLabel>
          <Select
            labelId="pool-select-label"
            value={poolId}
            label="Pool ID"
            onChange={(e) => setPoolId(e.target.value)}
          >
            {pools.map((pool, index) => (
              <MenuItem key={index} value={index}>Pool {index}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="primary" onClick={handleDeposit}>
          Deposit
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="secondary" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Pending BONE: {pendingBone}
        </Typography>
      </Grid>
    </>
  );
};

export default DepositWithdrawTab;