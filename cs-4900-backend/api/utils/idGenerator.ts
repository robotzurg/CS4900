import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import Sqids from 'sqids';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../../.env');
dotenv.config({ path: envPath });
const sqids = new Sqids({
    alphabet: process.env.SQIDS_ALPHABET
});

export const generateId = (): string => {
  return sqids.encode([Date.now()]);
};