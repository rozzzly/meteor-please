#!/bin/bash

sudo systemctl stop <%= appName %>.service
sudo chown -R <%= appUser %> <%= appRemoteTargetPath %>
#su <%= appUser %>
cd <%= appRemoteTargetPath %>

# unpack bundle / overwrite previous
tar -zxvf <%= appName %>.tar.gz
rm -rf <%= appName %>.tar.gz

# install npm dependencies
cd bundle/programs/server/
npm install
exit

# symlink service config from meteor-please to the base directory so it can get picked up
sudo ln -s /etc/systemd/system/meteor-please/<%= appName %>.service /etc/systemd/system/<%= appName %>.service

# enable with systemctl
sudo systemctl enable


# restart daemon
sudo systemctl daemon-reload
sudo systemctl enable <%= appName %>.service
sudo systemctl start <%= appName %>.service
