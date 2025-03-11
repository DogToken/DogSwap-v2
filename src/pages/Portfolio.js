import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "../assets/abi/IERC20.json";
import masterChefABI from '../assets/abi/MasterChef.json';
import { poolData } from '../constants/weeklyPoolData';

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '2rem',
}));

const PortfolioTracker = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    setIsLoading(true);
    try {
      const provider = getProvider();
      const signer = getSigner(provider);

      const allPortfolioData = await Promise.all(
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
          };
        })
      );
      setPortfolioData(allPortfolioData);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      // You might want to set an error state here and display it to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RootContainer maxWidth="lg">
      <Header>
        <TitleTypography variant="h4">Portfolio Tracker</TitleTypography>
      </Header>
      <Grid container spacing={3}>
        {portfolioData.map((pool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">{pool.title}</Typography>
              <Typography variant="body2" color="textSecondary">{pool.subTitle}</Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">Wallet Balance:</Typography>
                <Typography variant="body2">{pool.walletBalance} LP</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">Staked Tokens:</Typography>
                <Typography variant="body2">{pool.stakedLpTokens} LP</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">Pending Rewards:</Typography>
                <Typography variant="body2">{pool.pendingBone} $BONE</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </RootContainer>
  );
};

export default PortfolioTracker;