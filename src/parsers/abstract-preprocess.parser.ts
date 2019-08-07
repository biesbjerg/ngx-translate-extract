import { KeysPreprocessContextInterface } from './parser.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractPreprocessParser  {

	public preprocessKeys(keys: string[], context: KeysPreprocessContextInterface): string[] {
		return keys;
	}

}
