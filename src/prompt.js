import os from 'os';
import { argv } from 'process';

let username,
	userPath = os.homedir();

export function fileManagerStart() {
	if (argv[2] && argv[2].startsWith('--username=')) {
		username = argv[2].split('=')[1];
	} else {
		username = 'Anonymous';
	}

	console.log(`\x1b[32mWelcome to the File Manager, ${username}!\n\x1b[0m`);
	console.log(`\x1b[33mYou are currently in ${userPath}\x1b[0m`);
	console.log('\x1b[90mEnter your command in the line below\x1b[0m');
	return userPath;
}

export function errorMsg(msg) {
	console.log(`\x1b[31mERROR: ${msg}\x1b[0m`);
}

export function commonPrompt(line, userPath) {
	if (line != '.exit') {
		setTimeout(() => {
			console.log(`\x1b[33m\nYou are currently in ${userPath}\x1b[0m`);
			console.log('\x1b[90mEnter your command in the line below\x1b[0m');
		}, 10);
	}
}

export function exitPrompt() {
	console.log(
		`\x1b[32m\nThank you for using File Manager, ${username}, goodbye!\x1b[0m`,
	);
}
