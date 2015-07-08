#!/bin/bash

# create app deploy path
sudo mkdir -p /var/www/meteor-please
sudo chown meteor-please:developers /var/www/meteor-please
sudo chmod 775 /var/www/meteor-please
#
# create system' .service file location
#
# or should I make my new directory meteor-please.service.d as seen here https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files
#
sudo mkdir -p /etc/systemd/system/meteor-please
sudo chown meteor-please:developers /etc/systemd/system/meteor-please
sudo chmod 775 /etc/systemd/system/meteor-please
# install nginx
sudo yum install -y nginx
sudo chown root:developers /etc/nginx/nginx.conf
sudo chmod g+w /etc/nginx/nginx.conf
#
sudo mkdir -p /etc/nginx/sites-enabled
sudo chown root:developers /etc/nginx/sites-enabled
sudo chmod g+w /etc/nginx/sites-enabled
# nginx daemon
sudo systemctl enable nginx
sudo systemctl start nginx
#
# firewalld --- turn this off because its ruining everything
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload