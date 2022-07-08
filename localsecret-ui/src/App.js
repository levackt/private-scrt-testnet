import { NextUIProvider } from "@nextui-org/react";
import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

const Faucet = lazy(() => import("./components/Faucet"));
const Home = lazy(() => import("./components/Home"));

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
            <Route path="/faucet" element={<Faucet />}>
              Faucet
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </NextUIProvider>
  );
}
export default App;