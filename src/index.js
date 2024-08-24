import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import "bootstrap/dist/css/bootstrap.css";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

// Create a root container for the app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
