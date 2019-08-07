import { injectable } from 'inversify';

@injectable()
export abstract class  AbstractCompiler {

	public indentation: string = '\t';

	set config(options: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	get config() {
		return {indentation: this.indentation};
	}

	constructor() {}

}
