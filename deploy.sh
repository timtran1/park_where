docker-compose up -d
cp tim835.ddns.net /etc/nginx/sites-enabled/tim835.ddns.net
cp -R public /var/html/timpark
systemctl restart nginx