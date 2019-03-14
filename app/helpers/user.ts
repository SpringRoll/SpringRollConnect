import { getRepository } from 'typeorm';
import { Request } from 'express';
import { User } from '../db';

export function user(req: Request): User {
  return getRepository(User).create(<User>req.user);
}
