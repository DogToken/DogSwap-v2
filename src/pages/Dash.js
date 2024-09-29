import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Typography, Box, Button, Grid, IconButton,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as WalletIcon,
  Token as TokenIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { fetchBalance, fetchTokenBalances, fetchTransactions, fetchVotingPower, fetchRouterTransactions } from '../utils/dashFetch';
import InfoCard from '../Components/Dash/InfoCard';
import TokenBalances from '../Components/Dash/TokenBalances';
import RecentTransactions from '../Components/Dash/RecentTransactions';
import RecentTrades from '../Components/Dash/RecentTrades';

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
    loadWalletData();
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
    loadWalletData();
  };

  const loadWalletData = useCallback(async () => {
    try {
      const provider = await getProvider();
      const signer = await getSigner(provider);
      const address = await signer.getAddress();
      setWalletAddress(address);
      setLoading(prev => ({ ...prev, wallet: false }));
      return { provider, address };
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError('Failed to load wallet data. Please check your wallet connection and try again.');
      setLoading(prev => ({ ...prev, wallet: false }));
    }
  }, []);

  const loadBalance = useCallback(async ({ provider, address }) => {
    if (!provider || !address) return;
    try {
      const balanceValue = await fetchBalance(provider, address);
      setBalance(balanceValue);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  }, []);

  const loadTokenBalances = useCallback(async ({ provider, address }) => {
    if (!provider || !address) return;
    try {
      const tokenBalances = await fetchTokenBalances(provider, address);
      setTokens(tokenBalances);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    } finally {
      setLoading(prev => ({ ...prev, tokens: false }));
    }
  }, []);

  const loadTransactions = useCallback(async ({ provider, address }) => {
    if (!provider || !address) return;
    try {
      const txs = await fetchTransactions(provider, address);
      setTransactions(txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  }, []);

  const loadVotingPower = useCallback(async ({ provider, address }) => {
    if (!provider || !address) return;
    try {
      const power = await fetchVotingPower(provider, address);
      setVotingPower(power);
    } catch (error) {
      console.error('Error fetching voting power:', error);
    } finally {
      setLoading(prev => ({ ...prev, votingPower: false }));
    }
  }, []);

  const loadRouterTransactions = useCallback(async ({ provider }) => {
    if (!provider) return;
    try {
      const routerTxs = await fetchRouterTransactions(provider);
      setRouterTransactions(routerTxs);
    } catch (error) {
      console.error('Error fetching router transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, routerTransactions: false }));
    }
  }, []);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  useEffect(() => {
    loadWalletData().then(data => {
      if (data) {
        loadBalance(data);
        loadTokenBalances(data);
        loadTransactions(data);
        loadVotingPower(data);
        loadRouterTransactions(data);
      }
    });
  }, [loadWalletData, loadBalance, loadTokenBalances, loadTransactions, loadVotingPower, loadRouterTransactions]);

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
                <IconButton onClick={() => handleCopy(walletAddress)}>
                  <ContentCopyIcon />
                </IconButton>
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
          <TokenBalances tokens={tokens} isLoading={loading.tokens} handleCopy={handleCopy} />
        </Grid>
  
        <Grid item xs={12}>
          <RecentTransactions transactions={transactions} isLoading={loading.transactions} handleCopy={handleCopy} />
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
          <RecentTrades routerTransactions={routerTransactions} isLoading={loading.routerTransactions} handleCopy={handleCopy} />
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