import { yellow } from 'colorette';
import * as boxen from 'boxen';
import * as terminalLink from 'terminal-link';

const url = 'https://donate.biesbjerg.com';
const link = terminalLink(url, url);
const message = `
If this tool saves you or your company time, please consider making a
donation to support my work and the continued maintainence and development:

${yellow(link)}`;

export const donateMessage = boxen(message.trim(), {
	padding: 1,
	margin: 0,
	dimBorder: true
});
