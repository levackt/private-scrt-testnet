
import { CHAIN_ID, RPC_URL } from "../constants/constants";

import { Container, Card, Row, Text } from "@nextui-org/react";
import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";

export default function SecretCli() {
    const secretCliConfig = `
        secretcli config node ${RPC_URL}
        secretcli config chain-id ${CHAIN_ID}
    `
    const secretCliStatusOutput = `{
      "NodeInfo": {
        "protocol_version": {
          "p2p": "8",
          "block": "11",
          "app": "0"
        },
        "id": "115aa0a629f5d70dd1d464bc7e42799e00f4edae",
        "listen_addr": "tcp://0.0.0.0:26656",
        "network": "my-secret-testnet",
        "version": "0.34.19",
        "channels": "40202122233038606100",
        "moniker": "banana",
        "other": {
          "tx_index": "on",
          "rpc_address": "tcp://0.0.0.0:26657"
        }
      },
      "SyncInfo": {
        "latest_block_hash": "443ED45D1F62CC467E28FDBAAA56A7C4E86AD7E453FD8389D55547E5B15806CD",
        "latest_app_hash": "5B327F05B897F6C18EFC44E31533FC5E0C75E59147E692180225A9B7775D219F",
        "latest_block_height": "20193",
        "latest_block_time": "2022-07-13T11:57:07.58341032Z",
        "earliest_block_hash": "02530F30B08DB6C3530657786A5EB002B3AC48704C8A69ADAF1F6829D7970DAB",
        "earliest_app_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        "earliest_block_height": "1",
        "earliest_block_time": "2022-07-12T07:01:59.049629557Z",
        "catching_up": false
      },
      "ValidatorInfo": {
        "Address": "4A6F10DE798E1073D43FB8889F3B9DDE3DF7B0BC",
        "PubKey": {
          "type": "tendermint/PubKeyEd25519",
          "value": "ll7MP+Z/aAGYgUgQXB2rTCQ97qtMHJje/88Oj/i3Qgc="
        },
        "VotingPower": "1"
      }
    }`;

  return (
    <Container className="secretCli">
        <Card className="secretCliCard">
            <Card.Body>
            <Row justify="left">

              <Text 
                h4
                css={{
                  textGradient: "45deg, $blue600 -20%, $pink300 50%",
                }}
                weight="bold"
              >
                Configure secretcli to use this testnet
              </Text>
            </Row>
            <Row>
            <CopyBlock
                text={secretCliConfig}
                wrapLines
                showLineNumbers={false}
                codeBlock
                theme={dracula}
            />
            </Row>
            <Row justify="left">
              <Text>
                Test the config 
              </Text>
              </Row>
              <Row>
              <CodeBlock
                text="
                secretcli status"
                theme={dracula}
                showLineNumbers={false}
                />
            </Row>
            <Row>
              <Text>
                You should see something like this.
              </Text>
              </Row>
              <Row>
              <CodeBlock text={secretCliStatusOutput}
                theme={dracula}
                showLineNumbers={false}
                />
            </Row>
            
            </Card.Body>
            
        </Card>
    </Container>
  );
}