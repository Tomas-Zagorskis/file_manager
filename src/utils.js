import { errorMessages } from './errors.js';

export function parseOpLine(line) {
	let arg = [];
	let opLine = [];
	let isQuoted = false;

	const opStrings = line.trim().split(' ');
	opStrings.forEach((str, index) => {
		if (index === 0) return opLine.push(str);
		if (!str.startsWith('"') && !isQuoted) return opLine.push(str);
		if (str.startsWith('"')) isQuoted = true;
		if (isQuoted) arg.push(str);
		if (str.at(-1) === '"') {
			isQuoted = false;
			const argWithoutQuote = arg.join(' ').slice(1, -1);
			opLine.push(argWithoutQuote);
			arg = [];
		}
	});
	return opLine;
}

export function inputValidation(...args) {
	const numOfArgs = args.length;

	switch (numOfArgs) {
		case 1:
			if (args[0]) throw new Error(errorMessages.invalid);
			break;

		case 2:
			if (args[1] || !args[0]) throw new Error(errorMessages.invalid);
			break;

		case 3:
			if (args[2] || !args[1] || !args[0])
				throw new Error(errorMessages.invalid);
			break;
	}
}
