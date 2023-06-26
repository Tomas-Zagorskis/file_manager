import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { errorMessages } from '../errors.js';

export async function compressFile(currentPath, fileName, destinationName) {
	const pathToFile = path.resolve(currentPath, fileName);
	const pathToNewFile = path.resolve(currentPath, destinationName);
	try {
		const fdIn = await fs.open(pathToFile, 'r');
		const input = fdIn.createReadStream();

		const fdOut = await fs.open(pathToNewFile, 'wx');
		const output = fdOut.createWriteStream();

		const broZip = zlib.createBrotliCompress();

		input.pipe(broZip).pipe(output);
	} catch {
		throw new Error(errorMessages.failed);
	}
}

export async function decompressFile(currentPath, fileName, destinationName) {
	const pathToFile = path.resolve(currentPath, fileName);
	const pathToNewFile = path.resolve(currentPath, destinationName);
	try {
		const fdIn = await fs.open(pathToFile, 'r');
		const input = fdIn.createReadStream();

		const fdOut = await fs.open(pathToNewFile, 'wx');
		const output = fdOut.createWriteStream();

		const broUnzip = zlib.createBrotliDecompress();

		input.pipe(broUnzip).pipe(output);
	} catch {
		throw new Error(errorMessages.failed);
	}
}
