import { useEffect, useState, useRef } from "react";
import { Contract, ethers } from "ethers";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import ConnectWalletPage from "../pages/connectWalletPage";
import {
  getAccount,
  getFactory,
  getRouter,
  getNetwork,
  getWeth,
} from "./ethereumFunctions";
import COINS from "../constants/coins";
import * as chains from "../constants/chains";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a9d6d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9e9e9e",
      contrastText: "#ffffff",
    },
  },
});

const autoReconnectDelay = 5000;

const Web3Provider = (props) => {
  const [isConnected, setConnected] = useState(false);
  const [network, setNetwork] = useState({
    provider: null,
    signer: null,
    account: null,
    coins: [],
    chainID: null,
    router: null,
    factory: null,
    weth: null,
  });

  const backgroundListener = useRef(null);

  const setupConnection = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await getAccount();
      const chainId = await getNetwork(provider);

      if (chains.networks.includes(chainId)) {
        const router = await getRouter(chains.routerAddress.get(chainId), signer);
        const coins = COINS.get(chainId);
        const wethAddress = await router.WETH();
        const weth = getWeth(wethAddress, signer);
        const factory = await getFactory(await router.factory(), signer);

        setNetwork({
          provider,
          signer,
          account,
          coins: [{ ...coins[0], address: wethAddress }, ...coins.slice(1)],
          chainID: chainId,
          router,
          factory,
          weth,
        });
        setConnected(true);
      } else {
        console.log("Wrong network mate.");
        setConnected(false);
      }
    } catch (error) {
      console.log(error);
      setConnected(false);
    }
  };

  const createListener = () => {
    return setInterval(async () => {
      try {
        const account = await getAccount();
        if (account !== network.account) {
          await setupConnection();
        }
      } catch (error) {
        setConnected(false);
        await setupConnection();
      }
    }, 1000);
  };

  useEffect(() => {
    const init = async () => {
      await setupConnection();
      if (backgroundListener.current) {
        clearInterval(backgroundListener.current);
      }
      backgroundListener.current = createListener();
    };

    init();

    return () => {
      if (backgroundListener.current) {
        clearInterval(backgroundListener.current);
      }
    };
  }, [network.account, network.chainID, network.provider]); // Dependencies to trigger re-run

  const renderNotConnected = () => (
    <div className="App">
      <ConnectWalletPage />
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        {!isConnected && renderNotConnected()}
        {isConnected && <div>{props.render(network)}</div>}
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Web3Provider;
