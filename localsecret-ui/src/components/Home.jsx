import { Container, Card, Link, Row, Text } from "@nextui-org/react";

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
                This project extends LocalSecret to a wider audience; your team, testers, stakeholders etc
              </Text>
            
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

              <Row justify="right">
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