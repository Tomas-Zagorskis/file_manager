import readLine from 'readline';
import { stdin as input, stdout as output } from 'process';

import {
	commonPrompt,
	errorMsg,
	exitPrompt,
	fileManagerStart,
} from './prompt.js';
import { inputValidation, parseOpLine } from './utils.js';
import { changeDir, listDir, upDir } from './operations/nwd.js';
import {
	copyFile,
	createFile,
	deleteFile,
	moveFile,
	readFile,
	renameFile,
} from './operations/basics.js';
import { osCommands } from './operations/os.js';
import { calculateHash } from './operations/hash.js';
import { compressFile, decompressFile } from './operations/brotliCompress.js';
import { errorMessages } from './errors.js';

let userPath = fileManagerStart();

const rl = readLine.createInterface({ input, output });

rl.on('line', async line => {
	const [op, arg1, arg2, arg3] = parseOpLine(line);

	try {
		switch (op) {
			// Navigation & working directory
			case 'up':
				inputValidation(arg1);
				userPath = upDir(userPath);
				break;
			case 'cd':
				inputValidation(arg1, arg2);
				userPath = await changeDir(userPath, arg1);
				break;
			case 'ls':
				inputValidation(arg1);
				await listDir(userPath);
				break;
			// Basic operations with files
			case 'cat':
				inputValidation(arg1, arg2);
				await readFile(userPath, arg1);
				break;
			case 'add':
				inputValidation(arg1, arg2);
				await createFile(userPath, arg1);
				break;
			case 'rn':
				inputValidation(arg1, arg2, arg3);
				await renameFile(userPath, arg1, arg2);
				break;
			case 'cp':
				inputValidation(arg1, arg2, arg3);
				await copyFile(userPath, arg1, arg2);
				break;
			case 'mv':
				inputValidation(arg1, arg2, arg3);
				await moveFile(userPath, arg1, arg2);
				break;
			case 'rm':
				inputValidation(arg1, arg2);
				await deleteFile(userPath, arg1);
				break;
			// Operating system info
			case 'os':
				inputValidation(arg2);
				osCommands(arg1);
				break;
			// Hash calculation
			case 'hash':
				inputValidation(arg1, arg2);
				await calculateHash(userPath, arg1);
				break;
			// Compress and decompress operations
			case 'compress':
				inputValidation(arg1, arg2, arg3);
				await compressFile(userPath, arg1, arg2);
				break;
			case 'decompress':
				inputValidation(arg1, arg2, arg3);
				await decompressFile(userPath, arg1, arg2);
				break;
			// Exit
			case '.exit':
				rl.close();
				break;

			default:
				throw new Error(errorMessages.invalid);
		}
	} catch (error) {
		errorMsg(error.message);
	}

	commonPrompt(line, userPath);
});

rl.on('close', () => exitPrompt());
