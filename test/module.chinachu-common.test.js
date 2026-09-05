"use strict";

const { after, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const chinachu = require('chinachu-common');

const testDataPath = path.join(os.tmpdir(), 'chinachu-test-' + Date.now() + '.json');
let watcher;

after(function() {
	watcher && watcher.close();
	fs.rmSync(testDataPath, { force: true });
});

describe('(init)', function() {
	
	var testData = {
		a: 0,
		b: 1,
		c: '',
		d: 'string',
		e: null,
		f: {},
		g: { a: 0, b: 1, c: '', d: 'string', e: null, f: {}, h: [] },
		h: [],
		i: [ 0, 1, '', 'string', null, {}, [], , ]
	};
	
	it('create test data file', function() {
		fs.writeFileSync(testDataPath, JSON.stringify(testData));
	});
});

describe('jsonWatcher', function() {
	
	var test = null;
	
	it('read', async function() {
		await new Promise(function(resolve, reject) {
			watcher = chinachu.jsonWatcher(testDataPath, function(err, data) {
				try {
					assert.equal(err, null);
					test = data;
					assert.ok(test);
					resolve();
				} catch (e) {
					reject(e);
				}
			}, { now: true });
		});
	});
	
	it('validate', function() {
		
		assert.equal(test.a, 0);
		assert.equal(test.b, 1);
		assert.equal(test.c, '');
		assert.equal(test.d, 'string');
		assert.equal(test.e, null);
	});
	
	it('watch');
});

describe('formatRecordedName', function() {
	it('pads episode numbers without the legacy string helper', function() {
		const program = {
			start: Date.UTC(2026, 8, 4),
			episode: 7,
			channel: { type: 'GR', channel: '27', id: 'test', sid: 1, name: 'Test' },
			title: 'Title',
			fullTitle: 'Title',
			subTitle: '',
			category: 'anime',
			tuner: { name: 'test' }
		};

		assert.equal(chinachu.formatRecordedName(program, '<episode:3>.m2ts'), '007.m2ts');
	});
});
