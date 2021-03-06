import execa from 'execa';
import {WriteStream} from 'fs';
import {PassThrough, Stream} from 'stream';
import {SCRIPTS_DIR} from './config';

const executeScript = async (scriptName: string, inStream: Stream | PassThrough, outStream: WriteStream | PassThrough, ...args: string[]) => {
	const spawnedChild = execa(`python3 ${SCRIPTS_DIR}/${scriptName}.py ${args.join(' ')}`, {shell: true});

	inStream.pipe(spawnedChild.stdin!);
	spawnedChild.stdout?.pipe(outStream);

	await spawnedChild;
};

export default executeScript;
