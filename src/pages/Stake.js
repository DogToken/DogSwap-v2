import React, { useState, useEffect, useMemo } from 'react';
import ReactGA from 'react-ga4'; // Import ReactGA for GA4 tracking
import {
  Container, Typography, Grid, Paper, Box, Avatar, Button, CircularProgress, TextField,
  Tooltip, Snackbar, Alert, Slider, useTheme, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import { Contract, ethers } from 'ethers';
import { getProvider, getSigner, getNetwork } from '../utils/ethereumFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWallet, faHandHoldingUsd, faClock, faChartLine, faExchangeAlt, faPercent } from '@fortawesome/free-solid-svg-icons';
import boneTokenABI from '../assets/abi/BoneToken.json';
import masterChefABI from '../assets/abi/MasterChef.json';
import axios from 'axios';
import pairABI from '../assets/abi/IUniswapV2Pair.json';

// Styled components (updated)
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

const SubTitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  textAlign: 'center',
  fontStyle: 'italic',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: '0 3px 5px 2px #aad9b2',
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.01)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  boxShadow: '0 3px 5px 2px #aad9b2',
}));

const BalanceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  fontSize: '1.5rem',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.dark,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 4),
  fontWeight: 'bold',
  borderRadius: '50px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  transition: 'all 0.1s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: theme.palette.primary.main,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));

// Constants
const BONE_TOKEN_ADDRESS = '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF';
const MASTER_CHEF_ADDRESS = '0x4f79af8335d41A98386f09d79D19Ab1552d0b925';

// Contract instance functions
const getBoneTokenInstance = (networkId, signer) => {
  return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
};

const getMasterChefInstance = (networkId, signer) => {
  return new Contract(MASTER_CHEF_ADDRESS, masterChefABI, signer);
};

// Event tracking function
const trackEvent = (category, action, label) => {
  ReactGA.event({ category, action, label });
};

