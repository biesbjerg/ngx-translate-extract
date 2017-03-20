export interface CliOptionsInterface {
	input: string[];
	output: string[];
	format: 'json' | 'namespaced-json' | 'pot';
	replace: boolean;
	sort: boolean;
	clean: boolean;
	help: boolean;
}
