import fs from 'fs/promises';
import path from 'path';
import { errorMessages } from '../errors.js';

export function upDir(currentPath) {
	const newPath = path.resolve(currentPath, '..');
	return newPath;
}

export async function changeDir(currentPath, newPath) {
	const goPath = path.resolve(currentPath, newPath);
	let userPath = currentPath;
	try {
		const stat = await fs.stat(goPath);
		if (stat.isDirectory()) userPath = goPath;
		else throw new Error(errorMessages.failed);
	} catch {
		throw new Error(errorMessages.failed);
	}
	return userPath;
}

export async function listDir(currentPath) {
	try {
		const fileList = await fs.readdir(currentPath, {
			withFileTypes: true,
		});
		const mappedFileList = fileList
			.map(file => {
				if (file.isDirectory()) return { Name: file.name, Type: 'directory' };
				if (file.isFile()) return { Name: file.name, Type: 'file' };
				if (file.isSymbolicLink())
					return { Name: file.name, Type: 'symbolic link' };
				return { Name: file.name, Type: 'other' };
			})
			.sort((a, b) => a.Type.localeCompare(b.Type));
		console.table(mappedFileList);
	} catch {
		throw new Error(errorMessages.failed);
	}
}
