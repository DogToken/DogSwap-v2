import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4'; // Import ReactGA for GA4 tracking
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import StakingPool from '../Components/Pools/StakingPool';
import { poolData } from '../constants/poolData';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "./../assets/abi/IERC20.json";
import masterChefABI from './../assets/abi/MasterChef.json';

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[10],
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  flex: 1,
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 700,
  '& thead th': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
  '& tbody tr:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '0.875rem',
  color: theme.palette.primary.contrastText,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const OverlappingAvatar = styled(({ overlap, ...props }) => <Avatar {...props} />)(({ theme, overlap }) => ({
  width: 32,
  height: 32,
  position: 'absolute',
  zIndex: overlap ? 1 : 'auto',
  left: overlap ? '20px' : 'auto',  // Adjust based on overlap required
}));

const TokenAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
}));

const Pools = () => {
  const [poolsData, setPoolsData] = useState([]);

  useEffect(() => {
    fetchAllPoolsData();
  }, []);

  const fetchAllPoolsData = async () => {
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
        };
      })
    );
    setPoolsData(allPoolsData);
  };

  const handleClick = (action, label) => {
    ReactGA.event({
      category: 'User Interaction',
      action,
      label,
    });
  };

  const fixedPools = poolsData.filter(pool => pool.poolType === 'Fixed');
  const communityPools = poolsData.filter(pool => pool.poolType === 'Community');

  return (
    <RootContainer maxWidth="lg">
      <TitleTypography variant="h3">Reward Pools</TitleTypography>

      {/* Fixed Pools Section */}
      <Box>
        <Typography variant="h5" gutterBottom>Fixed Pools</Typography>
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Pool</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Wallet Balance</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Staked Tokens</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Pending Rewards</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixedPools.map((pool, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <LogoContainer>
                      <TokenAvatar src={pool.imageTokenA} alt="Token A" />
                      <OverlappingAvatar src={pool.imageTokenB} alt="Token B" overlap />
                      <Box ml={4}>
                        <Typography variant="h6">{pool.title}</Typography>
                        <Typography variant="body2" color="textSecondary">{pool.subTitle}</Typography>
                      </Box>
                    </LogoContainer>
                  </StyledTableCell>
                  <StyledTableCell align="center">{pool.walletBalance}</StyledTableCell>
                  <StyledTableCell align="center">{pool.stakedLpTokens}</StyledTableCell>
                  <StyledTableCell align="center">{pool.pendingBone} $BONE</StyledTableCell>
                  <StyledTableCell align="center">
                    <StakingPool
                      pool={pool}
                      onClick={() => handleClick('Button Click', `Staking Pool - ${pool.title}`)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </Box>

      {/* Community Pools Section */}
      <Box>
        <Typography variant="h5" gutterBottom>Community Pools</Typography>
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Pool</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Wallet Balance</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Staked Tokens</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Pending Rewards</StyledTableHeadCell>
                <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communityPools.map((pool, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <LogoContainer>
                      <TokenAvatar src={pool.imageTokenA} alt="Token A" />
                      <OverlappingAvatar src={pool.imageTokenB} alt="Token B" overlap />
                      <Box ml={4}>
                        <Typography variant="h6">{pool.title}</Typography>
                        <Typography variant="body2" color="textSecondary">{pool.subTitle}</Typography>
                      </Box>
                    </LogoContainer>
                  </StyledTableCell>
                  <StyledTableCell align="center">{pool.walletBalance}</StyledTableCell>
                  <StyledTableCell align="center">{pool.stakedLpTokens}</StyledTableCell>
                  <StyledTableCell align="center">{pool.pendingBone} $BONE</StyledTableCell>
                  <StyledTableCell align="center">
                    <StakingPool
                      pool={pool}
                      onClick={() => handleClick('Button Click', `Staking Pool - ${pool.title}`)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </Box>
    </RootContainer>
  );
};

export default Pools;
