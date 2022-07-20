import { NextUIProvider, createTheme, Grid } from "@nextui-org/react";
import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Loading } from '@nextui-org/react';

const Faucet = lazy(() => import("./components/Faucet"));
const Home = lazy(() => import("./components/Home"));
const KeplrConnect = lazy(() => import("./components/KeplrConnect"));
const SecretCli = lazy(() => import("./components/SecretCli"));

function App() {

  const theme = createTheme({
    type: "dark",
    theme: {
      colors: {
        background: '#00254d',

        gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
        link: '#06b7db',
      },
      space: {},
      fonts: {}
    }
  })
  
  return (
    <NextUIProvider theme={theme}>
      <Grid.Container gap={2} justify="left">
        <Grid xs={2}>
          <Navbar />
        </Grid>
        <Grid xs={9}>
          <Router>
            <Suspense fallback={<Loading/>}>
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
        </Grid>
      </Grid.Container>
      
      
    </NextUIProvider>
  );
}
export default App;