import { pagination, isAdmin, user, permissions } from '../../helpers';
import { Router } from 'express';
import { Request, Response } from 'express';
import { getRepository, In } from 'typeorm';
import { Game, Release } from '../../db';
import { validate } from 'class-validator';

const router = Router();

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
  return user(req)
    .getGame({ slug: req.params.slug }, 'groups')
    .then(async ({ game, permission, token }) => {
      console.log();
      return res.render(template, {
        game,
        token,
        host: req.headers.host,
        ...permissions(permission),
        success,
        error,
        errors
      });
    });
}

router.get(
  '/:order(alphabetical|latest)?/:local(page)?/:number([0-9]+)?',
  (req, res) =>
    user(req)
      .getPermittedGameIds(0)
      .then(gameIds =>
        getRepository(Game).findAndCount({
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
      .then(([games, count]) => {
        return res.render('games', {
          games,
          pagination: pagination(count, req.params.number, '/games')
        });
      })
);

router.get('/:slug', function(req, res) {
  return renderPage(req, res, 'games/game');
});

router.use('/:slug/privileges', isAdmin);
router.get('/:slug/privileges', function(req, res) {
  getRepository(Game)
    .findOne({
      where: { slug: req.params.slug },
      join: {
        alias: 'game',
        leftJoinAndSelect: {
          groups: 'game.groups',
          releases: 'game.releases',
          group: 'groups.group'
        }
      }
    })
    .then(game => {
      return res.render('games/privileges', { host: req.headers.host, game });
    });

  // have to pass addt'l param to resolve Group objects
});

// router.post('/:slug/privileges', function(req, res) {
//   Game.getBySlug(req.params.slug)
//     .then(game => {
//       const render = () =>
//         renderPage(req, res, 'games/privileges', 'groups.group');
//       switch (req.body.action) {
//         case 'addGroup':
//           Game.addGroup(game._id, req.body.group, req.body.permission, render);
//           break;
//         case 'changePermission':
//           game.changePermission(req.body.group, req.body.permission, render);
//           break;
//         case 'removeGroup':
//           game.removeGroup(req.body.group, render);
//           break;
//         default:
//           render();
//           break;
//       }
//     })
//     .catch(err => {
//       console.error('Privileges error', err);
//       res.status(404).render('404');
//     });
// });

router.get('/:slug/releases', (req, res) =>
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
        updatedById: req.user.id
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
        .save(release)
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

// router.patch('/:slug', function(req, res) {
//   let errors = validateRequest(req);
//   if (errors) {
//     return handleError(errors);
//   }

//   defaultCapabilities(req.body.capabilities);

//   req.body.updated = Date.now();

//   Game.getBySlug(req.params.slug)
//     .then(game => {
//       return Game.findByIdAndUpdate(game._id, req.body);
//     })
//     .then(game => {
//       // have to re-get because slug may have changed
//       Game.findById(game._id).then(game => {
//         if (game.isArchived) {
//           res.redirect('/archive/' + game.slug);
//         } else {
//           res.redirect('/games/' + game.slug);
//         }
//       });
//     });
// });

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
