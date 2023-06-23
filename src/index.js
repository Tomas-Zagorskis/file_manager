import path from 'path';
import readLine from 'readline';
import { stdin as input, stdout as output, argv } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let userPath = path.dirname(__filename);

const rl = readLine.createInterface({ input, output });

if (argv[2] && argv[2].startsWith('--username=')) {
	const username = argv[2].split('=')[1];
	console.log(`Welcome to the File Manager, ${username}!`);
} else {
	console.log('Welcome to the File Manager, anonymous!');
}

rl.on('line', data => {
	console.log(`Received: ${data}`);
	if (data == 'up') userPath = path.resolve(userPath, '..');
	console.log(`You are currently in ${userPath}`);
});
