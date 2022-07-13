import { NextUIProvider } from "@nextui-org/react";
import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

const Faucet = lazy(() => import("./components/Faucet"));
const Home = lazy(() => import("./components/Home"));
const KeplrConnect = lazy(() => import("./components/KeplrConnect"));
const SecretCli = lazy(() => import("./components/SecretCli"));

function App() {
  
  return (
    <NextUIProvider>
      <Navbar />
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />}>
              Home
            </Route>
            <Route path="/keplr" element={<KeplrConnect />}>
              Connect Keplr
            </Route>
            <Route path="/faucet" element={<Faucet />}>
              Faucet
            </Route>
            <Route path="/secretcli" element={<SecretCli />}>
              SecretCli
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </NextUIProvider>
  );
}
export default App;