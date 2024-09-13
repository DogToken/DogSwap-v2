import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Button, Grid, IconButton, Tooltip,
  Card, CardContent, Skeleton, useTheme, useMediaQuery, Link, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as WalletIcon,
  Token as TokenIcon,
  Receipt as ReceiptIcon,
  HowToVote as VoteIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import BONE_ABI from '../assets/abi/BoneToken.json';

const tokenContracts = [
  { address: '0x1628160C66e0330090248a163A34Ba5B5A82D4f7', symbol: 'DogSwap', decimals: 18, image: '/images/coins/dogswap.png', homepage: 'https://dogswap.xyz', info: 'DogSwap is a decentralized exchange for dog-themed tokens.' },
  { address: '0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF', symbol: 'BONE', decimals: 18, image: '/images/coins/bone.png', homepage: 'https://dogswap.xyz', info: 'BONE is the governance token for the DogSwap ecosystem.' },
  { address: '0x7b535379bBAfD9cD12b35D91aDdAbF617Df902B2', symbol: '1000x', decimals: 18, image: '/images/coins/1000x.png', homepage: 'https://1000x.ch', info: '1000x is a deflationary token aiming for exponential growth.' }
];

const routerAddress = '0xa6c72da53025c5291d326fadc5a1277aa21fef2c';

