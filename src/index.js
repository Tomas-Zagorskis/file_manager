import fs from 'fs';
import path from 'path';
import readLine from 'readline';
import { stdin as input, stdout as output, argv } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let userPath = path.dirname(__filename);

const rl = readLine.createInterface({ input, output });

let username;

if (argv[2] && argv[2].startsWith('--username=')) {
	username = argv[2].split('=')[1];
} else {
	username = 'Anonymous';
}

console.log(`\x1b[32mWelcome to the File Manager, ${username}!\n\x1b[0m`);
console.log(`\x1b[33mYou are currently in ${userPath}\x1b[0m`);

rl.on('line', data => {
	switch (data) {
		case 'up':
			userPath = path.resolve(userPath, '..');
			break;
		case 'ls':
			fs.readdir(userPath, (err, files) => {
				if (err) throw new Error('FS operation failed');
				console.table(files);
			});
			break;
		case '.exit':
			rl.close();
			break;

		default:
			console.log('\x1b[31mInvalid input\x1b[0m');
			break;
	}

	if (data != '.exit') {
		console.log(`\x1b[33m\nYou are currently in ${userPath}\x1b[0m`);
	}
});

rl.on('close', () =>
	console.log(
		`\x1b[32m\nThank you for using File Manager, ${username}, goodbye!\x1b[0m`,
	),
);
