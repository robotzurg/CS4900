import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';
import pool from '../config/db.ts';
import { GenericService } from './genericService.ts';
import type { User } from 'api/models/user.ts';

export class UserService extends GenericService<User> {
  constructor() {
    super('users');
  }
}