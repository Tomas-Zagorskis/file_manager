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
	console.log(`Received: ${data}\n`);
	if (data == 'up') userPath = path.resolve(userPath, '..');
	if (data == '.exit') {
		rl.close();
	} else {
		console.log(`\x1b[33mYou are currently in ${userPath}\x1b[0m`);
	}
});

rl.on('close', () =>
	console.log(
		`\x1b[32mThank you for using File Manager, ${username}, goodbye!\x1b[0m`,
	),
);
