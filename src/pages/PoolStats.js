import React, { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import {
  Container, Typography, Paper, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, Grid, Tooltip, Avatar
} from '@mui/material';
import { styled } from '@mui/system';
import { getProvider, getSigner, getNetwork } from '../utils/ethereumFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faCoins, faChartPie, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import pairABI from '../assets/abi/IUniswapV2Pair.json';
import erc20ABI from '../assets/abi/ERC20.json';
import { Context } from "../Context";

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

// Token decimals mapping
const TOKEN_DECIMALS = {
  'USDC': 6,
  '$BONE': 18,
  'WMINT': 18,
  'DOGSP': 12,
  '1000x': 12,
  'XTR': 12,
  'DAM': 12,
  'ZAR': 12,
  'BANG': 12,
  'DGONE': 12,
  'BOBD': 12,
  'CLICK': 12,
  'DCLUB': 12,
  'SHELLS': 12,
  'DWMW': 12,
  'RANGER': 12,
  'WBUX': 12,
  'BATS': 12
};

// Pools configuration
const POOLS = [
  { id: 0, name: "WMINT-$BONE", address: "0x21D897515b2C4393F7a23BBa210b271D13CCdF10" },
  { id: 1, name: "$BONE-USDC", address: "0x0BA7216BD34CAF32d1FBCb9341997328b38a03a3" },
  { id: 2, name: "WMINT-USDC", address: "0x1Ea95048A66455C3852dBE4620A3970831564189" },
  { id: 5, name: "DOGSP-BONE", address: "0x07Da7DA47b3C71a023d194ff623ab3a737c46393" },
  { id: 6, name: "WMINT-DOGSP", address: "0xCfFF901398cB001D740FFf564D2dcc9Dbd898a11" },
  { id: 7, name: "WMINT-1000x", address: "0x34D99393593245F3268ceAcf35a17407C49c4D59" },
  { id: 8, name: "1000x-$BONE", address: "0x9763E377ce4E6767F7760D9E1FC7E3c2afBc9Cfb" },
  { id: 9, name: "DOGSP-1000x", address: "0x0cC0D3382fC2826E18606C968842A91e5C52e2b3" },
  { id: 10, name: "WMINT-XTR", address: "0x1d2a64b660E572ce653f35Ce5A9A655D05ae9fd0" },
  { id: 11, name: "DAM-BONE", address: "0xDaEEc4298a0ED4796E271188D2D7Bbcf53733Fb1" },
  { id: 12, name: "BONE-ZAR", address: "0xE4020B6d3073B79027e2350705f9230903130791" },
  { id: 13, name: "BONE-XTR", address: "0x32D8Da81B7b4a562b0852ed6823BE8b2CCFa6495" },
  { id: 14, name: "BONE-BANG", address: "0x84D0Ee4262cfD4ea222554D4FAE1A5Df7c38D9Be" },
  { id: 15, name: "DGONE-BONE", address: "0x5D8274da127f7D94b46D123090707BBBCd4Ed119" },
  { id: 16, name: "BOBD-BONE", address: "0x1607D3CaB18F24e3De082Fd2F297b0d3B0fc0112" },
  { id: 17, name: "BONE-CLICK", address: "0xf099c8D1cd95608F5D5e70da8581c4981d4f3a3f" },
  { id: 18, name: "DCLUB-BONE", address: "0x66b700c1039182C6fD653b429A14bf4BC2d98a4A" },
  { id: 19, name: "BONE-SHELLS", address: "0x662ca8cAceBfd41442c536D0153Ed181bfD34c60" },
  { id: 20, name: "DWMW-BONE", address: "0xee1780dc28D0948fe46FC10fcED1B44F5d1a5971" },
  { id: 21, name: "RANGER-BONE", address: "0xC5a3D921a8c3FA452c278D5278EA1aeb28C0Ecb2" },
  { id: 22, name: "BONE-WBUX", address: "0xD288C9aC27b608dB905B98AB0fDfd0Ea68059ecc" },
  { id: 23, name: "BONE-BATS", address: "0x714A30450a3DCe38b6CC731Cdaa265e627D88A67" }
];

export default function PoolsStatistics() {
  const [loading, setLoading] = useState(true);
  const [poolsData, setPoolsData] = useState([]);
  const [totalLiquidity, setTotalLiquidity] = useState('0');
  const [totalLPTokens, setTotalLPTokens] = useState('0');
  const [highestLiquidityPool, setHighestLiquidityPool] = useState({ name: '', value: 0 });
  
  const { mintMePriceInUsdState, bonePriceInUSDState } = React.useContext(Context);
  const [mintMePriceInUsd] = mintMePriceInUsdState;
  const [bonePriceInUSD] = bonePriceInUSDState;

  const getTokenDecimals = async (tokenAddress, tokenSymbol) => {
    try {
      if (TOKEN_DECIMALS[tokenSymbol]) {
        return TOKEN_DECIMALS[tokenSymbol];
      }
      const provider = getProvider();
      const tokenContract = new Contract(tokenAddress, erc20ABI, provider);
      const decimals = await tokenContract.decimals();
      return parseInt(decimals);
    } catch (error) {
      console.error(`Error fetching decimals for ${tokenSymbol}:`, error);
      return 12;
    }
  };

  const calculateTokenValue = (amount, symbol) => {
    const numAmount = parseFloat(amount);
    switch (symbol) {
      case 'WMINT':
        return numAmount * mintMePriceInUsd;
      case '$BONE':
        return numAmount * bonePriceInUSD;
      case 'USDC':
        return numAmount;
      default:
        // For other tokens, calculate based on their BONE pair if available
        return numAmount * bonePriceInUSD;
    }
  };

  const getTokenData = async (pairContract, tokenAddress) => {
    try {
      const tokenContract = new Contract(tokenAddress, erc20ABI, getProvider());
      const [symbol, decimals] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals()
      ]);
      return { symbol, decimals: parseInt(decimals) };
    } catch (error) {
      console.error(`Error fetching token data:`, error);
      // Fallback to finding symbol from pool name
      const poolName = POOLS.find(p => p.address === pairContract.address)?.name || '';
      const symbols = poolName.split('-');
      // Try to match address ending with token symbols we know
      const matchingSymbol = symbols.find(s => 
        TOKEN_DECIMALS[s] !== undefined
      );
      return {
        symbol: matchingSymbol || 'UNKNOWN',
        decimals: TOKEN_DECIMALS[matchingSymbol] || 12
      };
    }
  };


  const fetchPoolsData = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const signer = getSigner(provider);

      let totalLiq = 0;
      let totalLP = 0;
      let highestLiq = { name: '', value: 0 };
      const poolsInfo = [];

      for (const pool of POOLS) {
        const pairContract = new Contract(pool.address, pairABI, signer);
        
        const [reserves, totalSupply, token0Address, token1Address] = await Promise.all([
          pairContract.getReserves(),
          pairContract.totalSupply(),
          pairContract.token0(),
          pairContract.token1()
        ]);

        // Get actual token data instead of assuming from pool name
        const [token0Data, token1Data] = await Promise.all([
          getTokenData(pairContract, token0Address),
          getTokenData(pairContract, token1Address)
        ]);

        const reserve0 = ethers.utils.formatUnits(reserves[0], token0Data.decimals);
        const reserve1 = ethers.utils.formatUnits(reserves[1], token1Data.decimals);
        const lpTokens = ethers.utils.formatUnits(totalSupply, 18);

        // Calculate value of each token in USD using prices from context
        const token0USD = calculateTokenValue(reserve0, token0Data.symbol);
        const token1USD = calculateTokenValue(reserve1, token1Data.symbol);

        // Calculate total liquidity
        const liquidityUSD = token0USD + token1USD;

        totalLiq += liquidityUSD;
        totalLP += parseFloat(lpTokens);

        if (liquidityUSD > highestLiq.value) {
          highestLiq = { name: pool.name, value: liquidityUSD };
        }

        poolsInfo.push({
          ...pool,
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
        });
      }

      setPoolsData(poolsInfo);
      setTotalLiquidity(totalLiq.toFixed(2));
      setTotalLPTokens(totalLP.toFixed(4));
      setHighestLiquidityPool(highestLiq);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pools data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolsData();
    const interval = setInterval(fetchPoolsData, 30000000);
    return () => clearInterval(interval);
  }, [mintMePriceInUsd, bonePriceInUSD]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RootContainer maxWidth="lg">
      <TitleTypography variant="h3">Liquidity Pools Statistics</TitleTypography>
      <SubTitleTypography variant="body1">
        Comprehensive overview of all liquidity pools and their performance
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
              <StatValue>{POOLS.length}</StatValue>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Pools Table */}
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
                  <TableCell>{pool.reserve0}</TableCell>
                  <TableCell>{pool.reserve1}</TableCell>
                  <TableCell>{pool.lpTokens}</TableCell>
                  <TableCell>${pool.liquidityUSD}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {/* Additional Pool Information */}
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