import { pagination, isAdmin, user, permissions } from '../../helpers';
import { Router } from 'express';
import { Request, Response } from 'express';
import { getRepository, In } from 'typeorm';
import { Game, Release, mapCapabilities, GroupPermission } from '../../db';
import { validate } from 'class-validator';

const router = Router();
const RELEASE_PAGE_LIMIT = 10;

function renderPage(
  req: Request,
  res: Response,
  template: string,
  {
    success,
    error,
    errors
  }: { success?: string; error?: string; errors?: Array<any> } = {}
) {
  const page = req.params.number ? Number(req.params.number) - 1 : 0;

  const take = page * RELEASE_PAGE_LIMIT;
  return user(req)
    .getGame({ slug: req.params.slug }, 'groups')
    .then(async ({ game, permission, token }) =>
      res.render(template, {
        game,
        token,
        host: req.headers.host,
        ...permissions(permission),
        success,
        error,
        errors,
        releases: game.releases.slice(take, take + RELEASE_PAGE_LIMIT),
        pagination: pagination(
          game.releases.length,
          req.params.number || 0,
          `/games/${game.slug}/releases`,
          10
        )
      })
    );
}

router.get(
  '/:order(alphabetical|latest)?/:local(page)?/:number([0-9]+)?',
  (req, res) =>
    user(req)
      .getPermittedGameIds(0)
      .then(async gameIds =>
        1 > gameIds.length
          ? [[], 0]
          : getRepository(Game).findAndCount({
              where: { uuid: In(gameIds) },
              select: ['thumbnail', 'title', 'slug'],
              relations: ['releases'],
              skip: 1 < req.params.number ? (req.params.number - 1) * 24 : 0,
              order:
                req.params.order === 'alphabetical'
                  ? { title: 'ASC' }
                  : { updated: 'DESC' }
            })
      )
      .then(([games, count]) =>
        res.render('games', {
          games,
          pagination: pagination(count, req.params.number, '/games')
        })
      )
);

router.get('/:slug', function(req, res) {
  return renderPage(req, res, 'games/game');
});

router.use('/:slug/privileges', isAdmin);
router.get('/:slug/privileges', function(req, res) {
  getRepository(Game)
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.groups', 'groups')
    .leftJoinAndSelect('game.releases', 'releases')
    .leftJoinAndSelect('groups.group', 'group')
    .where({ slug: req.params.slug })
    .orderBy('groups.id', 'DESC')
    .getOne()
    .then(game => {
      return res.render('games/privileges', { host: req.headers.host, game });
    });

  // have to pass addt'l param to resolve Group objects
});

router.post('/:slug/privileges', function(req, res) {
  const repository = getRepository(GroupPermission);
  return getRepository(Game)
    .findOne({ slug: req.params.slug })
    .then(game => {
      const url = `/games/${req.params.slug}/privileges`;
      switch (req.body.action) {
        case 'addGroup':
          const permission = repository.create({
            permission: Number(req.body.permission),
            groupID: Number(req.body.group),
            game
          });

          validate(permission, { skipMissingProperties: true })
            .then(errors =>
              0 < errors.length ? Promise.reject() : Promise.resolve()
            )
            .then(() => repository.save(permission))
            .finally(() => res.redirect(url));
          return;
        case 'changePermission':
          repository
            .findOne({ gameID: game.uuid, groupID: Number(req.body.group) })
            .then(permission => {
              permission.permission = Number(req.body.permission);
              validate(permission, { skipMissingProperties: true })
                .then(errors =>
                  0 < errors.length ? Promise.reject() : Promise.resolve()
                )
                .then(() => repository.save(permission))
                .finally(() => res.redirect(url));
            });
          return;
        case 'removeGroup':
          repository
            .findOne({ groupID: Number(req.body.group) })
            .then(permission => repository.remove(permission))
            .finally(() => res.redirect(url));
          return;
        default:
          return res.redirect(url);
      }
    });
});

router.get('/:slug/releases/:local(page)?/:number([1-9][0-9]?*)?', (req, res) =>
  renderPage(req, res, 'games/releases')
);

router.post('/:slug/releases', (req, res) => {
  const releaseRepository = getRepository(Release);

  return user(req)
    .getPermittedGameIds(1)
    .then(gameIds =>
      0 === gameIds.length
        ? null
        : getRepository(Game).findOne({
            where: { slug: req.params.slug, uuid: In(gameIds) }
          })
    )
    .then(async game => {
      if (!game) {
        return renderPage(req, res, 'games/releases', {
          error: 'Unable to add release'
        });
      }

      const release = releaseRepository.create({
        ...req.body,
        gameUuid: game.uuid,
        updatedById: req.user.id,
        capabilities: mapCapabilities(req.body.capabilities)
      });

      const hasErrors = await validate(release, {
        skipMissingProperties: true
      });

      if (0 < hasErrors.length) {
        return renderPage(req, res, 'games/releases', {
          error: 'Invalid Release Data'
        });
      }

      return releaseRepository
        .insert(release)
        .then(() =>
          renderPage(req, res, 'games/releases', { success: 'Release added' })
        )
        .catch(({ message }) =>
          renderPage(req, res, 'games/releases', {
            error: <string>message.split('"')[0]
          })
        );
    });
});

// 307 maintains PATCH verb
router.patch('/:slug/releases/:commit_id', (req, res) =>
  res.redirect(307, '/releases/' + req.body.commitId)
);

router.patch('/:slug', function(req, res) {
  const repository = getRepository(Game);

  const updates = repository.create(<object>{
    ...req.body,
    capabilities: mapCapabilities(req.body.capabilities),
    updated: new Date(),
    thumbnail:
      req.body.thumbnail && 0 < req.body.thumbnail.length
        ? req.body.thumbnail
        : undefined,
    slug: req.params.slug
  });

  validate(updates, { skipMissingProperties: true })
    .then(async errors =>
      0 < errors.length ? Promise.reject() : Promise.resolve()
    )
    .then(() => getRepository(Game).findOne({ slug: updates.slug }))
    .then(game =>
      repository
        .update({ slug: game.slug }, { ...game, ...updates })
        .then(() =>
          res.redirect(
            `/${game.isArchived ? 'archive' : 'games'}/${updates.slug}`
          )
        )
    )
    .catch(errors => res.redirect('/games'));
});

// router.delete('/:slug', function(req, res) {
//   Game.getBySlug(req.params.slug)
//     .then(game => {
//       if (game.isArchived) {
//         game.remove();
//       } else {
//         game.isArchived = true;
//         game.save(function(err) {
//           if (err) {
//             return done(err);
//           }
//         });
//       }
//     })
//     .then(() => {
//       res.redirect('/');
//     });
// });

module.exports = router;
