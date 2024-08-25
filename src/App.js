import React from "react";
import "./styles/App.css";
import Web3Provider from "./utils/network";
import NarBar from "./Components/NavBar/NavBar";
import CoinSwapper from "./pages/Swap";
import Pools from "./pages/Pools";
import { Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Liquidity from "./pages/Liquidity";
import { createTheme, ThemeProvider } from "@mui/material";

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
  return (
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
                  <Route path="/pools" element={<Pools network={network} />} />
                  <Route path="*" element={<CoinSwapper network={network} />} />
                </Routes>
              </div>
            )}
          />
        </ThemeProvider>
      </SnackbarProvider>
    </div>
  );
};

export default App;
