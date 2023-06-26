import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { errorMessages } from '../errors.js';

export async function readFile(currentPath, fileName) {
	const toRead = path.resolve(currentPath, fileName);
	try {
		const fd = await fs.open(toRead);
		const stream = fd.createReadStream({ encoding: 'utf-8' });
		stream.push(
			`\x1b[95m\n------------${fileName}------------\n\x1b[0m`,
			'utf-8',
		);
		stream.on('data', data => process.stdout.write(data));
		stream.on('end', () =>
			console.log(
				'\x1b[95m\n-----------END OF READING FILE-------------\x1b[0m',
			),
		);
		stream.on('close', () => fd.close());
	} catch {
		throw new Error(errorMessages.failed);
	}
}

export async function createFile(currentPath, fileName) {
	const toRead = path.resolve(currentPath, fileName);
	try {
		const fd = await fs.open(toRead, 'wx');
		await fd.close();
	} catch {
		throw new Error(errorMessages.failed);
	}
}

export async function renameFile(currentPath, fileName, newFileName) {
	const pathToFile = path.resolve(currentPath, fileName);
	const pathToNewFile = path.resolve(currentPath, newFileName);
	try {
		await fs.rename(pathToFile, pathToNewFile);
	} catch {
		throw new Error(errorMessages.failed);
	}
}

export async function copyFile(currentPath, copyPath, pastePath) {
	const pathToCopyFiles = path.resolve(currentPath, copyPath);
	const pathToPasteFiles = path.resolve(currentPath, pastePath);
	try {
		const fdIn = await fs.open(pathToCopyFiles, 'r');
		const readStream = fdIn.createReadStream();

		const fdOut = await fs.open(pathToPasteFiles, 'wx');
		const writeStream = fdOut.createWriteStream();

		readStream.pipe(writeStream);
		readStream.on('close', () => fdIn.close());
		writeStream.on('close', () => fdOut.close());
	} catch {
		throw new Error(errorMessages.failed);
	}
}

export async function deleteFile(currentPath, fileName) {
	const toDelete = path.resolve(currentPath, fileName);
	try {
		await fs.rm(toDelete);
	} catch {
		throw new Error(errorMessages.failed);
	}
}

export async function moveFile(currentPath, fromPath, toPath) {
	await copyFile(currentPath, fromPath, toPath);
	await deleteFile(currentPath, fromPath);
}
