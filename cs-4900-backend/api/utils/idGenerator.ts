import dotenv from 'dotenv';
import Sqids from 'sqids';
dotenv.config();

const sqids = new Sqids({
    alphabet: process.env.SQIDS_ALPHABET
});

export const generateId = (): string => {
  return sqids.encode([Date.now()]);
};