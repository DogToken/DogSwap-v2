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
  Avatar,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { ethers } from 'ethers';
import { doesTokenExist } from '../../utils/ethereumFunctions';
import COINS from '../../constants/coins';

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
    await addTokenToWallet(coin.address);
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
        await addTokenToWallet(address);
        onClose(address);
      } else {
        setError('This address is not a valid token');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('An error occurred while validating the token');
    }
  };

  const addTokenToWallet = async (value) => {
    const coinCanAdd = COINS.get(window.chainId);
    if (coinCanAdd && window.ethereum) {
      const info = coinCanAdd.find((x) => x.address === value);
      const added = localStorage.getItem(value) || (info && info.abbr === 'MINTME');
      if (!added && info) {
        try {
          const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: value,
                symbol: info.abbr,
                decimals: info.decimals || 18,
                image: `https://dogswap.xyz/images/coins/${info.abbr.toLowerCase()}.png`,
              },
            },
          });
          if (wasAdded) {
            localStorage.setItem(value, 'done');
          }
        } catch (error) {
          console.error('Error adding asset:', error);
        }
      }
    }
  };

  return (
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
  );
};

export default CoinDialog;