import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
  styled,
  Box,
} from "@mui/material";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";
import { useSnackbar } from "notistack";
import LoopIcon from "@mui/icons-material/Loop";
import {
  getBalanceAndSymbol,
  getReserves,
  getAmountOut,
  swapTokens,
} from "../utils/ethereumFunctions";
import CoinField from "../Components/Swap/CoinField";
import CoinDialog from "../Components/Swap/CoinDialog";
import LoadingButton from "../Components/LoadingButton";
import WrongNetwork from "../Components/wrongNetwork";

const PaperContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
  width: '100%',
}));

const SwitchButton = styled(IconButton)(({ theme }) => ({
  zIndex: 1,
  margin: "-8px",
  padding: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const FullWidthGrid = styled(Grid)({
  width: "100%",
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontSize: "1.25rem",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const HR = styled("hr")(({ theme }) => ({
  width: "100%",
  border: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(2, 0),
}));

const BalanceTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  overflowWrap: "break-word",
  textAlign: "center",
  color: "#666",
}));

const FooterContainer = styled(Grid)({
  marginTop: "auto",
  width: "100%",
});

function CoinSwapper(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [wrongNetworkOpen, setWrongNetworkOpen] = useState(false);
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

  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(field2Value);
    setReserves([...reserves].reverse());
  };

  const handleChange = {
    field1: (e) => setField1Value(e.target.value),
  };

  const formatBalance = (balance, symbol) =>
    balance && symbol ? `${parseFloat(balance).toPrecision(8)} ${symbol}` : "0.0";

  const formatReserve = (reserve, symbol) =>
    reserve && symbol ? `${reserve} ${symbol}` : "0.0";

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
      ).then((data) => {
        setCoin1({
          address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
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
      ).then((data) => {
        setCoin2({
          address,
          symbol: data.symbol,
          balance: data.balance,
        });
      });
    }
  };

  const swap = () => {
    console.log("Attempting to swap tokens...");
    setLoading(true);

    swapTokens(
      coin1.address,
      coin2.address,
      field1Value,
      props.network.router,
      props.network.account,
      props.network.signer
    )
      .then(() => {
        setLoading(false);
        setField1Value("");
        enqueueSnackbar("Transaction Successful", { variant: "success" });
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar(`Transaction Failed (${e.message})`, {
          variant: "error",
          autoHideDuration: 10000,
        });
      });
  };

  useEffect(() => {
    if (coin1.address && coin2.address) {
      console.log(
        `Trying to get Reserves between:\n${coin1.address}\n${coin2.address}`
      );

      getReserves(
        coin1.address,
        coin2.address,
        props.network.factory,
        props.network.signer,
        props.network.account
      ).then((data) => setReserves(data));
    }
  }, [coin1.address, coin2.address, props.network.factory, props.network.signer, props.network.account]);

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
        .catch((e) => {
          console.log(e);
          setField2Value("NA");
        });
    } else {
      setField2Value("");
    }
  }, [field1Value, coin1.address, coin2.address, props.network.router, props.network.signer]);

  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      console.log("Checking balances...");

      if (coin1.address && coin2.address && props.network.account) {
        getReserves(
          coin1.address,
          coin2.address,
          props.network.factory,
          props.network.signer,
          props.network.account
        ).then((data) => setReserves(data));
      }

      if (coin1.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) =>
          setCoin1((prevCoin1) => ({
            ...prevCoin1,
            balance: data.balance,
          }))
        );
      }
      if (coin2.address && props.network.account && !wrongNetworkOpen) {
        getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) =>
          setCoin2((prevCoin2) => ({
            ...prevCoin2,
            balance: data.balance,
          }))
        );
      }
    }, 10000);

    return () => clearTimeout(coinTimeout);
  }, [coin1.address, coin2.address, props.network, wrongNetworkOpen]);

  return (
    <Box>
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

      <Container maxWidth="sm">
        <PaperContainer>
          <TitleTypography variant="h5">Swap Coins</TitleTypography>

          <Grid container direction="column" alignItems="center" spacing={2}>
            <FullWidthGrid item xs={12}>
              <CoinField
                activeField
                value={field1Value}
                onClick={() => setDialog1Open(true)}
                onChange={handleChange.field1}
                symbol={coin1.symbol || "Select"}
              />
            </FullWidthGrid>

            <SwitchButton onClick={switchFields}>
              <SwapVerticalCircleIcon sx={{ fontSize: 40 }} />
            </SwitchButton>

            <FullWidthGrid item xs={12}>
              <CoinField
                value={field2Value}
                onClick={() => setDialog2Open(true)}
                symbol={coin2.symbol || "Select"}
              />
            </FullWidthGrid>
          </Grid>

          <HR />

          <BalanceTypography variant="body2">
            <strong>Coin 1 Balance: </strong>
            {formatBalance(coin1.balance, coin1.symbol)}
          </BalanceTypography>

          <BalanceTypography variant="body2">
            <strong>Coin 2 Balance: </strong>
            {formatBalance(coin2.balance, coin2.symbol)}
          </BalanceTypography>

          <HR />

          <BalanceTypography variant="body2">
            <strong>Reserves: </strong>
            {`${formatReserve(reserves[0], coin1.symbol)} / ${formatReserve(
              reserves[1],
              coin2.symbol
            )}`}
          </BalanceTypography>

          <Grid container direction="column" alignItems="center">
            <FooterContainer item>
              <LoadingButton
                color="primary"
                size="large"
                variant="contained"
                onClick={swap}
                loading={loading}
                disabled={!isButtonEnabled()}
                startIcon={<LoopIcon />}
                text="Swap"
              />
            </FooterContainer>
          </Grid>
        </PaperContainer>
      </Container>
    </Box>
  );
}

export default CoinSwapper;
