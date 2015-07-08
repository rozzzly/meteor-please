#!/bin/bash

git add --all 
git commit -m "trytryagain" 
git push origin master 
pakmanager build 
npm build
npm publish 

sleep 15s

sudo npm install -g meteor-please-and-thank-you
