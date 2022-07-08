import { Container, Card, Link, Row, Text } from "@nextui-org/react";

export default function Home() {
  return (
    <Container>
        <Card>
            <Card.Body>
            <Row justify="center" align="center">
              <Text>
                LocalSecret is a complete Secret Network testnet and ecosystem containerized with Docker. 
              </Text>
            </Row>
            <Row justify="center" align="center">
                It simplifies the way secret contract developers test their contracts in a sandbox before they deploy them on a testnet or mainnet.
            </Row>
            <Row justify="center" align="center">
              <p>LocalSecret comes preconfigured with opinionated, sensible defaults for standard testing environments.</p>
            </Row>
            </Card.Body>
            <Card.Footer>
              <Row justify="center">
                <Link
                  icon
                  color="primary"
                  target="_blank"
                  href="https://docs.scrt.network/docs/development/local-secret"
                >
                  Local Secret docs
                </Link>
              </Row>
            </Card.Footer>
        </Card>
    </Container>
  );
}