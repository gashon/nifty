import randomstring from 'randomstring';
import { IApiKey, ApiKeyDocument } from '../types';

// Regenerate the API key and returnt he updated document
export default async function roll(this: IApiKey & ApiKeyDocument): Promise<IApiKey & ApiKeyDocument> {
  await this.updateOne({
    key: `sk_${this.test ? 'test' : 'live'}_${randomstring.generate(64)}`,
  });

  return this;
}
