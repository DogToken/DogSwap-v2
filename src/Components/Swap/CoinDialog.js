import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogActions as MuiDialogActions,
  Grid,
  IconButton,
  TextField,
  Typography,
  styled,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import * as COLORS from '@mui/material/colors';
import COINS from '../../constants/coins';
import { ethers } from 'ethers'; // Ensure you have ethers installed
import { doesTokenExist } from '../../utils/ethereumFunctions'; // Ensure this import is correct

// Styled Dialog Container
const DialogContainer = styled(Dialog)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  backgroundColor: '#89b290',
  '& .MuiDialogContent-root': {
    padding: 0,
  },
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: '#89b290',
  },
}));

// Styled DialogTitle
const CustomDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${COLORS.grey[300]}`,
  backgroundColor: '#6a9d6d',
  borderTopLeftRadius: theme.spacing(2),
  borderTopRightRadius: theme.spacing(2),
}));

// Styled DialogActions
const CustomDialogActions = styled(MuiDialogActions)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1),
  backgroundColor: '#6a9d6d',
  borderBottomLeftRadius: theme.spacing(2),
  borderBottomRightRadius: theme.spacing(2),
}));

// Styled Container for Coin List
const CoinContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: '#d2e2d1',
  borderRadius: theme.spacing(1),
}));

// Styled Card for Coin Items
const CoinCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  boxShadow: `0px 4px 8px ${COLORS.grey[400]}`,
  cursor: 'pointer',
  padding: theme.spacing(1), // Added padding to the card
  '&:hover': {
    boxShadow: `0px 8px 16px ${COLORS.grey[500]}`,
  },
}));

// Styled CardMedia for Coin Logo
const CoinCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%', // Circular logo
  marginRight: theme.spacing(2), // Increased margin to the right
  backgroundColor: '#fff', // Optional: background color for better logo visibility
}));

// Styled CardContent for Coin Details
const CoinCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  flex: 1,
  '&:last-child': {
    paddingBottom: theme.spacing(1),
  },
}));

// Styled TextField for Address Input
const AddressTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

export default function CoinDialog({ onClose, open, coins, signer }) {
  const [address, setAddress] = React.useState('');
  const [error, setError] = React.useState('');

  const isValidAddress = (address) => {
    return ethers.utils.isAddress(address);
  };

  const submit = async () => {
    setError('');

    if (address.trim() === '') {
      setError('Address cannot be empty');
      return;
    }

    if (!isValidAddress(address)) {
      setError('Invalid Ethereum address');
      return;
    }

    try {
      if (await doesTokenExist(address, signer)) {
        exit(address);
      } else {
        setError('This address is not valid');
      }
    } catch (e) {
      console.error('Error:', e);
      setError('An error occurred while validating the token');
    }
  };

  const exit = async (value) => {
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
          setError('Failed to add asset to wallet');
        }
      }
    }
    setAddress('');
    onClose(value);
  };

  return (
    <DialogContainer
      open={open}
      onClose={() => exit(undefined)}
      fullWidth
      maxWidth="sm"
    >
      <CustomDialogTitle>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Select Coin
        </Typography>
        <IconButton aria-label="close" onClick={() => exit(undefined)}>
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
      </CustomDialogTitle>

      <CoinContainer>
        <AddressTextField
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          placeholder="Paste Address"
          error={!!error}
          helperText={error}
          fullWidth
        />
        <Grid container direction="column" spacing={1}>
          {coins.map((coin, index) => (
            <Grid item key={index}>
              <CoinCard onClick={() => exit(coin.address)}>
                <CoinCardMedia
                  component="img"
                  image={coin.logoUrl}
                  alt={coin.name}
                />
                <CoinCardContent>
                  <Typography variant="h6">{coin.abbr}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {coin.name}
                  </Typography>
                </CoinCardContent>
              </CoinCard>
            </Grid>
          ))}
        </Grid>
      </CoinContainer>

      <CustomDialogActions>
        <Button autoFocus onClick={submit} color="primary">
          Enter
        </Button>
      </CustomDialogActions>
    </DialogContainer>
  );
}

CoinDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  coins: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      abbr: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      logoUrl: PropTypes.string,
    })
  ).isRequired,
  signer: PropTypes.object,
};
