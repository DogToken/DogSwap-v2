import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Typography,
  styled,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useSnackbar } from "notistack";
import { getBalanceAndSymbol, getReserves, getDecimals } from "../../utils/ethereumFunctions";
import { addLiquidity, quoteAddLiquidity } from "../../utils/LiquidityFunctions";
import CoinField from "../Swap/CoinField";
import CoinDialog from "../Swap/CoinDialog";
import LoadingButton from "../LoadingButton";
import LiquidityInfoCard from "../../context/LiquidityInfoCard";
import { Contract, ethers } from "ethers";
import ERC20 from "./../../assets/abi/IERC20.json";

const StyledContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

function LiquidityDeployer(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);

  const [coin1, setCoin1] = useState({ address: undefined, symbol: undefined, balance: undefined });
  const [coin2, setCoin2] = useState({ address: undefined, symbol: undefined, balance: undefined });

  const [reserves, setReserves] = useState(["0.0", "0.0"]);
  const [field1Value, setField1Value] = useState("");
  const [field2Value, setField2Value] = useState("");
  const [loading, setLoading] = useState(false);
  const [liquidityTokens, setLiquidityTokens] = useState("");
  const [liquidityOut, setLiquidityOut] = useState([0, 0, 0]);

  const switchFields = () => {
    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(field2Value);
    setField2Value(field1Value);
    setReserves([reserves[1], reserves[0]]);
  };

  const handleChange = {
    field1: (e) => setField1Value(e.target.value),
    field2: (e) => setField2Value(e.target.value),
  };

  const formatBalance = (balance, symbol) => balance && symbol
    ? `${parseFloat(balance).toPrecision(8)} ${symbol}`
    : "0.0";

  const formatReserve = (reserve, symbol) => reserve && symbol
    ? `${reserve} ${symbol}`
    : "0.0";

  const isButtonEnabled = useCallback(() => {
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);
    return (
      coin1.address &&
      coin2.address &&
      !isNaN(parsedInput1) &&
      parsedInput1 > 0 &&
      !isNaN(parsedInput2) &&
      parsedInput2 > 0 &&
      parsedInput1 <= coin1.balance &&
      parsedInput2 <= coin2.balance
    );
  }, [coin1.address, coin1.balance, coin2.address, coin2.balance, field1Value, field2Value]);

  const deploy = () => {
    setLoading(true);
    addLiquidity(
      coin1.address,
      coin2.address,
      field1Value,
      field2Value,
      '0',
      '0',
      props.network.router,
      props.network.account,
      props.network.signer
    )
    .then(() => {
      setLoading(false);
      setField1Value("");
      setField2Value("");
      enqueueSnackbar("Deployment Successful", { variant: "success" });
    })
    .catch((e) => {
      setLoading(false);
      enqueueSnackbar(`Deployment Failed (${e.message})`, { variant: "error", autoHideDuration: 10000 });
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
      const getQuote = async () => {
        try {
          const token1 = new Contract(coin1.address, ERC20, props.network.signer);
          const token2 = new Contract(coin2.address, ERC20, props.network.signer);
  
          const [decimals1, decimals2] = await Promise.all([
            getDecimals(token1),
            getDecimals(token2)
          ]);
  
          const data = await quoteAddLiquidity(
            coin1.address,
            coin2.address,
            field1Value,
            field2Value,
            props.network.factory,
            props.network.signer
          );
  
          setLiquidityOut([
            ethers.utils.formatUnits(data[0], decimals1),
            ethers.utils.formatUnits(data[1], decimals2),
            ethers.utils.formatUnits(data[2], 18)  // LP tokens typically have 18 decimals
          ]);
        } catch (error) {
          console.error("Error getting quote:", error);
          setLiquidityOut([0, 0, 0]);
        }
      };
  
      getQuote();
    } else {
      setLiquidityOut([0, 0, 0]);
    }
  }, [coin1.address, coin2.address, field1Value, field2Value, props.network.factory, props.network.signer, isButtonEnabled]);

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
  
      if (coin1.address && props.network.account) {
        getBalanceAndSymbol(
          props.network.account,
          coin1.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => {
          setCoin1((prevCoin) => ({ ...prevCoin, balance: data.balance }));
        });
      }
  
      if (coin2.address && props.network.account) {
        getBalanceAndSymbol(
          props.network.account,
          coin2.address,
          props.network.provider,
          props.network.signer,
          props.network.weth.address,
          props.network.coins
        ).then((data) => {
          setCoin2((prevCoin) => ({ ...prevCoin, balance: data.balance }));
        });
      }
    }, 10000);
  
    return () => clearTimeout(coinTimeout);
  }, [coin1.address, coin2.address, props.network.account, props.network.factory, props.network.signer, props.network.provider, props.network.coins, props.network.weth.address]);
  
  return (
    <StyledContainer>
      <StyledTypography variant="h5" align="center">
        Liquidity Deployment
      </StyledTypography>

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

      <Grid container direction="column" spacing={3}>
        <Grid item>
          <CoinField
            activeField
            value={field1Value}
            onClick={() => setDialog1Open(true)}
            onChange={handleChange.field1}
            symbol={coin1.symbol ?? "Select"}
          />
        </Grid>

        <Grid item>
          <CoinField
            activeField
            value={field2Value}
            onClick={() => setDialog2Open(true)}
            onChange={handleChange.field2}
            symbol={coin2.symbol ?? "Select"}
          />
        </Grid>

        <Grid item>
          <LiquidityInfoCard
            balances={[
              formatBalance(coin1.balance, coin1.symbol),
              formatBalance(coin2.balance, coin2.symbol)
            ]}
            reserves={[
              formatReserve(reserves[0], coin1.symbol),
              formatReserve(reserves[1], coin2.symbol)
            ]}
            liquidityTokens={formatReserve(liquidityTokens, "UNI-V2")}
            poolTokensReceived={formatReserve(liquidityOut[2], "Pool Tokens")}
          />
        </Grid>

        <Grid item>
          <LoadingButton
            loading={loading}
            valid={isButtonEnabled()}
            success={false}
            fail={false}
            onClick={deploy}
          >
            <AccountBalanceIcon sx={{ marginRight: 1 }} />
            Deploy
          </LoadingButton>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default LiquidityDeployer;
