'use strict';

module.exports = function bindRecordingFinalizer(stream, output, onFinalize) {
	let finalized = false;

	function finalize() {
		if (finalized) {
			return false;
		}
		finalized = true;

		stream.removeListener('end', finalize);
		stream.removeListener('close', finalize);
		stream.unpipe(output);

		if (!stream.destroyed) {
			stream.destroy();
		}
		if (stream.req && !stream.req.destroyed) {
			stream.req.destroy();
		}

		onFinalize();
		return true;
	}

	stream.once('end', finalize);
	stream.once('close', finalize);
	stream.once('error', finalize);

	return finalize;
};
