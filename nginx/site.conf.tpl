server {
    listen 80;
    server_name ${domain} www.${domain};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot/${domain};
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${domain} www.${domain};

    ssl_certificate /etc/nginx/sites/ssl/dummy/${domain}/fullchain.pem;
    ssl_certificate_key /etc/nginx/sites/ssl/dummy/${domain}/privkey.pem;

    include /etc/nginx/includes/options-ssl-nginx.conf;

    ssl_dhparam /etc/nginx/sites/ssl/ssl-dhparams.pem;

    include /etc/nginx/includes/hsts.conf;

    include /etc/nginx/vhosts/${domain}.conf;
}

server {
    listen 9090 http2;
    server_name ${domain} www.${domain};
    access_log syslog:server=127.0.0.1:12000,tag=amplify,severity=info;
    include /etc/nginx/vhosts/${domain}.conf;
}