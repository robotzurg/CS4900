import slug from 'slug';

export function generateSlug(name: string): string {
  return slug(name);
}
