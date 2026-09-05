'use strict';

const path = require('node:path');

function joinBasePath(prefix, basePath) {
	return path.posix.join(prefix || '/', basePath || '/');
}

module.exports = function configureMirakurunClient(client, endpoint) {
	const standardUnix = endpoint.match(/^http\+unix:\/\/([^/]+)(\/?.*)$/);
	if (standardUnix) {
		client.socketPath = decodeURIComponent(standardUnix[1]);
		client.basePath = joinBasePath(standardUnix[2], client.basePath);
		client.host = '';
		return client;
	}

	const legacyUnix = endpoint.match(/^http:\/\/unix:([^:]+):?(.*)$/);
	if (legacyUnix) {
		client.socketPath = legacyUnix[1];
		client.basePath = joinBasePath(legacyUnix[2], client.basePath);
		client.host = '';
		return client;
	}

	const parsed = new URL(endpoint);
	if (parsed.protocol !== 'http:') {
		throw new TypeError(`Unsupported Mirakurun protocol: ${parsed.protocol}`);
	}

	client.socketPath = '';
	client.host = parsed.hostname.replace(/^\[|\]$/g, '');
	client.port = parsed.port ? Number(parsed.port) : 80;
	client.basePath = joinBasePath(parsed.pathname, client.basePath);

	return client;
};
