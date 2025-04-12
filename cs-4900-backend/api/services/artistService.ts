import type {Artist} from '../models/artist.ts';
import { GenericService } from './genericService.ts';

export class ArtistService extends GenericService<Artist> {
  constructor() {
    super('artists');
  }
}
