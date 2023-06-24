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
				if (opLine[1]) throw new Error('Invalid input');
				userPath = path.resolve(userPath, '..');
				break;
			case 'cd':
				if (opLine[2] || !opLine[1]) throw new Error('Invalid input');
				await changeDir(opLine[1]);
				break;
			case 'ls':
				if (opLine[1]) throw new Error('Invalid input');
				await listDir();
				break;
			// Basic operations with files
			case 'cat':
				if (opLine[2] || !opLine[1]) throw new Error('Invalid input');
				await readFile(opLine[1]);
				break;
			case 'add':
				if (opLine[2] || !opLine[1]) throw new Error('Invalid input');
				await createFile(opLine[1]);
				break;
			case '.exit':
				rl.close();
				break;

			default:
				console.log('\x1b[31mERROR: Invalid input\x1b[0m');
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
		else throw new Error("Given path isn't a directory");
	} catch (error) {
		if (error.message.startsWith('given')) throw error;
		else throw new Error("Directory doesn't exist");
	}
}

async function listDir() {
	try {
		const fileList = await fs.readdir(userPath, {
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
		throw new Error('Operation failed');
	}
}

async function readFile(fileName) {
	const toRead = path.resolve(userPath, fileName);
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
	} catch {
		throw new Error('Operation failed');
	}
}

async function createFile(fileName) {
	const toRead = path.resolve(userPath, fileName);
	try {
		await fs.open(toRead, 'wx');
	} catch {
		throw new Error('Operation failed');
	}
}
