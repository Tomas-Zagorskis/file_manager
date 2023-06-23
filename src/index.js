import fs from 'fs';
import path from 'path';
import readLine from 'readline';
import { stdin as input, stdout as output, argv } from 'process';
import { homedir } from 'os';

let userPath = homedir();

const rl = readLine.createInterface({ input, output });

let username;

if (argv[2] && argv[2].startsWith('--username=')) {
	username = argv[2].split('=')[1];
} else {
	username = 'Anonymous';
}

console.log(`\x1b[32mWelcome to the File Manager, ${username}!\n\x1b[0m`);
console.log(`\x1b[33mYou are currently in ${userPath}\x1b[0m`);
console.log('\x1b[90mEnter your command in the line below\x1b[0m');

rl.on('line', async line => {
	switch (line) {
		case 'up':
			userPath = path.resolve(userPath, '..');
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

async function listDir() {
	fs.readdir(userPath, { withFileTypes: true }, (err, files) => {
		if (err) throw new Error('FS operation failed');
		const dirent = files
			.map(file => {
				if (file.isDirectory()) return { Name: file.name, Type: 'directory' };
				if (file.isFile()) return { Name: file.name, Type: 'file' };
				if (file.isSymbolicLink())
					return { Name: file.name, Type: 'symbolic link' };
				return { Name: file.name, Type: 'other' };
			})
			.sort((a, b) => a.Type.localeCompare(b.Type));
		console.table(dirent);
	});
}
