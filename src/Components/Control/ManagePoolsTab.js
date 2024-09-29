import React, { useState } from 'react';
import { 
  Button, TextField, Typography, 
  Grid
} from '@mui/material';

const ManagePoolsTab = ({ contract, fetchPoolLength }) => {
  const [newPoolData, setNewPoolData] = useState({
    allocPoint: '',
    lpToken: '',
    depositFeeBP: '',
    withUpdate: true
  });
  const [editPoolData, setEditPoolData] = useState({
    pid: '',
    allocPoint: '',
    depositFeeBP: '',
    withUpdate: true
  });

  const handleAddPool = async () => {
    if (contract && newPoolData.allocPoint && newPoolData.lpToken) {
      try {
        const tx = await contract.add(
          newPoolData.allocPoint,
          newPoolData.depositFeeBP,
          newPoolData.lpToken,
          newPoolData.withUpdate
        );
        await tx.wait();
        console.log('Pool added successfully');
        fetchPoolLength();
      } catch (error) {
        console.error('Error adding pool:', error);
      }
    }
  };

  const handleSetPool = async () => {
    if (contract && editPoolData.pid && editPoolData.allocPoint) {
      try {
        const tx = await contract.set(
          editPoolData.pid,
          editPoolData.allocPoint,
          editPoolData.depositFeeBP,
          editPoolData.withUpdate
        );
        await tx.wait();
        console.log('Pool updated successfully');
        fetchPoolLength();
      } catch (error) {
        console.error('Error updating pool:', error);
      }
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Add New Pool</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="LP Token Address"
          value={newPoolData.lpToken}
          onChange={(e) => setNewPoolData({...newPoolData, lpToken: e.target.value})}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Allocation Points"
          type="number"
          value={newPoolData.allocPoint}
          onChange={(e) => setNewPoolData({...newPoolData, allocPoint: e.target.value})}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Deposit Fee"
          value={newPoolData.depositFeeBP}
          onChange={(e) => setNewPoolData({...newPoolData, depositFeeBP: e.target.value})}
        />
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="primary" onClick={handleAddPool}>
          Add Pool
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Edit Existing Pool</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Pool ID"
          type="number"
          value={editPoolData.pid}
          onChange={(e) => setEditPoolData({...editPoolData, pid: e.target.value})}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Allocation Points"
          type="number"
          value={editPoolData.allocPoint}
          onChange={(e) => setEditPoolData({...editPoolData, allocPoint: e.target.value})}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Deposit Fee"
          type="number"
          value={editPoolData.depositFeeBP}
          onChange={(e) => setEditPoolData({...editPoolData, depositFeeBP: e.target.value})}
        />
      </Grid>
      <Grid item xs={6}>
        <Button fullWidth variant="contained" color="primary" onClick={handleSetPool}>
          Update Pool
        </Button>
      </Grid>
    </>
  );
};

export default ManagePoolsTab;