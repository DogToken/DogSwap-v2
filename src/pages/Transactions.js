import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Container, Typography, CircularProgress, Grid, Paper
} from '@mui/material';
import { styled } from '@mui/system';

// Styled components
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

const TransactionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    connectToWallet();
  }, []);

  const connectToWallet = async () => {
    try {
      // Request access to MetaMask accounts
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      // Get the connected account (wallet address)
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Fetch recent transactions after getting the address
      fetchTransactions(provider, address);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError('Failed to connect to MetaMask wallet.');
      setLoading(false);
    }
  };

  const fetchTransactions = async (provider, walletAddress) => {
    try {
      // Fetch the latest block number
      const latestBlock = await provider.getBlockNumber();

      // Scan the last 100 blocks (adjust this as needed)
      const startBlock = latestBlock - 100;
      const txs = [];

      for (let i = latestBlock; i >= startBlock; i--) {
        const block = await provider.getBlockWithTransactions(i);

        // Filter transactions for the wallet address
        const filteredTxs = block.transactions.filter(tx =>
          tx.from.toLowerCase() === walletAddress.toLowerCase() ||
          tx.to?.toLowerCase() === walletAddress.toLowerCase()
        );

        txs.push(...filteredTxs);
      }

      setTransactions(txs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions.');
      setLoading(false);
    }
  };

  return (
    <RootContainer>
      <TitleTypography variant="h4">Recent Transactions</TitleTypography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <Grid item xs={12} key={index}>
                <TransactionPaper>
                  <Typography variant="body1">
                    <strong>Hash:</strong> {tx.hash}
                  </Typography>
                  <Typography variant="body1">
                    <strong>From:</strong> {tx.from}
                  </Typography>
                  <Typography variant="body1">
                    <strong>To:</strong> {tx.to ? tx.to : 'Contract Creation'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Value:</strong> {ethers.utils.formatEther(tx.value.toString())} ETH
                  </Typography>
                  <Typography variant="body1">
                    <strong>Block Number:</strong> {tx.blockNumber}
                  </Typography>
                </TransactionPaper>
              </Grid>
            ))
          ) : (
            <Typography>No recent transactions found.</Typography>
          )}
        </Grid>
      )}
    </RootContainer>
  );
}
