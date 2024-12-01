import React, { useEffect, useState } from "react";
import { Grid, InputAdornment, Typography, styled, Box, Paper, Chip, Button, TextField } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSnackbar } from "notistack";
import { getBalanceAndSymbol, getReserves } from "../../utils/ethereumFunctions";
import { removeLiquidity, quoteRemoveLiquidity } from "../../utils/LiquidityFunctions";
import CoinDialog from "../Swap/CoinDialog";
import LoadingButton from "../LoadingButton";
import WrongNetwork from "../wrongNetwork";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px', // Increased width
  margin: '0 auto',
}));

const MaxButton = styled(Button)(({ theme }) => ({
  minWidth: '64px',
  height: '32px',
  padding: theme.spacing(0, 1),
  fontSize: '0.875rem',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const TokenSelectorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(1),
  margin: theme.spacing(1),
  padding: theme.spacing(1.5),
  textTransform: 'none',
  width: '150px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const TokenSelectorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const ButtonIcon = styled(ArrowDownwardIcon)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const InfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  textAlign: 'center',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  marginTop: theme.spacing(1),
  fontSize: '0.85rem',
}));

const AmountTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInput-input': {
    color: theme.palette.primary.contrastText,
  },
}));

function LiquidityRemover(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [wrongNetworkOpen] = useState(false);

  const [coin1, setCoin1] = useState({ address: undefined, symbol: undefined, balance: undefined });
  const [coin2, setCoin2] = useState({ address: undefined, symbol: undefined, balance: undefined });
  const [reserves, setReserves] = useState(["0.0", "0.0"]);
  const [field1Value, setField1Value] = useState("");
  const [loading, setLoading] = useState(false);
  const [liquidityTokens, setLiquidityTokens] = useState("");
  const [tokensOut, setTokensOut] = useState([0, 0, 0]);

  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setReserves([reserves[1], reserves[0]]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setField1Value(value);
    }
  };
  const formatBalance = (balance, symbol) => balance && symbol
    ? `${parseFloat(balance).toPrecision(8)} ${symbol}`
    : "0.0";

  const formatReserve = (reserve, symbol) => reserve && symbol
    ? `${reserve} ${symbol}`
    : "0.0";

  const isButtonEnabled = () => {
    const parsedInput = parseFloat(field1Value);
    return coin1.address && coin2.address && !isNaN(parsedInput) && parsedInput > 0 && parsedInput <= liquidityTokens;
  };

  const handleMaxClick = () => {
    if (liquidityTokens) {
      setField1Value(liquidityTokens);
    }
  };

  const remove = () => {
    setLoading(true);
    // Ensure field1Value is passed as a string
    const stringValue = field1Value.toString();
    removeLiquidity(
      coin1.address,
      coin2.address,
      stringValue,
      "0", // Convert minimum amounts to strings
      "0",
      props.network.router,
      props.network.account,
      props.network.signer,
      props.network.factory
    )
      .then(() => {
        setLoading(false);
        setField1Value("");
        enqueueSnackbar("Removal Successful", { variant: "success" });
      })
      .catch((e) => {
        setLoading(false);
        console.error("Removal error:", e);
        enqueueSnackbar(`Removal Failed: ${e.message || "Unknown error"}`, { 
          variant: "error", 
          autoHideDuration: 10000 
        });
      });
  };

  const onToken1Selected = (address) => {
    setDialog1Open(false);
    if (address === coin2.address) {
      switchFields();
    } else if (address) {
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => setCoin1({ address, symbol: data.symbol, balance: data.balance }));
    }
  };

  const onToken2Selected = (address) => {
    setDialog2Open(false);
    if (address === coin1.address) {
      switchFields();
    } else if (address) {
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => setCoin2({ address, symbol: data.symbol, balance: data.balance }));
    }
  };

  useEffect(() => {
    if (coin1.address && coin2.address && props.network.account) {
      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then((data) => {
        setReserves([data[0], data[1]]);
        setLiquidityTokens(data[2]);
      });
    }
  }, [coin1.address, coin2.address, props.network.account, props.network.factory, props.network.signer]);

  useEffect(() => {
    if (isButtonEnabled()) {
      const stringValue = field1Value.toString();
      quoteRemoveLiquidity(
        coin1.address,
        coin2.address,
        stringValue,
        props.network.factory,
        props.network.signer
      )
        .then((data) => setTokensOut(data))
        .catch((error) => {
          console.error("Quote error:", error);
          setTokensOut([0, 0, 0]);
        });
    }
  }, [coin1.address, coin2.address, field1Value, props.network.factory, props.network.signer]);


  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      if (coin1.address && coin2.address && props.network.account) {
        getReserves(
          coin1.address,
          coin2.address,
          props.network.factory,
          props.network.signer,
          props.network.account
        ).then((data) => {
          setReserves([data[0], data[1]]);
          setLiquidityTokens(data[2]);
        });
      }

      if (coin1.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => setCoin1((prevCoin) => ({ ...prevCoin, balance: data.balance })));
      }
      if (coin2.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => setCoin2((prevCoin) => ({ ...prevCoin, balance: data.balance })));
      }
    }, 10000);

    return () => clearTimeout(coinTimeout);
  }, [coin1.address, coin2.address, props.network.account, wrongNetworkOpen]);

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>Remove Liquidity</Typography>

      <CoinDialog
        open={dialog1Open}
        onClose={onToken1Selected}
        coins={props.network.coins}
        signer={props.network.signer}
      />
      <CoinDialog
        open={dialog2Open}
        onClose={onToken2Selected}
        coins={props.network.coins}
        signer={props.network.signer}
      />
      <WrongNetwork open={wrongNetworkOpen} />

      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <TokenSelectorContainer>
            <TokenSelectorButton onClick={() => setDialog1Open(true)}>
              {coin1.symbol || "Select Token 1"}
            </TokenSelectorButton>
            <ButtonIcon fontSize="small" />
            <TokenSelectorButton onClick={() => setDialog2Open(true)}>
              {coin2.symbol || "Select Token 2"}
            </TokenSelectorButton>
          </TokenSelectorContainer>
        </Grid>

        {(coin1.address && coin2.address) && (
          <StyledPaper>
            <Grid container direction="column" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" align="center">Your Balances</Typography>
                <Grid container spacing={2} direction="row" justifyContent="space-between">
                  <Grid item xs={6}>
                    <InfoSection>
                      <StyledChip label={formatBalance(coin1.balance, coin1.symbol)} />
                    </InfoSection>
                  </Grid>
                  <Grid item xs={6}>
                    <InfoSection>
                      <StyledChip label={formatBalance(coin2.balance, coin2.symbol)} />
                    </InfoSection>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" align="center">Reserves</Typography>
                <Grid container spacing={2} direction="row" justifyContent="space-between">
                  <Grid item xs={6}>
                    <InfoSection>
                      <StyledChip label={formatReserve(reserves[0], coin1.symbol)} />
                    </InfoSection>
                  </Grid>
                  <Grid item xs={6}>
                    <InfoSection>
                      <StyledChip label={formatReserve(reserves[1], coin2.symbol)} />
                    </InfoSection>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" align="center">Your Liquidity Pool Tokens</Typography>
                <InfoSection>
                  <StyledChip label={formatReserve(liquidityTokens, "UNI-V2")} />
                </InfoSection>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" align="center">Tokens Out</Typography>
                <Grid container spacing={2} direction="row" justifyContent="space-between">
                  <Grid item xs={6}>
                    <InfoSection>
                      <StyledChip label={formatBalance(tokensOut[1], coin1.symbol)} />
                    </InfoSection>
                  </Grid>
                  <Grid item xs={6}>
                    <InfoSection>
                      <StyledChip label={formatBalance(tokensOut[2], coin2.symbol)} />
                    </InfoSection>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <AmountTextField
                  label="Amount of LP to remove"
                  value={field1Value}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MaxButton
                          onClick={handleMaxClick}
                          variant="contained"
                          size="small"
                        >
                          Max
                        </MaxButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <LoadingButton
                  loading={loading}
                  valid={isButtonEnabled()}
                  success={false}
                  fail={false}
                  onClick={remove}
                >
                  Remove
                </LoadingButton>
              </Grid>
            </Grid>
          </StyledPaper>
        )}
      </Grid>
    </div>
  );
}

export default LiquidityRemover;
