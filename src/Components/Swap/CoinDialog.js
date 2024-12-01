import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Button,
  Box,
  Divider,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ethers } from 'ethers';
import { doesTokenExist } from '../../utils/ethereumFunctions';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    maxWidth: 400,
    width: '100%',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledList = styled(List)(({ theme }) => ({
  maxHeight: 300,
  overflow: 'auto',
  '& .MuiListItem-root': {
    transition: theme.transitions.create(['background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      boxShadow: theme.shadows[1],
    },
  },
}));

const CoinDialog = ({ onClose, open, coins, signer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setFilteredCoins(
      coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.abbr.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, coins]);

  const handleSelectCoin = async (coin) => {
    onClose(coin.address);
  };

  const handleCustomAddressSubmit = async () => {
    setError('');
    if (!ethers.utils.isAddress(address)) {
      setError('Invalid Ethereum address');
      return;
    }

    try {
      if (await doesTokenExist(address, signer)) {
        onClose(address);
      } else {
        setError('This address is not a valid token');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('An error occurred while validating the token');
    }
  };

  const addTokenToWallet = async (coin) => {
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      
      try {
        // Attempt to get the token contract
        const tokenContract = new ethers.Contract(
          coin.address,
          ['function decimals() view returns (uint8)'],
          provider
        );

        let tokenDecimals;
        try {
          // Try to get the decimals from the contract
          tokenDecimals = await tokenContract.decimals();
        } catch (error) {
          console.warn('Failed to fetch decimals from contract, using provided value or default:', error);
          // If fetching from contract fails, use the provided decimals or default to 18
          tokenDecimals = coin.decimals || 18;
        }

        await provider.send('wallet_watchAsset', {
          type: 'ERC20',
          options: {
            address: coin.address,
            symbol: coin.abbr,
            decimals: tokenDecimals,
            image: coin.logoUrl,
          },
        });
        setSnackbarMessage(`${coin.abbr} token added to wallet successfully!`);
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error adding token to wallet:', error);
        setSnackbarMessage(`Failed to add ${coin.abbr} token to wallet. Please try again.`);
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage('No Ethereum wallet detected. Please install MetaMask or another web3 wallet.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <StyledDialog open={open} onClose={() => onClose()} fullWidth>
        <StyledDialogTitle>
          Select Coin
          <IconButton
            aria-label="close"
            onClick={() => onClose()}
            sx={{ color: (theme) => theme.palette.primary.contrastText }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
          </Box>
          <StyledList>
            {filteredCoins.map((coin) => (
              <ListItem
                key={coin.address}
                button
                onClick={() => handleSelectCoin(coin)}
              >
                <ListItemAvatar>
                  <Avatar src={coin.logoUrl} alt={coin.name}>
                    {coin.abbr[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={coin.abbr}
                  secondary={coin.name}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Import to wallet">
                    <IconButton edge="end" aria-label="import" onClick={(e) => {
                      e.stopPropagation();
                      addTokenToWallet(coin);
                    }}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </StyledList>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Add Custom Token
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Custom token address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCustomAddressSubmit}
          >
            Add Custom Token
          </Button>
        </DialogContent>
      </StyledDialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default CoinDialog;