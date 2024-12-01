import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  getBalanceAndSymbol,
  getReserves,
  getAmountOut,
  swapTokens,
} from "../utils/ethereumFunctions";
import CoinDialog from "../Components/Swap/CoinDialog";
import WrongNetwork from "../Components/wrongNetwork";

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[10],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }
}));

const SwapButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'rotate(180deg)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

const CoinContainer = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.4),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    background: alpha(theme.palette.background.paper, 0.6),
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& input': {
    fontSize: '1.5rem',
    fontWeight: '500',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: '600',
  textTransform: 'none',
  minHeight: 56,
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
  fontSize: '0.875rem',
}));


function CoinSwapper(props) {
  const theme = useTheme();
  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [wrongNetworkOpen] = useState(false);
  const [coin1, setCoin1] = useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [coin2, setCoin2] = useState({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });
  const [reserves, setReserves] = useState(["0.0", "0.0"]);
  const [field1Value, setField1Value] = useState("");
  const [field2Value, setField2Value] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFieldChange = (event) => {
    setField1Value(event.target.value);
    setError("");
  };

  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(field2Value);
    setReserves([...reserves].reverse());
  };

  const formatBalance = (balance, symbol) =>
    balance && symbol ? `${parseFloat(balance).toPrecision(8)} ${symbol}` : "0.0";

  const isButtonEnabled = () => {
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);
    return (
      coin1.address &&
      coin2.address &&
      !isNaN(parsedInput1) &&
      !isNaN(parsedInput2) &&
      parsedInput1 > 0 &&
      parsedInput1 <= coin1.balance
    );
  };

  const onToken1Selected = async (address) => {
    setDialog1Open(false);
    if (address === coin2.address) {
      switchFields();
    } else if (address) {
      try {
        const data = await getBalanceAndSymbol(
          props.network.account,
          address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        );
        setCoin1({
          address,
          symbol: data.symbol,
          balance: data.balance,
        });
      } catch (err) {
        setError("Failed to fetch token details");
      }
    }
  };

  const onToken2Selected = async (address) => {
    setDialog2Open(false);
    if (address === coin1.address) {
      switchFields();
    } else if (address) {
      try {
        const data = await getBalanceAndSymbol(
          props.network.account,
          address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        );
        setCoin2({
          address,
          symbol: data.symbol,
          balance: data.balance,
        });
      } catch (err) {
        setError("Failed to fetch token details");
      }
    }
  };

  const swap = async () => {
    setLoading(true);
    setError("");
    try {
      await swapTokens(
        coin1.address,
        coin2.address,
        field1Value,
        props.network.router,
        props.network.account,
        props.network.signer
      );
      setField1Value("");
    } catch (err) {
      setError(err.message || "Swap failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coin1.address && coin2.address) {
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then(setReserves);
    }
  }, [coin1.address, coin2.address, props.network]);

  useEffect(() => {
    if (isNaN(parseFloat(field1Value))) {
      setField2Value("");
    } else if (parseFloat(field1Value) && coin1.address && coin2.address) {
      getAmountOut(
        coin1.address,
        coin2.address,
        field1Value,
        props.network.router,
        props.network.signer
      )
        .then((amount) => setField2Value(amount.toFixed(7)))
        .catch(() => setField2Value("NA"));
    } else {
      setField2Value("");
    }
  }, [field1Value, coin1.address, coin2.address, props.network]);

  useEffect(() => {
    const updateBalances = async () => {
      if (!props.network.account || wrongNetworkOpen) return;

      if (coin1.address) {
        const data = await getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        );
        setCoin1(prev => ({ ...prev, balance: data.balance }));
      }

      if (coin2.address) {
        const data = await getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        );
        setCoin2(prev => ({ ...prev, balance: data.balance }));
      }
    };

    const interval = setInterval(updateBalances, 10000);
    return () => clearInterval(interval);
  }, [coin1.address, coin2.address, props.network, wrongNetworkOpen]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <StyledPaper elevation={3}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Swap Tokens
        </Typography>

        <Box sx={{ mt: 4 }}>
          <CoinContainer>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <StyledTextField
                  fullWidth
                  type="number"
                  value={field1Value}
                  onChange={handleFieldChange}
                  placeholder="0.0"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => setDialog1Open(true)}
                        variant="contained"
                        sx={{ ml: 1 }}
                      >
                        {coin1.symbol || "Select"}
                      </Button>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <InfoTypography>
              Balance: {formatBalance(coin1.balance, coin1.symbol)}
            </InfoTypography>
          </CoinContainer>

          <Box display="flex" justifyContent="center" my={-1} sx={{ position: 'relative', zIndex: 1 }}>
            <SwapButton onClick={switchFields} size="large">
              <SwapVertIcon />
            </SwapButton>
          </Box>

          <CoinContainer>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <StyledTextField
                  fullWidth
                  type="number"
                  value={field2Value}
                  placeholder="0.0"
                  disabled
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => setDialog2Open(true)}
                        variant="contained"
                        sx={{ ml: 1 }}
                      >
                        {coin2.symbol || "Select"}
                      </Button>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <InfoTypography>
              Balance: {formatBalance(coin2.balance, coin2.symbol)}
            </InfoTypography>
          </CoinContainer>

          {/* Liquidity Display */}
          <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.background.paper, 0.4), borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Pool Liquidity
            </Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={50} // Calculate actual ratio here
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption">
                {reserves[0]} {coin1.symbol}
              </Typography>
              <Typography variant="caption">
                {reserves[1]} {coin2.symbol}
              </Typography>
            </Box>
          </Box>

          <Collapse in={Boolean(error)}>
            <Alert 
              severity="error" 
              sx={{ mt: 2 }}
              icon={<WarningAmberIcon />}
            >
              {error}
            </Alert>
          </Collapse>

          <ActionButton
            fullWidth
            variant="contained"
            disabled={!isButtonEnabled() || loading}
            onClick={swap}
            sx={{ mt: 3 }}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Swapping..." : "Swap Tokens"}
          </ActionButton>
        </Box>
      </StyledPaper>

      {dialog1Open && (
        <CoinDialog
          open={dialog1Open}
          onClose={onToken1Selected}
          coins={props.network.coins}
          signer={props.network.signer}
        />
      )}
      {dialog2Open && (
        <CoinDialog
          open={dialog2Open}
          onClose={onToken2Selected}
          coins={props.network.coins}
          signer={props.network.signer}
        />
      )}
      {wrongNetworkOpen && <WrongNetwork open={wrongNetworkOpen} />}
    </Container>
  );
}

export default CoinSwapper;