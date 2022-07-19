import { Container, Card, Link, Row, Text, Spacer } from "@nextui-org/react";
import { EXPLORER_URL } from "../constants/constants";

export default function Home() {
  return (
    <Container>
        <Card>
            <Card.Body>
            <Row justify="left">
                  <Text 
                    h4
                    css={{
                      textGradient: "45deg, $blue600 -20%, $pink500 50%",
                    }}
                    weight="bold"
                  >
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
                      <span>Connect <Link href="/keplr">Keplr</Link>, and create/import a wallet</span>
                  </li>
                  <li>
                  <span>Get some tokens from the <Link href="/faucet">Faucet</Link></span>
                  </li>
                  <li>
                  <span>Configure <Link href="/secretcli">Secret CLI</Link> to use this RPC</span>
                  </li>
                  <li>
                  <span>Explore the blockchain events with <Link href={EXPLORER_URL}>PingPub</Link></span>
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