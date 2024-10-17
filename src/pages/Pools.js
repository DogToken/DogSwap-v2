import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Container, FormControlLabel, Switch, Alert, AlertTitle, CircularProgress, Tabs, Tab } from '@mui/material';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "../assets/abi/IERC20.json";
import masterChefABI from '../assets/abi/MasterChef.json';
import { poolData } from '../constants/poolData';
import { RootContainer, Header, TitleTypography, LoadingContainer, StyledTabs } from '../Components/Pools/StyledComponents';
import PoolsTable from '../Components/Pools/PoolsTable';
import CollectAllRewardsButton from '../Components/Pools/CollectAllRewardsButton';

const Pools = () => {
  const [poolsData, setPoolsData] = useState([]);
  const [hideInactive, setHideInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('fixed');

  useEffect(() => {
    fetchAllPoolsData();
  }, []);

  const fetchAllPoolsData = async () => {
    setIsLoading(true);
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
    
      const allPoolsData = await Promise.all(
        poolData.map(async (pool) => {
          const lpTokenContract = new Contract(pool.lpTokenAddress, boneTokenABI, provider);
          const masterChefContract = new Contract(pool.MASTER_CHEF_ADDRESS, masterChefABI, provider);
    
          const walletBalance = await lpTokenContract.balanceOf(signer.getAddress());
          const formattedWalletBalance = ethers.utils.formatUnits(walletBalance, 18);
    
          const userInfo = await masterChefContract.userInfo(pool.poolId, signer.getAddress());
          const formattedStakedAmount = ethers.utils.formatUnits(userInfo.amount, 18);
    
          const pendingRewards = await masterChefContract.pendingBone(pool.poolId, signer.getAddress());
          const formattedPendingRewards = ethers.utils.formatUnits(pendingRewards, 18);
    
          return {
            ...pool,
            walletBalance: parseFloat(formattedWalletBalance).toFixed(5),
            stakedLpTokens: parseFloat(formattedStakedAmount).toFixed(5),
            pendingBone: parseFloat(formattedPendingRewards).toFixed(5),
            isActive: pool.active === 'Yes',
          };
        })
      );
      setPoolsData(allPoolsData);
    } catch (error) {
      console.error("Error fetching pool data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClick = (action, label) => {
    ReactGA.event({
      category: 'User Interaction',
      action,
      label,
    });
  };

  const filteredPools = poolsData.filter(pool => (!hideInactive || pool.isActive) && pool.poolType.toLowerCase() === currentView);

  const handleChangeView = (event, newValue) => {
    setCurrentView(newValue);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <RootContainer maxWidth="lg">
      <Header>
        <TitleTypography variant="h4">Reward Pools</TitleTypography>
        <FormControlLabel
          control={
            <Switch
              checked={hideInactive}
              onChange={(e) => setHideInactive(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label="Hide Inactive Pools"
        />
      </Header>

      <StyledTabs value={currentView} onChange={handleChangeView} centered>
        <Tab label="Fixed Pools" value="fixed" />
        <Tab label="Community Pools" value="community" />
        <Tab label="Weekly Pools" value="weekly" />
      </StyledTabs>

      <CollectAllRewardsButton pools={poolsData} />

      {filteredPools.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Pools Available</AlertTitle>
          No {currentView} pools available at the moment. Please check back later or try a different pool type.
        </Alert>
      ) : (
        <PoolsTable
          pools={filteredPools}
          handleClick={handleClick}
        />
      )}
    </RootContainer>
  );
};

export default Pools;