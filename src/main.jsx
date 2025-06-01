import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import FundDetail from "./components/FundDetail";
import SendPage from "./components/SendPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/funds/:symbol" element={<FundDetail />} />
      <Route path="/send" element={<SendPage />} />
    </Routes>
  </BrowserRouter>
);
