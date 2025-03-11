import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "../assets/abi/IERC20.json";
import masterChefABI from '../assets/abi/MasterChef.json';
import { poolData } from '../constants/weeklyPoolData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const SummaryBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
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

  const totalWalletBalance = portfolioData.reduce((acc, pool) => acc + parseFloat(pool.walletBalance), 0).toFixed(5);
  const totalStakedTokens = portfolioData.reduce((acc, pool) => acc + parseFloat(pool.stakedLpTokens), 0).toFixed(5);
  const totalPendingRewards = portfolioData.reduce((acc, pool) => acc + parseFloat(pool.pendingBone), 0).toFixed(5);

  const chartData = portfolioData.map(pool => ({
    name: pool.title,
    walletBalance: parseFloat(pool.walletBalance),
    stakedTokens: parseFloat(pool.stakedLpTokens),
    pendingRewards: parseFloat(pool.pendingBone),
  }));

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
        <Button variant="contained" color="primary" onClick={fetchPortfolioData}>Refresh</Button>
      </Header>
      <SummaryBox elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Wallet Balance</Typography>
            <Typography variant="body1">{totalWalletBalance} LP</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Staked Tokens</Typography>
            <Typography variant="body1">{totalStakedTokens} LP</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Pending Rewards</Typography>
            <Typography variant="body1">{totalPendingRewards} $BONE</Typography>
          </Grid>
        </Grid>
      </SummaryBox>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pool</TableCell>
              <TableCell align="right">Wallet Balance (LP)</TableCell>
              <TableCell align="right">Staked Tokens (LP)</TableCell>
              <TableCell align="right">Pending Rewards ($BONE)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolioData.map((pool, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">{pool.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{pool.subTitle}</Typography>
                </TableCell>
                <TableCell align="right">{pool.walletBalance}</TableCell>
                <TableCell align="right">{pool.stakedLpTokens}</TableCell>
                <TableCell align="right">{pool.pendingBone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Portfolio Distribution</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="walletBalance" fill="#8884d8" />
            <Bar dataKey="stakedTokens" fill="#82ca9d" />
            <Bar dataKey="pendingRewards" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </RootContainer>
  );
};

export default PortfolioTracker;