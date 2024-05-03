server {
    server_name iwa-api.onfortify.com;
    client_max_body_size 200M;

    location / {
	proxy_pass http://127.0.0.1:3000;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
	proxy_set_header Host $host;
	proxy_set_header X-Forwarded-Host $host;
	proxy_set_header X-Forwarded-Server $host;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/iwa-api.onfortify.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/iwa-api.onfortify.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = iwa-api.onfortify.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name iwa-api.onfortify.com;
    return 404; # managed by Certbot


}