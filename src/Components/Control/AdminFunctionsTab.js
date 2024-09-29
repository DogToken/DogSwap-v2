import React, { useState } from 'react';
import { 
  Button, TextField, Typography, 
  Grid
} from '@mui/material';

const AdminFunctionsTab = ({ contract, fetchDevAddress }) => {
  const [multiplierNumber, setMultiplierNumber] = useState('');
  const [devAddress, setDevAddress] = useState('');
  const [emissionPerBlock, setemissionPerBlock] = useState('');

  const handleUpdateMultiplier = async () => {
    if (contract && multiplierNumber) {
      try {
        const tx = await contract.updateMultiplier(multiplierNumber);
        await tx.wait();
        console.log('Multiplier updated successfully');
      } catch (error) {
        console.error('Error updating multiplier:', error);
      }
    }
  };

  const handleUpdateDevAddress = async () => {
    if (contract && devAddress) {
      try {
        const tx = await contract.dev(devAddress);
        await tx.wait();
        console.log('Dev address updated successfully');
        fetchDevAddress();
      } catch (error) {
        console.error('Error updating dev address:', error);
      }
    }
  };

  const handleUpdateEmissionPerBlock = async () => {
    if (contract && emissionPerBlock) {
      try {
        const tx = await contract.updateEmissionPerBlock(emissionPerBlock);
        await tx.wait();
        console.log('Emission updated successfully');
        fetchDevAddress();
      } catch (error) {
        console.error('Error updating Emission:', error);
      }
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Update Multiplier</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Multiplier"
          value={multiplierNumber}
          onChange={(e) => setMultiplierNumber(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="primary" onClick={handleUpdateMultiplier}>
          Update Multiplier
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Update Emission</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Emission"
          value={emissionPerBlock}
          onChange={(e) => setemissionPerBlock(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="primary" onClick={handleUpdateEmissionPerBlock}>
          Update Emission
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Update Dev Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Dev Address"
          value={devAddress}
          onChange={(e) => setDevAddress(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="primary" onClick={handleUpdateDevAddress}>
          Update Dev Address
        </Button>
      </Grid>
    </>
  );
};

export default AdminFunctionsTab;