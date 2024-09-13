import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4'; // Import ReactGA for GA4 tracking
import { Container, Typography, Box, Avatar, Paper } from '@mui/material';
import { styled } from '@mui/system';
import StakingPool from './StakingPool';
import { poolData } from '../../constants/featuredPool';
import { getProvider, getSigner } from '../../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "../../assets/abi/IERC20.json";
import masterChefABI from '../../assets/abi/MasterChef.json';

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center content horizontally
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
  fontSize: '2rem', // Larger title font size
}));

const PoolContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[15],
  width: '100%',
  maxWidth: 800, // Constrain max width for better readability
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Center content horizontally
  marginBottom: theme.spacing(2),
}));

const TokenAvatar = styled(Avatar)(({ theme }) => ({
  width: 64, // Larger avatar size
  height: 64,
  margin: theme.spacing(1),
}));

const DetailsTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  fontSize: '1.25rem', // Larger font size for details
}));

const Featured = () => {
  const [poolDataItem, setPoolDataItem] = useState(null);

  useEffect(() => {
    fetchPoolData();
  }, []);

  const fetchPoolData = async () => {
    const provider = getProvider();
    const signer = getSigner(provider);

    // Fetching only the first pool as an example
    const pool = poolData[0];
    const lpTokenContract = new Contract(pool.lpTokenAddress, boneTokenABI, provider);
    const masterChefContract = new Contract(pool.MASTER_CHEF_ADDRESS, masterChefABI, provider);

    try {
      const walletBalance = await lpTokenContract.balanceOf(signer.getAddress());
      const formattedWalletBalance = ethers.utils.formatUnits(walletBalance, 18);

      const userInfo = await masterChefContract.userInfo(pool.poolId, signer.getAddress());
      const formattedStakedAmount = ethers.utils.formatUnits(userInfo.amount, 18);

      const pendingRewards = await masterChefContract.pendingBone(pool.poolId, signer.getAddress());
      const formattedPendingRewards = ethers.utils.formatUnits(pendingRewards, 18);

      setPoolDataItem({
        ...pool,
        walletBalance: parseFloat(formattedWalletBalance).toFixed(5),
        stakedLpTokens: parseFloat(formattedStakedAmount).toFixed(5),
        pendingBone: parseFloat(formattedPendingRewards).toFixed(5),
      });
    } catch (error) {
      console.error('Error fetching pool data:', error);
    }
  };

  const handleClick = (action, label) => {
    ReactGA.event({
      category: 'User Interaction',
      action,
      label,
    });
  };

  if (!poolDataItem) return <Typography variant="h6">Loading...</Typography>;

  return (
    <RootContainer maxWidth="lg">
      <TitleTypography variant="h3">Featured Pool</TitleTypography>
      <PoolContainer>
        <LogoContainer>
          <TokenAvatar src={poolDataItem.imageTokenA} alt="Token A" />
          <TokenAvatar src={poolDataItem.imageTokenB} alt="Token B" />
        </LogoContainer>
        <Typography variant="h5">{poolDataItem.title}</Typography>
        <Typography variant="body1" color="textSecondary">{poolDataItem.subTitle}</Typography>
        <DetailsTypography>Wallet Balance: {poolDataItem.walletBalance}</DetailsTypography>
        <DetailsTypography>Staked Tokens: {poolDataItem.stakedLpTokens}</DetailsTypography>
        <DetailsTypography>Pending Rewards: {poolDataItem.pendingBone} $BONE</DetailsTypography>
        <Box mt={2}>
          <StakingPool
            pool={poolDataItem}
            onClick={() => handleClick('Button Click', `Staking Pool - ${poolDataItem.title}`)}
          />
        </Box>
      </PoolContainer>
    </RootContainer>
  );
};

export default Featured;
