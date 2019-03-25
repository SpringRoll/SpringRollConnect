import { pagination, isAdmin, user, permissions } from '../../helpers';
import { Router } from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Game } from '../../db';

const router = Router();

function renderPage(
  req: Request,
  res: Response,
  template: string,
  optionalData: object = {}
) {
  return user(req)
    .getGame({ slug: req.params.slug }, 'groups')
    .then(async ({ game, permission, token }) => {
      return res.render(template, {
        game,
        token,
        host: req.headers.host,
        ...optionalData,
        ...permissions(permission)
      });
    });
}

router.get(
  '/:order(alphabetical|latest)?/:local(page)?/:number([0-9]+)?',
  function(req, res) {
    const order = req.params.order || 'alphabetical';
    return user(req)
      .getGames({
        skip: 1 < req.params.number ? (req.params.number - 1) * 24 : 0,
        order
      })
      .then(([games, count]) => {
        return res.render('games', {
          games,
          pagination: pagination(count, req.params.number, '/games')
        });
      });
  }
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

// have to pass addt'l param to resolve Release objects
router.get('/:slug/releases', (req, res) =>
  renderPage(req, res, 'games/releases')
);

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
