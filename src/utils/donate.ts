import { yellow } from 'colorette';
import * as boxen from 'boxen';
import * as terminalLink from 'terminal-link';

const url = 'https://donate.biesbjerg.com';
const text = `
If this tool saves you time, please consider making a
donation towards the continued maintainence and development:

${yellow(terminalLink(url, url))}
`;

export const donateMessage = boxen(text.trim(), {
	padding: 1,
	margin: 0,
	borderColor: 'yellow',
	backgroundColor: 'black',
	dimBorder: true
});
