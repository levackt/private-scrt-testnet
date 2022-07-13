import { Container, Card, Link, Row, Text, Spacer } from "@nextui-org/react";
import { EXPLORER_URL } from "../constants/constants";

export default function Home() {
  return (
    <Container>
        <Card>
            <Card.Body>
            <Row justify="left">
              <Text>
                LocalSecret is a complete Secret Network testnet and ecosystem containerized with Docker. 
              </Text>
            </Row>
            <Row justify="left" align="left">
                It simplifies the way secret contract developers test their contracts in a sandbox before they deploy them on a testnet or mainnet.
            </Row>
            <Row justify="left" align="left">
              <p>LocalSecret comes preconfigured with opinionated, sensible defaults for standard testing environments.</p>
            </Row>

              <Text justify="left" align="left">
                This project extends LocalSecret to a wider audience; dev team, testers, users, etc
              </Text>
              <Spacer/>

              <section>
                <h4>Usage</h4>
                <ol>
                  <li>
                  <div>
                      <h8>Connect Keplr, and create/import a wallet</h8>
                      <br/>
                      <span>- If you connected Keplr to your own LocalSecret (secretdev-1) previously, remove that connection first. (Open Keplr and click X on the network dropdown)</span>
                      <br/>
                      <span>- Now head over to <a href="/keplr">Keplr</a> to configure it with this network's endpoints </span>
                    </div>
                  </li>
                  <li>
                  <span>Get some tokens from the <a href="/faucet">Faucet</a></span>
                  </li>
                  <li>
                  <span>Configure <a href="/secretcli">Secret CLI</a> to use this RPC</span>
                  </li>
                  <li>
                  <span>Explore the blockchain events with <a href={EXPLORER_URL}>PingPub</a></span>
                  </li>
                  <li>
                  <span>Enjoy customizable privacy!</span>
                  </li>
                </ol>
                </section>
            
            </Card.Body>
            <Card.Footer>
              <Row justify="left">
                <Link
                  icon
                  color="primary"
                  target="_blank"
                  href="https://docs.scrt.network/docs/development/local-secret"
                >
                  Local Secret docs
                </Link>
              </Row>

              <Row justify="left">
                <Link
                  icon
                  color="primary"
                  target="_blank"
                  href="https://github.com/levackt/private-scrt-testnet"
                >
                  Fork and run your own LocalSecret Testnet
                </Link>
              </Row>
            </Card.Footer>
        </Card>
    </Container>
  );
}