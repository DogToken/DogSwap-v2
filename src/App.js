import React from "react";
import "./styles/App.css";
import ReactGA from 'react-ga4';
import Web3Provider from "./utils/network";
import Home from "./pages/Home";
import NarBar from "./Components/NavBar/NavBar";
import Stake from "./pages/Stake"
import Footer from "./Components/Footer/Footer";
import CoinSwapper from "./pages/Swap";
import Pools from "./pages/Pools";
import Dash from "./pages/Dash";
import Transactions from "./pages/Transactions";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Control from "./pages/Control";
import BonePools from "./pages/BonePools";
import Featured from "./Components/Pools/Featured";
import FAQ from "./pages/FAQ"
import { Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./pages/Liquidity";
import PoolStats from "./pages/PoolStats";
import AllPoolStats from "./pages/AllPoolStats";
import PortfolioTracker from "./pages/Portfolio.js";
import { createTheme, ThemeProvider } from "@mui/material";

import { Context } from "./Context.js";
import axios from 'axios';
import { getBonePriceInUSD, getBonePriceInMintMe } from './utils/priceUtils';

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

const App = () => {
  ReactGA.initialize('G-823N1D2MNZ');

  const [mintMePriceInUsd, setMintMePriceInUsd] = React.useState("mintMePriceInUsd");
  const [bonePriceInMintMe, setBonePriceInMintMe] = React.useState("bonePriceInMintMe");
  const [bonePriceInUSD, setBonePriceInUSD] = React.useState("bonePriceInUSD");

  React.useEffect(() => {
    const getPrices = async function() {
      setMintMePriceInUsd(0);
      setBonePriceInUSD(0);

      try {
        // Fetch MintMe price
        let response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=webchain&vs_currencies=usd`);
        if(response.status === 200) {
          setMintMePriceInUsd(response.data['webchain']?.usd);
          setBonePriceInMintMe(await getBonePriceInMintMe());
          setBonePriceInUSD(await getBonePriceInUSD(response.data['webchain']?.usd));
        }
      } catch (error) {
        console.error("Can't fetch price");
      }
    }

    getPrices();
    const interval = setInterval(getPrices, 60000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Context.Provider 
      value={{
        mintMePriceInUsdState: [mintMePriceInUsd, setMintMePriceInUsd],
        bonePriceInMintMeState: [bonePriceInMintMe, setBonePriceInMintMe],
        bonePriceInUSDState: [bonePriceInUSD, setBonePriceInUSD]
      }}
    >
      <div className="App">
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={theme}>
            <Web3Provider
              render={(network) => (
                <div>
                  <NarBar />
                  <Routes>
                    <Route path="/swap" element={<CoinSwapper network={network} />} />
                    <Route path="/liquidity" element={<Liquidity network={network} />} />
                    <Route path="/stake" element={<Stake network={network} />} />
                    <Route path="/pools" element={<Pools network={network} />} />
                    <Route path="/dash" element={<Dash network={network} />} />
                    <Route path="/featured" element={<Featured network={network} />} />
                    <Route path="/transactions" element={<Transactions network={network} />} />
                    <Route path="/terms" element={<Terms network={network} />} />
                    <Route path="/privacy" element={<Privacy network={network} />} />
                    <Route path="/cookies" element={<Cookies network={network} />} />
                    <Route path="/faq" element={<FAQ network={network} />} />
                    <Route path="/control" element={<Control network={network} />} />
                    <Route path="/bonepools" element={<BonePools network={network} />} />
                    <Route path="/poolstats" element={<PoolStats network={network} />} />
                    <Route path="/allpoolstats" element={<AllPoolStats network={network} />} />
                    <Route path="/portfolio" element={<PortfolioTracker network={network} />} />
                    <Route path="*" element={<CoinSwapper network={network} />} />
                  </Routes>
                  <Footer />
                </div>
              )}
            />
          </ThemeProvider>
        </SnackbarProvider>
      </div>
    </Context.Provider>
  );
};

export default App;
