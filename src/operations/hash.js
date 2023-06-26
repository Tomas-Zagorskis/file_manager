import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { errorMessages } from '../errors.js';

export async function calculateHash(currentPath, fileName) {
	const filePath = path.resolve(currentPath, fileName);
	try {
		const data = await fs.readFile(filePath, 'utf8');
		const hash = crypto.createHash('sha256');
		const hashCode = hash.update(data).digest('hex');
		console.log(`\x1b[36m${hashCode}\x1b[0m`);
	} catch {
		throw new Error(errorMessages.failed);
	}
}
