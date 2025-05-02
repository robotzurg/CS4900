import type {Artist} from '../models/artist.ts';
import { GenericService } from './genericService.ts';
import { generateSlug } from '../utils/slugGenerator.ts';

export class ArtistService extends GenericService<Artist> {
  constructor() {
    super('artists');
  }

  

  async create(data: Partial<Artist>) {
    const slug = generateSlug(data.name || '');
    return super.create({ ...data, slug });
  }
}
