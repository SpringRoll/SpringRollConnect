import { Request, Response } from 'express';
import { Group } from '../../db';
import { getRepository } from 'typeorm';
export function addUsers(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
export function refreshToken(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
export function addGames(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
export function removeGame(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
export function removeUser(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
export function deleteGroup(req: Request, res: Response, { slug }: Group) {
  const repository = getRepository(Group);
  return repository
    .findOne({ slug })
    .then(group => repository.remove(group))
    .then(() => res.redirect('/groups'));
}
export function updateGroup(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
