import type {Artist} from '../models/artist.ts';
import { GenericService } from './genericService.ts';
import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';
import pool from '../config/db.ts';

export class ArtistService extends GenericService<Artist> {
  constructor() {
    super('artists');
  }
}
