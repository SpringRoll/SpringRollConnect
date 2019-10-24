import { Request, Response } from 'express';
import { Group, GroupPermission, Game, User } from '../../db';
import { getRepository, In } from 'typeorm';
import { validate } from 'class-validator';
export function addUsers(req: Request, res: Response) {
  const userRepository = getRepository(User);
  return Promise.all([
    getRepository(Group).findOne({ slug: req.params.slug }),
    userRepository.findOne(req.body.user)
  ])
    .then(([group, user]) => {
      user.groups.push(group);
      return userRepository.save(user);
    })
    .finally(() => res.redirect(req.originalUrl));
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
  console.log(permission, game);
  return Promise.all([
    getRepository(Group).findOne({ slug: req.params.slug }),
    getRepository(Game).find({
      where: { slug: Array.isArray(game) ? In(game) : game }
    })
  ])
    .then(([group, games]) => {
      console.log(group, games);
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
  const userRepository = getRepository(User);
  return userRepository
    .findOne(req.body.user)
    .then(user => {
      user.groups = user.groups.filter(({ slug }) => slug !== req.params.slug);
      return userRepository.save(user);
    })
    .finally(() => res.redirect(req.originalUrl));
}
export function deleteGroup(req: Request, res: Response, { slug }: Group) {
  const repository = getRepository(Group);
  return repository
    .findOne({ slug })
    .then(group => repository.remove(group))
    .then(() => res.redirect('/groups'));
}
export function updateGroup(req: Request, res: Response) {
  const repository = getRepository(Group);

  return repository.findOne({ slug: req.body.slug }).then(group => {
    const { logo, tokenExpires, privilege, ...update } = req.body;

    group = repository.merge(group, update, {
      logo: logo ? logo : undefined,
      tokenExpires: 'true' == tokenExpires ? new Date() : undefined,
      privilege: Number(privilege)
    });

    return validate(group, { skipMissingProperties: true })
      .then(errors =>
        0 < errors.length ? Promise.reject(errors) : Promise.resolve()
      )
      .catch(err => console.log(err))
      .then(() => repository.save(group))
      .finally(() => res.redirect(req.originalUrl));
  });
}
