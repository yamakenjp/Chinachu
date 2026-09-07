'use strict';

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');
const bindRecordingFinalizer = require('../common/lib/recording-lifecycle');

function createStream() {
	const stream = new EventEmitter();
	stream.destroyed = false;
	stream.unpipeCount = 0;
	stream.destroyCount = 0;
	stream.req = {
		destroyed: false,
		destroyCount: 0,
		destroy() {
			this.destroyed = true;
			this.destroyCount += 1;
		}
	};
	stream.unpipe = function(output) {
		this.unpipeCount += 1;
		this.unpipeOutput = output;
	};
	stream.destroy = function() {
		this.destroyed = true;
		this.destroyCount += 1;
	};
	return stream;
}

test('recording finalizer runs once when a request is stopped manually', () => {
	const stream = createStream();
	const output = {};
	let finalizeCount = 0;
	const finalize = bindRecordingFinalizer(stream, output, () => {
		finalizeCount += 1;
	});

	assert.equal(finalize(), true);
	stream.emit('close');
	stream.emit('end');
	assert.equal(finalize(), false);

	assert.equal(finalizeCount, 1);
	assert.equal(stream.unpipeCount, 1);
	assert.equal(stream.unpipeOutput, output);
	assert.equal(stream.destroyCount, 1);
	assert.equal(stream.req.destroyCount, 1);
});

test('recording finalizer also handles a stream close without an end event', () => {
	const stream = createStream();
	let finalizeCount = 0;
	bindRecordingFinalizer(stream, {}, () => {
		finalizeCount += 1;
	});

	stream.emit('close');

	assert.equal(finalizeCount, 1);
	assert.equal(stream.destroyCount, 1);
	assert.equal(stream.req.destroyCount, 1);
});
