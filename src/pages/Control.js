import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Card, CardContent, 
  Grid, Tabs, Tab, Button, Paper
} from '@mui/material';
import useContract from '../Components/Control/useContract';
import DepositWithdrawTab from '../Components/Control/DepositWithdrawTab';
import ManagePoolsTab from '../Components/Control/ManagePoolsTab';
import AdminFunctionsTab from '../Components/Control/AdminFunctionsTab';
import PoolInfoTab from '../Components/Control/PoolInfoTab';

const MasterChefInterface = () => {
  const { contract, account, pools, fetchPoolLength, fetchBonePerBlock, fetchDevAddress } = useContract();
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Define the owner's address
  const ownerAddress = "0x3D041510f58665a17D722EE2BC73Ae409BB8715b";

  useEffect(() => {
    if (contract) {
      fetchPoolLength();
      fetchBonePerBlock();
      fetchDevAddress();
    }
  }, [contract, fetchPoolLength, fetchBonePerBlock, fetchDevAddress]);

  // Check if the connected account is the owner
  const isOwner = account.toLowerCase() === ownerAddress.toLowerCase();

  if (!isOwner) {
    return (
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" component="div" gutterBottom color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You do not have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please connect with the authorized account.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()} 
            sx={{ mt: 3, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
          >
            Reload
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            MasterChef Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Connected Account: {account}
          </Typography>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Deposit/Withdraw" />
            <Tab label="Manage Pools" />
            <Tab label="Admin Functions" />
            <Tab label="Pool Info" />
          </Tabs>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {selectedTab === 0 && <DepositWithdrawTab contract={contract} account={account} pools={pools} />}
            {selectedTab === 1 && <ManagePoolsTab contract={contract} fetchPoolLength={fetchPoolLength} />}
            {selectedTab === 2 && <AdminFunctionsTab contract={contract} fetchDevAddress={fetchDevAddress} />}
            {selectedTab === 3 && <PoolInfoTab pools={pools} />}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MasterChefInterface;
