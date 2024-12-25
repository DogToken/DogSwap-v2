import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Contract, ethers } from 'ethers';
import { 
  Container, Typography, Paper, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, Grid, Tooltip, Avatar
} from '@mui/material';
import { styled } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faCoins, faChartPie, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../Context";
import { getProvider } from '../utils/ethereumFunctions';

// Styled Components
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
  marginBottom: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
  boxShadow: '0 3px 5px 2px rgba(170, 217, 178, 0.3)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
  boxShadow: '0 3px 5px 2px rgba(170, 217, 178, 0.3)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(170, 217, 178, 0.3)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontWeight: 'bold',
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 9999,
}));

// Contract ABIs
const TOKEN_ABI = [
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)"
];

const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function totalSupply() external view returns (uint256)"
];

const FACTORY_ABI = [
  "function allPairsLength() external view returns (uint)",
  "function allPairs(uint) external view returns (address)"
];

const FACTORY_ADDRESS = "0x86818c666b90f6f4706560afc72c2c2fa7b9c74a";

// Token data cache
const tokenDataCache = new Map();

const AllPoolStats = () => {
    const [loading, setLoading] = useState(true);
    const [poolsData, setPoolsData] = useState([]);
    const [totalLiquidity, setTotalLiquidity] = useState('0');
    const [totalLPTokens, setTotalLPTokens] = useState('0');
    const [highestLiquidityPool, setHighestLiquidityPool] = useState({ name: '', value: 0 });
    
    const { mintMePriceInUsdState, bonePriceInUSDState } = React.useContext(Context);
    const [mintMePriceInUsd] = mintMePriceInUsdState;
    const [bonePriceInUSD] = bonePriceInUSDState;
  
    const provider = useMemo(() => getProvider(), []);
    const factory = useMemo(() => new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider), [provider]);
  

  const getTokenData = useCallback(async (tokenAddress) => {
    if (tokenDataCache.has(tokenAddress)) {
      return tokenDataCache.get(tokenAddress);
    }

    const tokenContract = new Contract(tokenAddress, TOKEN_ABI, provider);
    try {
      const [symbol, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals()
      ]);
      const tokenData = { symbol, decimals: Number(decimals) };
      tokenDataCache.set(tokenAddress, tokenData);
      return tokenData;
    } catch (error) {
      console.error(`Error fetching token data for ${tokenAddress}:`, error);
      return { symbol: 'UNKNOWN', decimals: 18 };
    }
  }, [provider]);

  const calculateTokenValue = useCallback((amount, symbol) => {
    const numAmount = parseFloat(amount);
    switch (symbol) {
      case 'WMINT':
        return numAmount * mintMePriceInUsd;
      case '$BONE':
        return numAmount * bonePriceInUSD;
      case 'USDC':
        return numAmount;
      default:
        return numAmount * bonePriceInUSD;
    }
  }, [mintMePriceInUsd, bonePriceInUSD]);

  const fetchPoolData = useCallback(async (pairAddress, index) => {
    const pairContract = new Contract(pairAddress, PAIR_ABI, provider);
    
    try {
      const [reserves, totalSupply, token0Address, token1Address] = await Promise.all([
        pairContract.getReserves(),
        pairContract.totalSupply(),
        pairContract.token0(),
        pairContract.token1()
      ]);

      const [token0Data, token1Data] = await Promise.all([
        getTokenData(token0Address),
        getTokenData(token1Address)
      ]);

      const reserve0 = ethers.utils.formatUnits(reserves[0], token0Data.decimals);
      const reserve1 = ethers.utils.formatUnits(reserves[1], token1Data.decimals);
      const lpTokens = ethers.utils.formatUnits(totalSupply, 18);

      const token0USD = calculateTokenValue(reserve0, token0Data.symbol);
      const token1USD = calculateTokenValue(reserve1, token1Data.symbol);
      const liquidityUSD = token0USD + token1USD;

      return {
        id: index,
        name: `${token0Data.symbol}-${token1Data.symbol}`,
        address: pairAddress,
        reserve0: parseFloat(reserve0).toFixed(4),
        reserve1: parseFloat(reserve1).toFixed(4),
        lpTokens: parseFloat(lpTokens).toFixed(4),
        liquidityUSD: liquidityUSD.toFixed(2),
        token0Address,
        token1Address,
        token0Symbol: token0Data.symbol,
        token1Symbol: token1Data.symbol,
        token0USD: token0USD.toFixed(2),
        token1USD: token1USD.toFixed(2)
      };
    } catch (error) {
      console.error(`Error fetching data for pool ${pairAddress}:`, error);
      return null;
    }
  }, [provider, getTokenData, calculateTokenValue]);

  const fetchAllPools = useCallback(async () => {
    try {
      setLoading(true);
      const pairCount = await factory.allPairsLength();
      
      const poolPromises = [];
      for (let i = 0; i < pairCount; i++) {
        const pairAddress = await factory.allPairs(i);
        poolPromises.push(fetchPoolData(pairAddress, i));
      }

      const poolsInfo = (await Promise.all(poolPromises)).filter(Boolean);

      let totalLiq = 0;
      let totalLP = 0;
      let highestLiq = { name: '', value: 0 };

      poolsInfo.forEach(pool => {
        const liquidityValue = parseFloat(pool.liquidityUSD);
        totalLiq += liquidityValue;
        totalLP += parseFloat(pool.lpTokens);

        if (liquidityValue > highestLiq.value) {
          highestLiq = { name: pool.name, value: liquidityValue };
        }
      });

      setPoolsData(poolsInfo);
      setTotalLiquidity(totalLiq.toFixed(2));
      setTotalLPTokens(totalLP.toFixed(4));
      setHighestLiquidityPool(highestLiq);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pools data:', error);
      setLoading(false);
    }
  }, [factory, fetchPoolData]);

  useEffect(() => {
    fetchAllPools();
  }, [fetchAllPools]);

  if (loading) {
    return (
      <LoadingContainer>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" style={{ marginTop: 16 }}>
            Loading Pools Data...
          </Typography>
        </Box>
      </LoadingContainer>
    );
  }

  return (
    <RootContainer maxWidth="lg">
      <TitleTypography variant="h3">
        Liquidity Pools Statistics
      </TitleTypography>
      <SubTitleTypography variant="body1">
        Real-time overview of all liquidity pools
      </SubTitleTypography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <StyledAvatar>
                <FontAwesomeIcon icon={faWater} />
              </StyledAvatar>
              <Typography variant="h6" gutterBottom>Total Liquidity</Typography>
              <StatValue>${totalLiquidity}</StatValue>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <StyledAvatar>
                <FontAwesomeIcon icon={faCoins} />
              </StyledAvatar>
              <Typography variant="h6" gutterBottom>Total LP Tokens</Typography>
              <StatValue>{totalLPTokens}</StatValue>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <StyledAvatar>
                <FontAwesomeIcon icon={faChartPie} />
              </StyledAvatar>
              <Typography variant="h6" gutterBottom>Highest Liquidity Pool</Typography>
              <StatValue>{highestLiquidityPool.name}</StatValue>
              <Typography variant="body2" color="textSecondary">
                ${highestLiquidityPool.value.toFixed(2)}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <StyledAvatar>
                <FontAwesomeIcon icon={faExchangeAlt} />
              </StyledAvatar>
              <Typography variant="h6" gutterBottom>Active Pools</Typography>
              <StatValue>{poolsData.length}</StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <StyledPaper>
        <Typography variant="h5" gutterBottom>Detailed Pool Statistics</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Pool</StyledTableCell>
                <StyledTableCell>Token 1 Amount</StyledTableCell>
                <StyledTableCell>Token 2 Amount</StyledTableCell>
                <StyledTableCell>LP Tokens</StyledTableCell>
                <StyledTableCell>Total Liquidity</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poolsData.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>{pool.reserve0} {pool.token0Symbol}</TableCell>
                  <TableCell>{pool.reserve1} {pool.token1Symbol}</TableCell>
                  <TableCell>{pool.lpTokens}</TableCell>
                  <TableCell>${pool.liquidityUSD}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h5" gutterBottom>Pool Addresses</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Pool</StyledTableCell>
                <StyledTableCell>Pool Address</StyledTableCell>
                <StyledTableCell>Token 1 Address</StyledTableCell>
                <StyledTableCell>Token 2 Address</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poolsData.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>
                    <Tooltip title="Click to copy" arrow>
                      <Box 
                        component="span" 
                        onClick={() => navigator.clipboard.writeText(pool.address)}
                        sx={{ cursor: 'pointer' }}
                      >
                        {`${pool.address.substring(0, 6)}...${pool.address.substring(38)}`}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Click to copy" arrow>
                      <Box 
                        component="span" 
                        onClick={() => navigator.clipboard.writeText(pool.token0Address)}
                        sx={{ cursor: 'pointer' }}
                                              >
                                                {`${pool.address.substring(0, 6)}...${pool.address.substring(38)}`}
                                              </Box>
                                            </Tooltip>
                                          </TableCell>
                                          <TableCell>
                                            <Tooltip title="Click to copy" arrow>
                                              <Box 
                                                component="span" 
                                                onClick={() => navigator.clipboard.writeText(pool.token0Address)}
                                                sx={{ cursor: 'pointer' }}
                                              >
                                                {`${pool.token0Address.substring(0, 6)}...${pool.token0Address.substring(38)}`}
                                              </Box>
                                            </Tooltip>
                                          </TableCell>
                                          <TableCell>
                                            <Tooltip title="Click to copy" arrow>
                                              <Box 
                                                component="span" 
                                                onClick={() => navigator.clipboard.writeText(pool.token1Address)}
                                                sx={{ cursor: 'pointer' }}
                                              >
                                                {`${pool.token1Address.substring(0, 6)}...${pool.token1Address.substring(38)}`}
                                              </Box>
                                            </Tooltip>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </StyledPaper>
                            </RootContainer>
                          );
                        }


export default AllPoolStats;