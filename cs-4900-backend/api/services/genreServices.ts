import type { Genre } from 'api/models/genre.ts';
import { GenericService } from './genericService.ts';

export class GenreService extends GenericService<Genre> {
  constructor() {
    super('genres');
  }
}
