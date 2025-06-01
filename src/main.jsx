import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import FundDetail from "./components/FundDetail";
import SendPage from "./components/SendPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: "1.1rem",
          padding: "1rem",
          background: "#ffffff",
          color: "#333333"
        },
        success: {
          iconTheme: {
            primary: "#059669",
            secondary: "#ffffff"
          }
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff"
          }
        }
      }}
    />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/funds/:symbol" element={<FundDetail />} />
      <Route path="/send" element={<SendPage />} />
    </Routes>
  </BrowserRouter>
);