const ProfileDashboard = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [votingPower, setVotingPower] = useState({ amount: '0', percentage: '0' });
  const [routerTransactions, setRouterTransactions] = useState([]);
  const [loading, setLoading] = useState({
    wallet: true,
    balance: true,
    tokens: true,
    transactions: true,
    votingPower: true,
    routerTransactions: true
  });
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const provider = await getProvider();
      const signer = await getSigner(provider);
      const address = await signer.getAddress();
      setWalletAddress(address);
      setLoading(prev => ({ ...prev, wallet: false }));

      // Load data concurrently
      await Promise.all([
        fetchBalance(provider, address),
        fetchTokenBalances(provider, address),
        fetchTransactions(provider, address),
        fetchVotingPower(provider, address),
        fetchRouterTransactions(provider)
      ]);
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      setError('Failed to load blockchain data. Please check your wallet connection and try again.');
    }
  };

  const fetchBalance = async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  };

  const fetchTokenBalances = async (provider, walletAddress) => {
    try {
      const tokenBalances = await Promise.all(
        tokenContracts.map(async (token) => {
          const tokenContract = new ethers.Contract(token.address, ['function balanceOf(address) view returns (uint256)'], provider);
          const balance = await tokenContract.balanceOf(walletAddress);
          return {
            ...token,
            balance: ethers.utils.formatUnits(balance, token.decimals)
          };
        })
      );
      setTokens(tokenBalances);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    } finally {
      setLoading(prev => ({ ...prev, tokens: false }));
    }
  };

  const fetchTransactions = async (provider, walletAddress) => {
    try {
      const latestBlock = await provider.getBlockNumber();
      const startBlock = latestBlock - 100;
      const txs = [];

      for (let i = latestBlock; i >= startBlock; i--) {
        const block = await provider.getBlockWithTransactions(i);
        const filteredTxs = block.transactions.filter(tx =>
          tx.from.toLowerCase() === walletAddress.toLowerCase() ||
          (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase())
        );
        txs.push(...filteredTxs);
        if (txs.length >= 25) break;
      }

      setTransactions(txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchVotingPower = async (provider, walletAddress) => {
    try {
      const boneToken = new ethers.Contract('0x9D8dd79F2d4ba9E1C3820d7659A5F5D2FA1C22eF', BONE_ABI, provider);
      const votingPower = await boneToken.getCurrentVotes(walletAddress);
      const totalSupply = await boneToken.totalSupply();
      const votingPowerPercentage = (votingPower.mul(100).div(totalSupply)).toNumber() / 100;

      setVotingPower({
        amount: ethers.utils.formatUnits(votingPower, 18),
        percentage: votingPowerPercentage.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching voting power:', error);
    } finally {
      setLoading(prev => ({ ...prev, votingPower: false }));
    }
  };

  const fetchRouterTransactions = async (provider) => {
    try {
      const latestBlock = await provider.getBlockNumber();
      const startBlock = latestBlock - 100;
      const txs = [];

      for (let i = latestBlock; i >= startBlock; i--) {
        const block = await provider.getBlockWithTransactions(i);
        const filteredTxs = block.transactions.filter(tx =>
          tx.to && tx.to.toLowerCase() === routerAddress.toLowerCase()
        );
        txs.push(...filteredTxs);
        if (txs.length >= 10) break; // Limit to the latest 10 transactions
      }

      setRouterTransactions(txs);
    } catch (error) {
      console.error('Error fetching router transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, routerTransactions: false }));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleLogout = () => {
    // Reset state and reload data
    setWalletAddress('');
    setBalance('');
    setTransactions([]);
    setTokens([]);
    setVotingPower({ amount: '0', percentage: '0' });
    setRouterTransactions([]);
    setLoading({
      wallet: true,
      balance: true,
      tokens: true,
      transactions: true,
      votingPower: true,
      routerTransactions: true
    });
    loadBlockchainData();
  };

  const handleRefresh = () => {
    setLoading({
      wallet: true,
      balance: true,
      tokens: true,
      transactions: true,
      votingPower: true,
      routerTransactions: true
    });
    setError('');
    loadBlockchainData();
  };

  const InfoCard = ({ title, icon, content, isLoading }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        {isLoading ? <Skeleton variant="rectangular" width="100%" height={100} /> : content}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ 
      my: 4, 
      p: 4, 
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Profile Dashboard
      </Typography>

      {error && (
        <Box mb={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoCard
            title="Wallet Address"
            icon={<WalletIcon />}
            isLoading={loading.wallet}
            content={
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                </Typography>
                <Tooltip title="Copy Address">
                  <IconButton onClick={() => handleCopy(walletAddress)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard
            title="Wallet Balance"
            icon={<TokenIcon />}
            isLoading={loading.balance}
            content={
              <Typography variant="h6">{balance} MINTME</Typography>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <InfoCard
            title="Token Balances"
            icon={<TokenIcon />}
            isLoading={loading.tokens}
            content={
              tokens.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Contract Address</TableCell>
                        <TableCell>Project Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tokens.map((token, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <img src={token.image} alt={token.symbol} style={{ width: 24, height: 24, marginRight: 8 }} />
                              {token.symbol}
                            </Box>
                          </TableCell>
                          <TableCell>{token.balance}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2">{`${token.address.slice(0, 6)}...${token.address.slice(-4)}`}</Typography>
                              <Tooltip title="Copy Address">
                                <IconButton size="small" onClick={() => handleCopy(token.address)}>
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Link href={token.homepage} target="_blank" rel="noopener noreferrer">
                              {token.homepage}
                            </Link>
                            <Tooltip title={token.info}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No token balances found.</Typography>
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <InfoCard
            title="Recent Transactions"
            icon={<ReceiptIcon />}
            isLoading={loading.transactions}
            content={
              transactions.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Hash</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((tx, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2">{`${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`}</Typography>
                              <Tooltip title="Copy Hash">
                                <IconButton size="small" onClick={() => handleCopy(tx.hash)}>
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>{ethers.utils.formatEther(tx.value)} MINTME</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2">{tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Contract'}</Typography>
                              {tx.to && (
                                <Tooltip title="Copy Address">
                                  <IconButton size="small" onClick={() => handleCopy(tx.to)}>
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No recent transactions found.</Typography>
              )
            }/>
            </Grid>
    
            <Grid item xs={12} md={6}>
              <InfoCard
                title="BONE Token Voting Power"
                icon={<VoteIcon />}
                isLoading={loading.votingPower}
                content={
                  <>
                    <Typography variant="h6">{votingPower.amount} BONE</Typography>
                    <Typography variant="body2">
                      {votingPower.percentage}% of total supply
                    </Typography>
                  </>
                }
              />
            </Grid>
    
            <Grid item xs={12}>
              <InfoCard
                title="Recent Trades"
                icon={<ReceiptIcon />}
                isLoading={loading.routerTransactions}
                content={
                  routerTransactions.length > 0 ? (
                    <List>
                      {routerTransactions.map((tx, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                Hash: {`${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  Value: {ethers.utils.formatEther(tx.value)} MINTME
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.primary">
                                  From: {tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 'Unknown'}
                                </Typography>
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Copy Hash">
                              <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(tx.hash)}>
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No recent trades found.</Typography>
                  )
                }
              />
            </Grid>
    
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<WalletIcon />}
                  onClick={handleRefresh}
                  disabled={Object.values(loading).some(Boolean)}
                >
                  Refresh Data
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  disabled={Object.values(loading).some(Boolean)}
                >
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      );
    };
    
    export default ProfileDashboard;