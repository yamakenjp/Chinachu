'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const recordingPreview = require('../common/lib/recording-preview');

test('recording preview targets the first video stream near the file end', () => {
	const args = recordingPreview.createFfmpegArgs({
		recorded: '/recorded/example.m2ts',
		width: '480',
		height: '270',
		codec: 'mjpeg'
	});

	assert.deepEqual(args.slice(args.indexOf('-sseof'), args.indexOf('-sseof') + 2), [ '-sseof', '-15' ]);
	assert.deepEqual(args.slice(args.indexOf('-map'), args.indexOf('-map') + 2), [ '-map', '0:v:0' ]);
	assert.equal(args[args.indexOf('-vf') + 1], 'scale=480:270');
	assert.equal(args[args.indexOf('-i') + 1], '/recorded/example.m2ts');
});

test('recording preview fallback starts at the beginning and normalizes options', () => {
	const args = recordingPreview.createFfmpegArgs({
		recorded: '/recorded/example.m2ts',
		width: '0',
		height: 'invalid',
		codec: 'invalid',
		nearEnd: false
	});

	assert.equal(args.includes('-sseof'), false);
	assert.equal(args[args.indexOf('-vf') + 1], 'scale=320:180');
	assert.equal(args[args.indexOf('-codec:v') + 1], 'mjpeg');
});
