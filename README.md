- [Overview](#overview)
- [Initial setup](#initial-setup)
  - [Prerequisites](#prerequisites)
  - [Step 0 - Create DNS records](#create-dns)
  - [Step 1 - Edit domain names and emails in the configuration](#edit-domains)
  - [Step 2 - Configure Nginx virtual hosts](#nginx-vhosts)
    - [Serving static content](#serving-static)
    - [Proxying all requests to a backend server](#proxy-backend)
  - [Step 3 - Create named Docker volumes for dummy and Let's Encrypt TLS certificates](#create-volumes)
  - [Step 4 - Build images and start containers using staging Let's Encrypt server](#build-images)
  - [Step 5 - verify HTTPS works with the staging certificates](#verify-https)
  - [Step 6 - Switch to production Let's Encrypt server](#encrypt-prod)
  - [Step 7 - verify HTTPS works with the production certificates](#verify-https-prod)
- [Reloading Nginx configuration without downtime](#reload-nginx)
- [Adding a new domain to a running solution](#add-domain)
  - [Step 0 - Create new DNS records](#new-dns)
  - [Step 1 - Add domain name and email to the configuration](#add-domain-config)
  - [Step 2 - Configure a new Nginx virtual host](#new-vhost)
  - [Step 3 - Restart Docker containers](#restart-docker)
- [Directory structure](#dir-structure)
- [Configuration file structure](#config-file)
- [SSL configuration for A+ rating](#ssl-config)

- Usage
  - [Explorer](#explorer)
  - [Connect Keplr](#keplr)
  - [Faucet](#faucet)


## <a id="overview"></a>Overview
  
[Local Secret](https://docs.scrt.network/docs/development/local-secret) is the perfect start for a developer, providing a local, instant, zero-config Secret Network blockchain.
When it's time to go from "Works on my machine" to the rest of your team, a public testnet is usually the next step.

There are times when you may need a private testnet, an environment where you can control network governance, blocktime, do performance tests, test alternate versions of the chain etc.

This project can spin up such an environment in a couple of minutes.

LocalSecret provides many services, mostly the endpoints in Secret Network, and additionally exposes the faucet service internally.
You may also want an explorer using these services, and all of these are often served by subdomains, eg faucet.scrttestnet.com, grpc.scrttestnet.com, lcd.scrttestnet.com etc.

Besides the LocalSecret container, we also build and run a simple UI, faucet and light weight block explorer, and expose REST/LCD, RPC, gPRC etc 

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

## <a id="initial-setup"></a>Initial setup

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
| A     | `explorer.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| A     | `faucet.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| A     | `grpc.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| A     | `grpcweb.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| A     | `ui.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| A     | `static.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| CNAME | `www.lcd.scrttestnet.com` | is an alias of `lcd.scrttestnet.com` |
| CNAME | `www.rpc.scrttestnet.com` | is an alias of `rpc.scrttestnet.com` |
| CNAME | `www.explorer.scrttestnet.com` | is an alias of `explorer.scrttestnet.com` |
| CNAME | `www.faucet.scrttestnet.com` | is an alias of `faucet.scrttestnet.com` |
| CNAME | `www.grpc.scrttestnet.com` | is an alias of `grpc.scrttestnet.com` |
| CNAME | `www.grpcweb.scrttestnet.com` | is an alias of `grpcweb.scrttestnet.com` |
| CNAME | `www.ui.scrttestnet.com` | is an alias of `ui.scrttestnet.com` |
| CNAME | `www.static.scrttestnet.com` | is an alias of `static.scrttestnet.com` |

### <a id="edit-domains"></a>Step 1 - Edit domain names and emails in the configuration

Specify your domain names and contact emails for these domains with space as delimiter in the [`config.env`](config.env):


```bash
DOMAINS="lcd.scrttestnet.com rpc.scrttestnet.com"
CERTBOT_EMAILS="info@scrttestnet.com info@scrttestnet.com"
```

For two and more domains separated by space use double quotes (`"`) around the `DOMAINS` and `CERTBOT_EMAILS` variables.

For a single domain double quotes can be omitted:

```bash
DOMAINS=lcd.scrttestnet.com
CERTBOT_EMAILS=info@scrttestnet.com
```

### <a id="nginx-vhosts"></a>Step 2 - Configure Nginx virtual hosts

For each domain configure the Nginx [`server` block](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) by updating `vhosts/${domain}.conf`:

- `vhosts/lcd.scrttestnet.com.conf`
- `vhosts/rpc.scrttestnet.com.conf`

#### <a id="serving-static"></a>Serving static content

```
location / {
    root /var/www/html/my-domain;
    index index.html index.htm;
}
```

Make sure `html/my-domain` directory (relative to the repository root) exists and countains the desired content and `html` directory is mounted as `/var/www/html` in `docker-compose.yml`:

```yaml
services:
  nginx:
  #...
  volumes:
    #...
    - ./html:/var/www/html
```

#### <a id="proxy-backend"></a>Proxying all requests to a backend server
```
location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://my-backend:8080/;
}
```

`my-backend` is the service name of your backend application in `docker-compose.yml`:

```yaml
services:
  my-backend:
    image: example.com/my-backend:1.0.0
    #...
    ports:
      - "8080"
```

### <a id="create-volumes"></a>Step 3 - Create named Docker volumes for dummy and Let's Encrypt TLS certificates, and finally LocalSecret's data

```bash
docker volume create --name=nginx_conf
docker volume create --name=letsencrypt_certs
docker volume create --name=scrttestnet
```
### <a id="build-images"></a>Step 4 - Build images and start containers using staging Let's Encrypt server

```bash
docker compose up -d --build
docker compose logs -f
```

You can alternatively use the `docker-compose` binary.

For each domain wait for the following log messages:

```
Switching Nginx to use Let's Encrypt certificate
Reloading Nginx configuration
```

### <a id="verify-https"></a>Step 5 - verify HTTPS works with the staging certificates

For each domain open in browser `https://${domain}` and `https://www.${domain}` and verify that staging Let's Encrypt certificates are working:

- https://static.scrttestnet.com.conf, https://www.static.scrttestnet.com.conf
- https://lcd.scrttestnet.com.conf, https://www.lcd.scrttestnet.com.conf
- https://rpc.scrttestnet.com.conf, https://www.rpc.scrttestnet.com.conf

Certificates issued by `(STAGING) Let's Encrypt` are considered not secure by browsers.

### <a id="encrypt-prod"></a>Step 6 - Switch to production Let's Encrypt server

Stop the containers:

```bash
docker compose down
```

Configure to use production Let's Encrypt server in [`config.env`](config.env):

```properties
CERTBOT_TEST_CERT=0
```

Re-create the volume for Let's Encrypt certificates:

```bash
docker volume rm letsencrypt_certs
docker volume create --name=letsencrypt_certs
```

Start the containers:

```bash
docker compose up -d
docker compose logs -f
```

### <a id="verify-https-prod"></a>Step 7 - verify HTTPS works with the production certificates

For each domain open in browser `https://${domain}` and `https://www.${domain}` and verify that production Let's Encrypt certificates are working.

Certificates issued by `Let's Encrypt` are considered secure by browsers.

Optionally check your domains with [SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/) and review the SSL Reports.

## <a id="reload-nginx"></a>Reloading Nginx configuration without downtime
Update a configuration in `vhosts/${domain}.conf`.

Do a hot reload of the Nginx configuration:

```bash
docker compose exec --no-TTY nginx nginx -s reload
```

## <a id="add-domain"></a>Adding a new domain to a running solution

Let's add a third domain `dapp.scrttestnet.com` to a running solution.

### <a id="new-dns"></a>Step 0 - Create new DNS records

Create DNS A record and CNAME record for `www` subdomain.

**DNS records**

| Type  | Hostname                      | Value                                    |
| ----- | ----------------------------- | ---------------------------------------- |
| A     | `dapp.scrttestnet.com`     | directs to IP address `X.X.X.X`          |
| CNAME | `www.dapp.scrttestnet.com` | is an alias of `dapp.scrttestnet` |

### <a id="add-domain-config"></a>Step 1 - Add domain name and email to the configuration

Add a new domain name (`dapp.scrttestnet.com`) and contact email to the [`config.env`](config.env):

```properties
DOMAINS="lcd.scrttestnet.com rpc.scrttestnet.com dapp.scrttestnet.com"
CERTBOT_EMAILS="info@scrttestnet.com info@scrttestnet.com info@scrttestnet.com"
```

### <a id="new-vhost"></a>Step 2 - Configure a new Nginx virtual host

Create a virtual host configuration file `vhosts/dapp.scrttestnet.com.conf` for the new domain.

For example, for serving static content use the following configuration:

```
location / {
    root /var/www/html/dapp.scrttestnet.com;
    index index.html index.htm;
}
```

Create a webroot `html/dapp.scrttestnet.com` and add static content.

### <a id="restart-docker"></a>Step 3 - Restart Docker containers

```bash
docker compose down
docker compose up -d
docker compose logs -f
```

## <a id="dir-structure"></a>Directory structure
- [`docker-compose.yml`](docker-compose.yml)
- [`.env`](.env) - specifies `COMPOSE_PROJECT_NAME` to make container names independent from the base directory name
- [`config.env`](config.env) - specifies project configuration, e.g. domain names, emails etc.
- [`nginx/`](nginx/)
  - [`Dockerfile`](nginx/Dockerfile)
  - [`nginx.sh`](nginx/nginx.sh) - entrypoint script
  - [`default.conf`](nginx/default.conf) - common settings for all domains. The file is copied to `/etc/nginx/conf.d/`
  - [`gzip.conf`](nginx/gzip.conf) - Gzip compression. Included in `default.conf`
  - [`site.conf.tpl`](nginx/site.conf.tpl) - virtual host configuration template used to create configuration files `/etc/nginx/sites/${domain}.conf` included in `default.conf`
  - [`options-ssl-nginx.conf`](nginx/options-ssl-nginx.conf) - a configuration to get A+ rating at [SSL Server Test](https://www.ssllabs.com/ssltest/). Included in `site.conf.tpl`
  - [`hsts.conf`](nginx/hsts.conf) - HTTP Strict Transport Security (HSTS) policy. Included in `site.conf.tpl`
- [`vhosts/`](vhosts/)
  - [`lcd.scrttestnet.com.conf`](vhosts/lcd.scrttestnet.com.conf) - `server` block configuration to proxy [Cosmos SDK](https://docs.cosmos.network/master/core/grpc_rest.html) LCD. Included in `site.conf.tpl` (`include /etc/nginx/vhosts/${domain}.conf;`)
  - [`static.scrttestnet.com.conf`](vhosts/static.scrttestnet.com.conf) - `server` block configuration for serving static content. Included in `site.conf.tpl` (`include /etc/nginx/vhosts/${domain}.conf;`)
- [`html/`](html/)
Included in `site.conf.tpl` (`include /etc/nginx/vhosts/${domain}.conf;`)
  - [`static.scrttestnet.com/`](html/static.scrttestnet.com/) - directory mounted as a webroot for `lcd.scrttestnet.com`. Configured in `vhosts/static.scrttestnet.com.conf`
    - [`index.html`](html/static.scrttestnet.com/index.html)
- [`certbot/`](certbot/)
  - [`Dockerfile`](certbot/Dockerfile)
  - [`certbot.sh`](certbot/certbot.sh) - entrypoint script
- [`cron/`](cron/)
  - [`Dockerfile`](cron/Dockerfile)
  - [`renew_certs.sh`](cron/renew_certs.sh) - script executed on a daily basis to try to renew certificates

## <a id="config-file"></a>Configuration file structure

To adapt the example to your domain names you need to change only [`config.env`](config.env):

```properties
DOMAINS="faucet.somewhere-else.com grpcweb.somewhere-else.com"
CERTBOT_EMAILS="info@somewhere-else.com info@somewhere-else.com"
CERTBOT_TEST_CERT=1
CERTBOT_RSA_KEY_SIZE=4096
```

Configuration parameters:

- `DOMAINS` - a space separated list of domains to manage certificates for
- `CERTBOT_EMAILS` - a space separated list of email for corresponding domains. If not specified, certificates will be obtained with `--register-unsafely-without-email`
- `CERTBOT_TEST_CERT` - use Let's Encrypt staging server (`--test-cert`)

Let's Encrypt has rate limits. So, while testing it's better to use staging server by setting `CERTBOT_TEST_CERT=1` (default value).
When you are ready to use production Let's Encrypt server, set `CERTBOT_TEST_CERT=0`.

## <a id="ssl-config"></a>SSL configuration for A+ rating

SSL in Nginx is configured accoring to best practices to get A+ rating in [SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/).

Read more about the best practices and rating:

- https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices
- https://github.com/ssllabs/research/wiki/SSL-Server-Rating-Guide

## <a id="usage"></a>Usage
### <a id="explorer"></a>Explorer
### <a id="keplr"></a>Keplr
### <a id="faucet"></a>Faucet