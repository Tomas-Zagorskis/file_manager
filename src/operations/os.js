import os from 'os';
import { errorMessages } from '../errors.js';

export function osCommands(arg) {
	switch (arg) {
		case '--EOL':
			let eol = JSON.stringify(os.EOL);
			console.log(`\x1b[36mDefault End-Of-Line: ${eol}\x1b[0m`);
			break;

		case '--cpus':
			const cpusInfo = os.cpus();
			console.log(`\x1b[36mTotal CPU amount: ${cpusInfo.length}\x1b[0m`);
			cpusInfo.forEach(cpu =>
				console.log(
					`\x1b[36mmodel: ${cpu.model}, rate: ${cpu.speed / 1000} GHz\x1b[0m`,
				),
			);
			break;

		case '--homedir':
			console.log(`\x1b[36mHome directory: ${os.homedir()}\x1b[0m`);
			break;

		case '--username':
			const user = os.userInfo();
			console.log(`\x1b[36mUsername on system: ${user.username}\x1b[0m`);
			break;

		case '--architecture':
			const architecture = os.arch();
			console.log(
				`\x1b[36mThe operating system CPU architecture: ${architecture}\x1b[0m`,
			);
			break;

		default:
			throw new Error(errorMessages.invalid);
	}
}
