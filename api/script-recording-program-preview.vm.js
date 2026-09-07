(function() {
	
	var program = chinachu.getProgramById(request.param.id, data.recording);
	
	if (program === null) return response.error(404);
	
	if (!data.status.feature.previewer) return response.error(403);
	
	if (!program.pid) return response.error(503);
	
	if (program.tuner && program.tuner.isScrambling) return response.error(409);
	
	if (!fs.existsSync(program.recorded)) return response.error(410);
	
	var width  = request.query.width;
	var height = request.query.height;
	
	if (request.query.size && (request.query.size.match(/^[1-9][0-9]{0,3}x[1-9][0-9]{0,3}$/) !== null)) {
		width  = request.query.size.split('x')[0];
		height = request.query.size.split('x')[1];
	}
	
	width = parseInt(width, 10).toString(10);
	height = parseInt(height, 10).toString(10);
	if (width === 'NaN' || width === '0') width = '320';
	if (height === 'NaN' || height === '0') height = '180';
	
	var vcodec = 'mjpeg';
	
	if (request.query.type && (request.query.type === 'jpg')) { vcodec = 'mjpeg'; }
	if (request.query.type && (request.query.type === 'png')) { vcodec = 'png'; }
	if (request.type === 'jpg') { vcodec = 'mjpeg'; }
	if (request.type === 'png') { vcodec = 'png'; }
	if (request.type === 'txt') { vcodec = 'mjpeg'; }
	
	var attempts = [ true, false ];

	function createPreview() {
		var nearEnd = attempts.shift();
		var args = recordingPreview.createFfmpegArgs({
			recorded: program.recorded,
			width: width,
			height: height,
			codec: vcodec,
			nearEnd: nearEnd
		});
		var ffmpeg = child_process.execFile(
			'ffmpeg',
			args,
			{
				encoding: null,
				maxBuffer: 3200000
			},
			function(err, stdout, stderr) {
				clearTimeout(timeout);

				if (err || !Buffer.isBuffer(stdout) || stdout.length === 0) {
					if (attempts.length > 0) {
						return createPreview();
					}

					util.log('ERROR: recording preview failed: ' +
						(err ? err.message : 'ffmpeg returned an empty image') +
						(stderr && stderr.length > 0 ? '\n' + stderr.toString() : ''));
					return response.error(503);
				}

				response.head(200);
				if (request.type === 'txt') {
					if (vcodec === 'mjpeg') {
						response.end('data:image/jpeg;base64,' + stdout.toString('base64'));
					} else if (vcodec === 'png') {
						response.end('data:image/png;base64,' + stdout.toString('base64'));
					}
				} else {
					response.end(stdout);
				}
			}
		);

		children.push(ffmpeg.pid);
		var timeout = setTimeout(function() {
			ffmpeg.kill('SIGKILL');
		}, 6000);
	}

	createPreview();

})();
