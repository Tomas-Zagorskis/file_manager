import fs from 'fs/promises';
import path from 'path';
import readLine from 'readline';
import { stdin as input, stdout as output, argv } from 'process';
import { homedir } from 'os';

let username,
	userPath = homedir();

const rl = readLine.createInterface({ input, output });

if (argv[2] && argv[2].startsWith('--username=')) {
	username = argv[2].split('=')[1];
} else {
	username = 'Anonymous';
}

console.log(`\x1b[32mWelcome to the File Manager, ${username}!\n\x1b[0m`);
console.log(`\x1b[33mYou are currently in ${userPath}\x1b[0m`);
console.log('\x1b[90mEnter your command in the line below\x1b[0m');

rl.on('line', async line => {
	const opLine = line.split(' ');
	try {
		switch (opLine[0]) {
			// Navigation & working directory
			case 'up':
				userPath = path.resolve(userPath, '..');
				break;
			case 'cd':
				await changeDir(opLine[1]);
				break;
			case 'ls':
				await listDir();
				break;

			case '.exit':
				rl.close();
				break;

			default:
				console.log('\x1b[31mInvalid input\x1b[0m');
				break;
		}
	} catch (error) {
		console.log(`\x1b[31mERROR: ${error.message}\x1b[0m`);
	}

	if (line != '.exit') {
		setTimeout(() => {
			console.log(`\x1b[33m\nYou are currently in ${userPath}\x1b[0m`);
			console.log('\x1b[90mEnter your command in the line below\x1b[0m');
		}, 10);
	}
});

rl.on('close', () =>
	console.log(
		`\x1b[32m\nThank you for using File Manager, ${username}, goodbye!\x1b[0m`,
	),
);

async function changeDir(newPath) {
	const goPath = path.resolve(userPath, newPath);
	try {
		const stat = await fs.stat(goPath);
		if (stat.isDirectory()) userPath = goPath;
		else throw new Error("given path isn't a directory");
	} catch (error) {
		if (error.message.startsWith('given')) throw error;
		else throw new Error("directory doesn't exist");
	}
}

async function listDir() {
	try {
		const fileList = await fs.readdir(userPath, { withFileTypes: true });
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
		throw new Error('FS operation failed');
	}
}
