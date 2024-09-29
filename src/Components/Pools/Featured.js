import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Container, Typography, Box, Avatar, Link as MuiLink } from '@mui/material';
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
  backgroundColor: 'white',
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
  fontSize: '2.5rem',
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
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[2],
}));

const SubTitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  fontSize: '1.25rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  padding: theme.spacing(0, 2),
}));

const ProjectLink = styled(MuiLink)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '1.125rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const DetailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  margin: theme.spacing(2, 0),
  backgroundColor: 'rgba(240, 240, 240, 0.7)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const DetailItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  flex: '1',
  margin: theme.spacing(0, 1),
  textAlign: 'center',
}));

const DetailsTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
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
      const walletBalance = await lpTokenContract.balanceOf(await signer.getAddress());
      const formattedWalletBalance = ethers.utils.formatUnits(walletBalance, 18);

      const userInfo = await masterChefContract.userInfo(pool.poolId, await signer.getAddress());
      const formattedStakedAmount = ethers.utils.formatUnits(userInfo.amount, 18);

      const pendingRewards = await masterChefContract.pendingBone(pool.poolId, await signer.getAddress());
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

  // Split the subtitle into an array of lines
  const subtitleLines = poolDataItem.subTitle.split('\n').map((line, index) => (
    <Typography key={index} variant="body1">{line}</Typography>
  ));

  return (
    <RootContainer maxWidth="lg">
      <TitleTypography variant="h3">Featured Pool</TitleTypography>
      <LogoContainer>
        <TokenAvatar src={poolDataItem.imageTokenA} alt="Token A" />
        <TokenAvatar src={poolDataItem.imageTokenB} alt="Token B" />
      </LogoContainer>
      <Typography variant="h5">{poolDataItem.title}</Typography>
      <SubTitleTypography>{subtitleLines}</SubTitleTypography>
      
      {/* Project Link */}
      <ProjectLink href={poolDataItem.projectLink} target="_blank" rel="noopener noreferrer">
        Visit Project
      </ProjectLink>

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
