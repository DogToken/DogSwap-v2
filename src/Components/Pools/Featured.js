import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Container, Typography, Box, Avatar, Button } from '@mui/material';
import { styled } from '@mui/system';
import StakingPool from './FeaturedPool';
import { poolData } from '../../constants/featuredPool';
import { getProvider, getSigner } from '../../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "../../assets/abi/IERC20.json";
import masterChefABI from '../../assets/abi/MasterChef.json';

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'white', // Ensure the background is white
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
  fontSize: '2rem',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const TokenAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  margin: theme.spacing(1),
}));

const DetailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  margin: theme.spacing(2, 0),
}));

const DetailItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'transparent', // Remove background
  textAlign: 'center',
  flex: '1', // Equal flex for all items
  margin: theme.spacing(0, 1), // Add margin between items
}));

const DetailsTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
}));

const Featured = () => {
  const [poolDataItem, setPoolDataItem] = useState(null);

  useEffect(() => {
    fetchPoolData();
  }, []);

  const fetchPoolData = async () => {
    const provider = getProvider();
    const signer = getSigner(provider);
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
      <LogoContainer>
        <TokenAvatar src={poolDataItem.imageTokenA} alt="Token A" />
        <TokenAvatar src={poolDataItem.imageTokenB} alt="Token B" />
      </LogoContainer>
      <Typography variant="h5">{poolDataItem.title}</Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {poolDataItem.subTitle}
      </Typography>
      <DetailContainer>
        <DetailItem>
          <DetailsTypography>Wallet Balance:</DetailsTypography>
          <DetailsTypography>{poolDataItem.walletBalance}</DetailsTypography>
        </DetailItem>
        <DetailItem>
          <DetailsTypography>Staked Tokens:</DetailsTypography>
          <DetailsTypography>{poolDataItem.stakedLpTokens}</DetailsTypography>
        </DetailItem>
        <DetailItem>
          <DetailsTypography>Pending Rewards:</DetailsTypography>
          <DetailsTypography>{poolDataItem.pendingBone} $BONE</DetailsTypography>
        </DetailItem>
      </DetailContainer>
      <Box mt={2}>
        <StakingPool
          pool={poolDataItem}
          onClick={() => handleClick('Button Click', `Staking Pool - ${poolDataItem.title}`)}
        />
      </Box>
    </RootContainer>
  );
};

export default Featured;
