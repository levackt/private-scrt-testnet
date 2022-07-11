import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row } from "@nextui-org/react";
import { SecretNetworkClient } from "secretjs";

export default function KeplrConnect() {
  const [myAddress, setMyAddress] = useState("");
  const [myBalance, setMyBalance] = useState("");
  const [keplrEnabled, setKeplrEnabled] = useState(false);

  const grpcWebUrl = "https://grpcweb.scrttestnet.com";
  const CHAIN_ID = "secretdev-1";

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
          console.error(`failed to enable chain-id: ${CHAIN_ID}`, err);
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
      grpcWebUrl,
      chainId: CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: myAddress,
      encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    });
    const {
      balance: { amount },
    } = await secretjs.query.bank.balance({
      address: myAddress,
      denom: "uscrt",
    });
    setMyBalance(amount);
  }

  async function handleConnect() {

    // todo endpoints from config
    const rpcUrl = "https://rpc.scrttestnet.com";
    const lcdUrl = "https://lcd.scrttestnet.com";
    const CHAIN_ID = "secretdev-1"; //todo chain id from env
    const chainName = "Local Secret Testnet"; // todo chain name from env

    await window.keplr.experimentalSuggestChain({
      chainId: CHAIN_ID,
      chainName: chainName,
      rpc: rpcUrl,
      rest: lcdUrl,
      bip44: {
        coinType: 529,
      },
      coinType: 529,
      stakeCurrency: {
        coinDenom: "SCRT",
        coinMinimalDenom: "uscrt",
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
          coinDenom: "SCRT",
          coinMinimalDenom: "uscrt",
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "SCRT",
          coinMinimalDenom: "uscrt",
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
          <p>
            <strong>My Address:</strong> {myAddress}
          </p>
          <p>
            <strong>My Balance:</strong> {myBalance}
          </p>
        </Card>
      )}
    </Container>
  );
}
