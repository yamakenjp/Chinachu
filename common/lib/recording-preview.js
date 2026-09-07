'use strict';

const VALID_CODECS = new Set([ 'mjpeg', 'png' ]);

function normalizeDimension(value, fallback) {
	const dimension = parseInt(value, 10);
	return Number.isInteger(dimension) && dimension > 0 ? dimension : fallback;
}

function createFfmpegArgs(options) {
	const width = normalizeDimension(options.width, 320);
	const height = normalizeDimension(options.height, 180);
	const codec = VALID_CODECS.has(options.codec) ? options.codec : 'mjpeg';
	const args = [ '-hide_banner', '-loglevel', 'error' ];

	if (options.nearEnd !== false) {
		args.push('-sseof', '-15');
	}

	args.push(
		'-f', 'mpegts',
		'-probesize', '10000000',
		'-analyzeduration', '10000000',
		'-i', options.recorded,
		'-map', '0:v:0',
		'-frames:v', '1',
		'-an',
		'-vf', `scale=${width}:${height}`,
		'-codec:v', codec,
		'-f', 'image2pipe',
		'pipe:1'
	);

	return args;
}

module.exports = {
	createFfmpegArgs,
	normalizeDimension
};
