import { GenericService } from './genericService.ts';

export class ArtistService extends GenericService<any> {
  constructor() {
    super('artists');
  }
}
