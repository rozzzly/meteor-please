var cjson = require('cjson');
var path = require('path');
var fs = require('fs');
var helpers = require('./helpers');
var format = require('util').format;
var Please = require('../lib/please');

require('colors');

exports.read = function() {
	var patyJsonPath = path.resolve('paty.json');
	if (fs.existsSync(patyJsonPath)) {
		var patyJson = cjson.load(patyJsonPath);

		//initialize options
		patyJson.env = patyJson.env || {};

		if (typeof patyJson.setupNode === "undefined") {
			patyJson.setupNode = true;
		}
		if (typeof patyJson.setupPhantom === "undefined") {
			patyJson.setupPhantom = true;
		}
		patyJson.meteorBinary = (patyJson.meteorBinary) ? getCanonicalPath(patyJson.meteorBinary) : 'meteor';
		if (typeof patyJson.appName === "undefined") {
			patyJson.appName = "meteor";
		}

		//validating servers
		if (!patyJson.servers || patyJson.servers.length == 0) {
			patyErrorLog('Server information does not exist');
		} else {
			patyJson.servers.forEach(function (server) {
				if(!server.host) {
					patyErrorLog('Server host does not exist');
				} else if(!server.username) {
					patyErrorLog('Server username does not exist');
				} else if(!server.password && !server.pem) {
					patyErrorLog('Server password or pem does not exist');
				} else if (!patyJson.app) {
					patyErrorLog('Path to app does not exist');
				}

				server.os = server.os || "linux";

				if(server.pem) {
					server.pem = rewriteHome(server.pem);
				} else {
					//hint paty bin script to check whether sshpass installed or not
					patyJson._passwordExists = true;
				}

				server.env = server.env || {};
				var defaultEndpointUrl =
					format("http://%s:%s", server.host, patyJson.env['PORT'] || 80);
				server.env['CLUSTER_ENDPOINT_URL'] =
					server.env['CLUSTER_ENDPOINT_URL'] || defaultEndpointUrl;
			});
		}

		//rewrite ~ with $HOME
		patyJson.app = rewriteHome(patyJson.app);

		if (patyJson.ssl) {
			patyJson.ssl.backendPort = patyJson.ssl.backendPort || 80;
			patyJson.ssl.pem = path.resolve(rewriteHome(patyJson.ssl.pem));
			if (!fs.existsSync(patyJson.ssl.pem)) {
				patyErrorLog('SSL pem file does not exist');
			}
		}

		return patyJson;
	} else {
		console.error('paty.json file does not exist!'.red.bold);
		helpers.printHelp();
		process.exit(1);
	}
};

function rewriteHome(location) {
	return location.replace('~', process.env.HOME);
}

function patyErrorLog(message) {
	var errorMessage = 'Invalid paty.json file: ' + message;
	console.error(errorMessage.red.bold);
	helpers.initJson(path.resolve('.'));
	process.exit(1);
}

function getCanonicalPath(location) {
	var localDir = path.resolve(__dirname, location);
	if(fs.existsSync(localDir)) {
		return localDir;
	} else {
		return path.resolve(rewriteHome(location));
	}
}
