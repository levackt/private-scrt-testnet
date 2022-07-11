- [Overview](#overview)
- [Initial setup](#initial-setup)
  - [Prerequisites](#prerequsites)
  - [Step 0 - Create DNS records](#create-dns)
  - [Step 1 - Edit domain names and emails in the configuration](#edit-domains)
  - [Step 2 - Configure Nginx virtual hosts](#3414177b596079dbf39b1b7fa10234c6)
    - [Serving static content](#cdbe8e85146b30abdbb3425163a3b7a2)
    - [Proxying all requests to a backend server](#c156f4dfc046a4229590da3484f9478d)
  - [Step 3 - Create named Docker volumes for dummy and Let's Encrypt TLS certificates](#b56e2fee036d09a35898559d9889bae7)
  - [Step 4 - Build images and start containers using staging Let's Encrypt server](#4952d0670f6fb00a0337d2251621508a)
  - [Step 5 - verify HTTPS works with the staging certificates](#46d3804a4859874ba8b6ced6013b9966)
  - [Step 6 - Switch to production Let's Encrypt server](#04529d361bbd6586ebcf267da5f0dfd7)
  - [Step 7 - verify HTTPS works with the production certificates](#70d8ba04ba9117ff3ba72a9413131351)
- [Reloading Nginx configuration without downtime](#45a36b34f024f33bed82349e9096051a)
- [Adding a new domain to a running solution](#35a7ab6c3c12c73a0fce287690b1c216)
  - [Step 0 - Create a new DNS records](#22e1d8b6115f1b1aaf65d61ee2557e52)
  - [Step 1 - Add domain name and email to the configuration](#d0a4d4424e2e96c4dbe1a28dfddf7224)
  - [Step 2 - Configure a new Nginx virtual hosts](#96dc528b7365f5a119bb2b1893f60700)
  - [Step 3 - Restart Docker containers](#38f75935bf20b547d1f6788791645d5d)
- [Directory structure](#7cd115332ea5785828a7a0b5249f0755)
- [Configuration file structure](#bcd6f4d91c9b46c9af4d5b8c4a07db77)
- [SSL configuration for A+ rating](#f9987558925ac3a1ca42e184e10d7b73)

- Usage
  - Connect Keplr
  - Local faucet
  - Explorer

## <a id="overview"></a>Overview
  
[Local Secret](https://docs.scrt.network/docs/development/local-secret) is the perfect start for a developer, providing a local, instant, zero-config Secret Network blockchain.
When it's time to go from "Works on my machine" to the rest of your team, a public testnet is usually the next step.

There are times when you may need a private testnet, an environment where you can control network governance, blocktime, do performance tests, test alternate versions of the chain etc.

This project can spin up such an environment in a couple of minutes.

LocalSecret provides many services, mostly the endpoints in Secret Network, and additionally exposes the faucet service internally.
You may also want an explorer using these services, and all of these are often served by subdomains, eg faucet.scrttestnet.com, grpc.scrttestnet.com, lcd.scrttestnet.com etc.

Besides the LocalSecret container, we also build and run a simple UI, faucet and light weight block explorer, finally exposing LCD, RPC, GPRC and GRPC web endpoints.

This example automatically obtains and renews Let's Encrypt TLS certificates and sets up HTTPS in Nginx for all of these domain names using Docker Compose.

You can set up HTTPS in Nginx with Let's Encrypt TLS certificates for your domain names and get an A+ rating in SSL Labs SSL Server Test by changing a few configuration parameters of this example.

Let's Encrypt is a certificate authority that provides free X.509 certificates for TLS encryption. The certificates are valid for 90 days and can be renewed. Both initial creation and renewal can be automated using Certbot.

When using Kubernetes Let's Encrypt TLS certificates can be easily obtained and installed using Cert Manager. For simple websites and applications, Kubernetes is too much overhead and Docker Compose is more suitable. But for Docker Compose there is no such popular and robust tool for TLS certificate management.

The example supports separate TLS certificates for multiple domain names, e.g. example.com, anotherdomain.net etc. For simplicity this example deals with the following domain names:

The idea is simple. There are 3 containers:

- **Nginx**
- **Certbot** - for obtaining and renewing certificates
- **Cron** - for triggering certificates renewal once a day

The sequence of actions:

1. Nginx generates self-signed "dummy" certificates to pass ACME challenge for obtaining Let's Encrypt certificates
2. Certbot waits for Nginx to become ready and obtains certificates
3. Cron triggers Certbot to try to renew certificates and Nginx to reload configuration daily

### <a id="prerequisites"></a>Prerequisites

1. [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed
2. You have a domain name
3. You have a server with a publicly routable IP address
4. You have cloned this repository (or created and cloned a [fork](https://github.com/levackt/private-scrt-testnet)):
   ```bash
   git clone https://github.com/levackt/private-scrt-testnet
   ```
### <a id="create-dns"></a>Step 0 - Create DNS records

For all domain names create DNS A records to point to a server where Docker containers will be running.
Also, consider creating CNAME records for the `www` subdomains.

**DNS records**

| Type  | Hostname                      | Value                                    |
| ----- | ----------------------------- | ---------------------------------------- |
| A     | `lcd.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| A     | `rpc.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| CNAME | `www.lcd.scrttestnet.com` | is an alias of `lcd.scrttestnet.com` |
| CNAME | `www.rpc.scrttestnet.com` | is an alias of `rpc.scrttestnet.com` |

### <a id="edit-domains"></a>Step 1 - Edit domain names and emails in the configuration

Specify your domain names and contact emails for these domains with space as delimiter in the [`config.env`](config.env):


- `explorer.scrttestnet.com`
- `faucet.scrttestnet.com`
- `grpc.scrttestnet.com`
- `grpcweb.scrttestnet.com`
- `lcd.scrttestnet.com`
- `rpc.scrttestnet.com`
- `ui.scrttestnet.com`
