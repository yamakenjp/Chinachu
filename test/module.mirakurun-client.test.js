'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const configureMirakurunClient = require('../common/lib/mirakurun-client');

function createClient() {
	return {
		host: '',
		port: 40772,
		socketPath: '/var/run/mirakurun.sock',
		basePath: '/api'
	};
}

describe('configureMirakurunClient', function() {
	it('supports the encoded http+unix format', function() {
		const client = configureMirakurunClient(
			createClient(),
			'http+unix://%2Frun%2Fmirakurun.sock/custom'
		);

		assert.equal(client.socketPath, '/run/mirakurun.sock');
		assert.equal(client.basePath, '/custom/api');
		assert.equal(client.host, '');
	});

	it('supports the legacy unix socket format', function() {
		const client = configureMirakurunClient(
			createClient(),
			'http://unix:/run/mirakurun.sock:/custom'
		);

		assert.equal(client.socketPath, '/run/mirakurun.sock');
		assert.equal(client.basePath, '/custom/api');
		assert.equal(client.host, '');
	});

	it('supports a network endpoint', function() {
		const client = configureMirakurunClient(
			createClient(),
			'http://127.0.0.1:40772/custom'
		);

		assert.equal(client.socketPath, '');
		assert.equal(client.host, '127.0.0.1');
		assert.equal(client.port, 40772);
		assert.equal(client.basePath, '/custom/api');
	});

	it('rejects protocols unsupported by the Mirakurun HTTP client', function() {
		assert.throws(
			() => configureMirakurunClient(createClient(), 'https://localhost:40772/'),
			/Unsupported Mirakurun protocol/
		);
	});
});
