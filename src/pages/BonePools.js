import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { 
  Alert, Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Box, Avatar, Chip,
  FormControlLabel, Switch, Tooltip, IconButton, CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import StakingPool from '../Components/Pools/StakingPool';
import { poolData } from '../constants/weeklyPoolData';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from "../assets/abi/IERC20.json";
import masterChefABI from '../assets/abi/MasterChef.json';
import CollectAllRewardsButton from '../Components/Pools/CollectAllRewardsButton';


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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  background: theme.palette.background.paper,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& thead th': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '0.85rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const OverlappingAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  marginLeft: -8,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const StatusChip = styled(Chip)(({ theme, isActive }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: isActive ? theme.palette.success.light : theme.palette.error.light,
  color: isActive ? theme.palette.success.contrastText : theme.palette.error.contrastText,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
}));

const PoolInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: theme.spacing(2),
}));

const StatusChipContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

const FeeChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.contrastText,
}));

const Pools = () => {
  const [poolsData, setPoolsData] = useState([]);
  const [hideInactive, setHideInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      // You might want to set an error state here and display it to the user
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

  const filteredPools = poolsData.filter(pool => !hideInactive || pool.isActive);

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
        <TitleTypography variant="h4">Bone Pools</TitleTypography>
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
      <CollectAllRewardsButton pools={poolsData} />
      {filteredPools.length === 0 ? (
        <Alert severity="info">
          No active pools available at the moment. Please check back later.
        </Alert>
      ) : (
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableCell>Pool</StyledTableCell>
                <StyledTableCell align="right">Wallet Balance</StyledTableCell>
                <StyledTableCell align="right">Staked Tokens</StyledTableCell>
                <StyledTableCell align="right">Pending Rewards</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPools.map((pool, index) => (
                <TableRow key={index}>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                    <LogoContainer>
                      <Avatar src={pool.imageTokenA} alt="Token A" sx={{ width: 28, height: 28 }} />
                      <OverlappingAvatar src={pool.imageTokenB} alt="Token B" />
                    </LogoContainer>
                    <PoolInfoContainer>
                      <Typography variant="subtitle2">{pool.title}</Typography>
                      <Typography variant="caption" color="textSecondary">{pool.subTitle}</Typography>
                      <StatusChipContainer>
                        <StatusChip
                          label={pool.isActive ? "Active" : "Inactive"}
                          size="small"
                          isActive={pool.isActive}
                        />
                        <FeeChip
                          label={`${pool.fee}% Fee`}
                          size="small"
                        />
                        {!pool.isActive && (
                          <Tooltip title="This pool is inactive. A 10% fee applies and rewards are turned off.">
                            <IconButton size="small" color="warning">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </StatusChipContainer>
                    </PoolInfoContainer>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">{pool.walletBalance}</StyledTableCell>
                  <StyledTableCell align="right">{pool.stakedLpTokens}</StyledTableCell>
                  <StyledTableCell align="right">{pool.pendingBone} $BONE</StyledTableCell>
                  <StyledTableCell align="center">
                    <StakingPool
                      pool={pool}
                      onClick={() => handleClick('Button Click', `Staking Pool - ${pool.title}`)}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      )}
    </RootContainer>
  );
};

export default Pools;