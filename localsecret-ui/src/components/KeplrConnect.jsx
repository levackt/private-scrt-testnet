import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row } from "@nextui-org/react";
import { SecretNetworkClient } from "secretjs";
import { GRPCWEB_URL, CHAIN_ID, CHAIN_NAME, RPC_URL, LCD_URL, MINIMAL_DENOM, DENOM } from "../constants/constants";
import { Loading } from '@nextui-org/react';

export default function KeplrConnect() {
  const [myAddress, setMyAddress] = useState("");
  const [myBalance, setMyBalance] = useState("");
  const [keplrEnabled, setKeplrEnabled] = useState(false);

  //listen for account changes
  window.addEventListener("keplr_keystorechange", async () => {
    await refreshAccount();
  });

  // try to enable the chain-id if it doesn't exist in the wallet
  useEffect(() => {
    const getKeplr = async () => {
      if (window.keplr) {
        try {
          await window.keplr.enable(CHAIN_ID);
          setKeplrEnabled(true);
        } catch (err) {
          console.warn(`failed to enable chain-id: ${CHAIN_ID}`, err);
          setKeplrEnabled(false);
          return;
        }
      }
      await refreshAccount();
    };

    getKeplr();
    return () => {};
  }, []);

  async function refreshAccount() {
    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);

    const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
    setMyAddress(myAddress);

    const secretjs = await SecretNetworkClient.create({
      grpcWebUrl: GRPCWEB_URL,
      chainId: CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: myAddress,
      encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    });
    const {
      balance: { amount },
    } = await secretjs.query.bank.balance({
      address: myAddress,
      denom: MINIMAL_DENOM,
    });
    setMyBalance(`${amount / 1e6} ${DENOM}`);
  }

  async function handleConnect() {

    console.log(`connecting to chain-id:${CHAIN_ID}, 
    CHAIN_NAME=${CHAIN_NAME}, RPC_URL=${RPC_URL}, LCD_URL=${LCD_URL}, DENOM=${DENOM}, 
    MINIMAL_DENOM=${MINIMAL_DENOM}`);

    await window.keplr.experimentalSuggestChain({
      chainId: CHAIN_ID,
      chainName: CHAIN_NAME,
      rpc: RPC_URL,
      rest: LCD_URL,
      bip44: {
        coinType: 529,
      },
      coinType: 529,
      stakeCurrency: {
        coinDenom: DENOM,
        coinMinimalDenom: MINIMAL_DENOM,
        coinDecimals: 6,
      },
      bech32Config: {
        bech32PrefixAccAddr: "secret",
        bech32PrefixAccPub: "secretpub",
        bech32PrefixValAddr: "secretvaloper",
        bech32PrefixValPub: "secretvaloperpub",
        bech32PrefixConsAddr: "secretvalcons",
        bech32PrefixConsPub: "secretvalconspub",
      },
      currencies: [
        {
          coinDenom: DENOM,
          coinMinimalDenom: MINIMAL_DENOM,
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: DENOM,
          coinMinimalDenom: MINIMAL_DENOM,
          coinDecimals: 6,
        },
      ],
      gasPriceStep: {
        low: 0.1,
        average: 0.25,
        high: 0.4,
      },
      features: ["secretwasm"],
    });

    await window.keplr.enable(CHAIN_ID);
    refreshAccount();
    setKeplrEnabled(true);
  }

  return (
    <Container className="keplr">
      {!keplrEnabled && (
        <Row>
          <Button className="keplrConnect" onPress={handleConnect}>
            <img src="images/Keplr_Black.png" alt="" />
          </Button>
        </Row>
      )}
      {keplrEnabled && (
        <Card className="keplrCard">
          <div>
            <p>
              <strong>My Address:</strong> {myAddress}
            </p>
          
            {myBalance ? <div><p><strong>My Balance: {myBalance}</strong></p></div> : <Loading/>}

            </div>
        </Card>
      )}
    </Container>
  );
}