export default function Stake() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [stakingAmount, setStakingAmount] = useState('');
  const [totalTokens, setTotalTokens] = useState('0');
  const [walletTokens, setWalletTokens] = useState('0');
  const [pendingBone, setPendingBone] = useState('0');
  const [stakedAmount, setStakedAmount] = useState('0');
  const [apy, setAPY] = useState('0');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [tvlData, setTVLData] = useState('0');
  const [mintmePrice, setMintmePrice] = useState(null);
  const [bonePrice, setBonePrice] = useState(null);
  const [bonePriceInUSD, setBonePriceInUSD] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const BONE_TOKEN_ADDRESS = "0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF";
  const BONE_TOKEN_DECIMALS = 18;
  const coinId = 'webchain';

  const getBoneTokenInstance = (networkId, signer) => {
    return new Contract(BONE_TOKEN_ADDRESS, boneTokenABI, signer);
  };

  const POOLS = [
    { id: 0, name: "$BONE-WMINT", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10" },
    { id: 1, name: "$BONE-USDC", address: "0x0BA7216BD34CAF32d1FBCb9341997328b38a03a3" },
    { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189" },
    { id: 5, name: "WMINT-DOGSP", address: "0x07Da7DA47b3C71a023d194ff623ab3a737c46393" },
    { id: 6, name: "$BONE-DOGSP", address: "0xCfFF901398cB001D740FFf564D2dcc9Dbd898a11" },
    { id: 7, name: "1000x-WMINT", address: "0x34D99393593245F3268ceAcf35a17407C49c4D59" },
    { id: 8, name: "1000x-$BONE", address: "0x9763E377ce4E6767F7760D9E1FC7E3c2afBc9Cfb" },
    { id: 9, name: "1000x-DOGSP", address: "0x0cC0D3382fC2826E18606C968842A91e5C52e2b3" },
  ];

  useEffect(() => {
    fetchBalances();
    fetchTVLData();
    const interval = setInterval(() => {
      fetchBalances();
      fetchTVLData();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTVLData = async () => {
    try {
      setLoading(true);
  
      // Fetch MintMe price
      const mintmePriceResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const mintmePriceData = mintmePriceResponse.data[coinId]?.usd;
      if (mintmePriceData !== undefined) {
        setMintmePrice(mintmePriceData);
      } else {
        throw new Error(`${coinId} price data is unavailable`);
      }
  
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);
  
      // Calculate price of $BONE in MintMe
      const bonePool = POOLS.find(pool => pool.name === "$BONE-WMINT");
      const boneReserves = await new Contract(bonePool.address, pairABI, signer).getReserves();
      const boneReserve0 = boneReserves[0] / 10 ** BONE_TOKEN_DECIMALS;
      const boneReserve1 = boneReserves[1] / 10 ** 18;
      const boneInWMINT = getTokenPrice(boneReserve0, boneReserve1);
      const bonePriceInMintMe = 1 / boneInWMINT;
      const bonePriceInUSDTemp = bonePriceInMintMe * mintmePriceData;
      setBonePriceInUSD(bonePriceInUSDTemp.toFixed(8));
      setBonePrice(bonePriceInMintMe.toFixed(8));
  
      // Calculate TVL using the MintMe price
      let tvl = 0;
      for (const pool of POOLS) {
        const poolReserves = await new Contract(pool.address, pairABI, signer).getReserves();
        const reserve0 = poolReserves[0] / 10 ** 18;
        const reserve1 = poolReserves[1] / 10 ** 18;
  
        const token0 = pool.name.split("-")[0];
        const token1 = pool.name.split("-")[1];
  
        let token0ValueInUSD;
        let token1ValueInUSD;
        if (token0 === "WMINT") {
          token0ValueInUSD = reserve0 * mintmePriceData;
        } else if (token0 === "$BONE") {
          token0ValueInUSD = reserve0 * bonePriceInUSDTemp;
        } else {
          token0ValueInUSD = reserve0;
        }
  
        if (token1 === "WMINT") {
          token1ValueInUSD = reserve1 * mintmePriceData;
        } else if (token1 === "$BONE") {
          token1ValueInUSD = reserve1 * bonePriceInUSDTemp;
        } else {
          token1ValueInUSD = reserve1;
        }
  
        const poolTVL = token0ValueInUSD + token1ValueInUSD;
        tvl += poolTVL;
      }
  
      setTVLData(tvl.toFixed(2));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TVL data:", error);
      setLoading(false);
    }
  };

  const getTokenPrice = (reserve0, reserve1) => {
    if (reserve0 === 0 || reserve1 === 0) {
      return 0;
    }
    return reserve1 / reserve0;
  };

  const fetchBalances = async () => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const networkId = await getNetwork(provider);
      const boneTokenContract = getBoneTokenInstance(networkId, signer);
      const masterChefContract = getMasterChefInstance(networkId, signer);
  
      // Fetching balances and data
      const [walletBalance, totalSupply, pendingRewards, userInfo, poolInfo] = await Promise.all([
        boneTokenContract.balanceOf(await signer.getAddress()),
        boneTokenContract.totalSupply(),
        masterChefContract.pendingBone(3, await signer.getAddress()),
        masterChefContract.userInfo(3, await signer.getAddress()),
        masterChefContract.poolInfo(3)
      ]);
  
      // Format and set balances
      setWalletTokens(parseFloat(ethers.utils.formatUnits(walletBalance, 18)).toFixed(5));
      setTotalTokens(parseFloat(ethers.utils.formatUnits(totalSupply, 18)).toFixed(5));
      setPendingBone(parseFloat(ethers.utils.formatUnits(pendingRewards, 18)).toFixed(5));
      setStakedAmount(parseFloat(ethers.utils.formatUnits(userInfo.amount, 18)).toFixed(5));
  
      // APY Calculation
      const bonePerBlock = poolInfo.bonePerBlock || ethers.BigNumber.from(0);
      const totalAllocPoint = await masterChefContract.totalAllocPoint();
      const bonePrice = 1; // Placeholder for actual bone price
      const blocksPerYear = 2102400; // Approximate number of blocks per year
  
      // Ensure poolInfo.totalBoneAmount and totalAllocPoint are valid
      const totalStaked = poolInfo.totalBoneAmount || ethers.BigNumber.from(0);
      const apy = totalStaked.gt(0) ? 
        bonePerBlock.mul(blocksPerYear).mul(poolInfo.allocPoint).div(totalAllocPoint)
          .mul(bonePrice).mul(100).div(totalStaked) : 
        ethers.BigNumber.from(0);
  
      setAPY(parseFloat(ethers.utils.formatUnits(apy, 18)).toFixed(2));
  
    } catch (error) {
      console.error('Error fetching balances:', error);
      setMessage({ text: 'Failed to fetch balances. Please try again later.', severity: 'error' });
      setShowSnackbar(true);
    }
  };
  
  const handleStakeTokens = async () => {
    try {
      setLoading(true);
      const amountToStake = ethers.utils.parseUnits(stakingAmount, 18);

      if (amountToStake.lte(0)) {
        throw new Error('Please enter a valid amount to stake.');
      }

      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      const boneTokenContract = getBoneTokenInstance(networkId, signer);

      const approveTx = await boneTokenContract.approve(MASTER_CHEF_ADDRESS, amountToStake);
      await approveTx.wait();

      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.deposit(3, amountToStake, { value: 0 });
      await transaction.wait();

      setMessage({ text: 'Tokens staked successfully!', severity: 'success' });
      setShowSnackbar(true);
      fetchBalances();
      trackEvent('Staking', 'Stake Tokens', `${amountToStake.toString()} BONE`); // Track stake event
    } catch (error) {
      console.error('Error staking tokens:', error);
      setMessage({ text: 'Failed to stake tokens. Please try again later.', severity: 'error' });
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawTokens = async () => {
    try {
      setLoading(true);
      const amountToWithdraw = ethers.utils.parseUnits(stakingAmount, 18);

      if (amountToWithdraw.lte(0)) {
        throw new Error('Please enter a valid amount to withdraw.');
      }

      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.withdraw(3, amountToWithdraw);
      await transaction.wait();

      setMessage({ text: 'Tokens withdrawn successfully!', severity: 'success' });
      setShowSnackbar(true);
      fetchBalances();
      trackEvent('Staking', 'Withdraw Tokens', `${amountToWithdraw.toString()} BONE`); // Track withdraw event
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setMessage({ text: 'Failed to withdraw tokens. Please try again later.', severity: 'error' });
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const networkId = await getNetwork(provider);
      const signer = getSigner(provider);

      const masterChefContract = getMasterChefInstance(networkId, signer);
      const transaction = await masterChefContract.deposit(3, 0); // Depositing 0 amount claims rewards
      await transaction.wait();

      setMessage({ text: 'Rewards claimed successfully!', severity: 'success' });
      setShowSnackbar(true);
      fetchBalances();
      trackEvent('Staking', 'Claim Rewards', 'Claimed rewards'); // Track claim rewards event
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setMessage({ text: 'Failed to claim rewards. Please try again later.', severity: 'error' });
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    setStakingAmount((newValue * parseFloat(walletTokens) / 100).toFixed(5));
  };

  const stakingPercentage = useMemo(() => {
    const total = parseFloat(totalTokens);
    const staked = parseFloat(stakedAmount);
    return total > 0 ? (staked / total * 100).toFixed(2) : '0';
  }, [totalTokens, stakedAmount]);

  

  return (
    <RootContainer maxWidth="lg">
      <TitleTypography variant="h3">$BONE Staking Dashboard</TitleTypography>
      <SubTitleTypography variant="body1">
        Stake your $BONE tokens to earn rewards and support the DogSwap ecosystem.
      </SubTitleTypography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Total supply of $BONE tokens in circulation" arrow placement="top">
            <StyledPaper elevation={3}>
              <StyledAvatar>
                <FontAwesomeIcon icon={faCoins} />
              </StyledAvatar>
              <Typography variant="h6">Total $BONE</Typography>
              <BalanceTypography variant="h5">{totalTokens}</BalanceTypography>
            </StyledPaper>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Your $BONE balance in wallet" arrow placement="top">
            <StyledPaper elevation={3}>
              <StyledAvatar>
                <FontAwesomeIcon icon={faWallet} />
              </StyledAvatar>
              <Typography variant="h6">Your $BONE</Typography>
              <BalanceTypography variant="h5">{walletTokens}</BalanceTypography>
            </StyledPaper>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Amount of $BONE you have staked" arrow placement="top">
            <StyledPaper elevation={3}>
              <StyledAvatar>
                <FontAwesomeIcon icon={faHandHoldingUsd} />
              </StyledAvatar>
              <Typography variant="h6">Staked $BONE</Typography>
              <BalanceTypography variant="h5">{stakedAmount}</BalanceTypography>
            </StyledPaper>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Unclaimed $BONE rewards" arrow placement="top">
            <StyledPaper elevation={3}>
              <StyledAvatar>
                <FontAwesomeIcon icon={faClock} />
              </StyledAvatar>
              <Typography variant="h6">Pending $BONE</Typography>
              <BalanceTypography variant="h5">{pendingBone}</BalanceTypography>
            </StyledPaper>
          </Tooltip>
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <StyledPaper elevation={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Stake or Withdraw $BONE</Typography>
              <StyledTextField
                label="Amount"
                variant="outlined"
                fullWidth
                value={stakingAmount}
                onChange={(e) => setStakingAmount(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setStakingAmount(walletTokens)}
                      color="primary"
                    >
                      Max
                    </Button>
                  ),
                }}
              />
              <Box mt={2}>
                <Typography gutterBottom>Quick select:</Typography>
                <StyledSlider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  aria-labelledby="stake-slider"
                  valueLabelDisplay="auto"
                  step={25}
                  marks
                  min={0}
                  max={100}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center" flexWrap="wrap">
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={handleStakeTokens}
                  disabled={loading}
                  startIcon={<FontAwesomeIcon icon={faHandHoldingUsd} />}
                >
                  {loading ? <CircularProgress size={24} /> : 'Stake'}
                </ActionButton>
                <ActionButton
                  variant="contained"
                  color="secondary"
                  onClick={handleWithdrawTokens}
                  disabled={loading}
                  startIcon={<FontAwesomeIcon icon={faExchangeAlt} />}
                >
                  {loading ? <CircularProgress size={24} /> : 'Withdraw'}
                </ActionButton>
                <ActionButton
                  variant="contained"
                  color="success"
                  onClick={handleClaimRewards}
                  disabled={loading || parseFloat(pendingBone) === 0}
                  startIcon={<FontAwesomeIcon icon={faCoins} />}
                >
                  {loading ? <CircularProgress size={24} /> : 'Claim Rewards'}
                </ActionButton>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>
      
      <Box mt={4}>
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>Staking Statistics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Annual Percentage Yield" arrow placement="top">
                <Box>
                  <Typography variant="subtitle1">APY</Typography>
                  <BalanceTypography variant="h4">
                    {apy}% <FontAwesomeIcon icon={faPercent} size="sm" />
                  </BalanceTypography>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Total Value Locked across all pools" arrow placement="top">
                <Box>
                  <Typography variant="subtitle1">Total Value Locked (TVL)</Typography>
                  <BalanceTypography variant="h4">
                    ${tvlData} <FontAwesomeIcon icon={faChartLine} size="sm" />
                  </BalanceTypography>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Percentage of your tokens currently staked" arrow placement="top">
                <Box>
                  <Typography variant="subtitle1">Your Staking Percentage</Typography>
                  <BalanceTypography variant="h4">
                    {stakingPercentage}% <FontAwesomeIcon icon={faChartLine} size="sm" />
                  </BalanceTypography>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
            <Tooltip title="Current price of MintMe in USD" arrow placement="top">
              <Box>
                <Typography variant="subtitle1">MintMe Price (USD)</Typography>
                <BalanceTypography variant="h4">
                  ${mintmePrice || 'N/A'}
                </BalanceTypography>
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6}>
        <Tooltip title="Current price of BONE in MintMe" arrow placement="top">
          <Box>
            <Typography variant="subtitle1">BONE Price (MintMe)</Typography>
            <BalanceTypography variant="h4">
              {bonePrice || 'N/A'} MINTME
            </BalanceTypography>
          </Box>
        </Tooltip>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Tooltip title="Current price of BONE in USD" arrow placement="top">
          <Box>
            <Typography variant="subtitle1">BONE Price (USD)</Typography>
            <BalanceTypography variant="h4">
              ${bonePriceInUSD || 'N/A'}
            </BalanceTypography>
          </Box>
        </Tooltip>
      </Grid>
          </Grid>
        </StyledPaper>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </RootContainer>
  );
}