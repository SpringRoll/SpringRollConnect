import { Request, Response } from 'express';
import { Group, GroupPermission, Game } from '../../db';
import { getRepository, In } from 'typeorm';
export function addUsers(req: Request, res: Response) {
  //TODO: Implement
  return res.redirect(req.originalUrl);
}
export function refreshToken(req: Request, res: Response) {
  return getRepository(Group)
    .findOne({ slug: req.params.slug })
    .then(group => group.refreshToken())
    .finally(() => res.redirect(req.originalUrl));
}
interface addGamesBody {
  permission: number | string;
  game: string | Array<string>;
}
export function addGames(
  req: Request,
  res: Response,
  { permission, game }: addGamesBody
) {
  return Promise.all([
    getRepository(Group).findOne({ slug: req.params.slug }),
    getRepository(Game).find({
      where: { slug: Array.isArray(game) ? In(game) : game }
    })
  ])
    .then(([group, games]) => {
      const repository = getRepository(GroupPermission);
      permission = Number(permission);

      const permissions = games.map(game =>
        repository.create({ permission: Number(permission), game, group })
      );

      return repository.save(permissions);
    })
    .finally(() => res.redirect(req.originalUrl));
}

export function removeGame(
  req: Request,
  res: Response,
  { game }: { game: string }
) {
  const repository = getRepository(GroupPermission);
  return getRepository(Group)
    .findOne({ slug: req.params.slug })
    .then(group => repository.findOne({ group: group, gameID: game }))
    .then(permission => repository.remove(permission))
    .finally(() => res.redirect(req.originalUrl));
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
