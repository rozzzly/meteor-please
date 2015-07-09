#!/bin/bash

pakmanager build 
npm build
npm publish 

sleep 15s

sudo npm install -g meteor-please-and-thank-you
