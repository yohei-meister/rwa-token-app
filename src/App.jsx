import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import FundDetail from "./pages/FundDetail";
import { FundProvider } from "./contexts/FundContext";

function App() {
  return (
    <Router>
      <FundProvider>
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
          <Route path="/" element={<Home />} />
          <Route path="/funds/:symbol" element={<FundDetail />} />
        </Routes>
      </FundProvider>
    </Router>
  );
}

export default App;
