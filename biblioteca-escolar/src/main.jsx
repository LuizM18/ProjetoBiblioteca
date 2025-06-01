import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import 'animate.css/animate.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import "./styles/custom.css";
// IMPORTANTE: REMOVA A LINHA DE IMPORTAÇÃO DO LoginProvider AQUI!
// import { LoginProvider } from './context/LoginContext.jsx'; // <<-- REMOVA ESTA LINHA

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/* APENAS O APP AQUI */}
  </React.StrictMode>
);