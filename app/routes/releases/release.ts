import { Router, Request } from 'express';
import { Release, mapCapabilities } from '../../db';
import { getRepository } from 'typeorm';
import { user } from '../../helpers';
const router = Router();
import { handleError } from '../games/helpers';
// const { defaultCapabilities, handleError } = require('../games/helpers');

router.get('/:commit_id', async (req, res) =>
  getRepository(Release)
    .findOne({
      where: { commitId: req.params.commit_id },
      join: {
        alias: 'release',
        leftJoinAndSelect: {
          game: 'release.game',
          releases: 'game.releases'
        }
      }
    })
    .then(async release => {
      const permission = await user(req).getGamePermission({
        uuid: release.game.uuid
      });
      res.render('games/release', {
        game: release.game,
        release,
        capabilities: release.capabilities,
        host: req.headers.host,
        isEditor: 1 <= permission,
        isAdmin: 2 <= permission,
        errors: req.flash('errors'),
        success: req.flash('success'),
        error: req.flash('error')
      });
    })
);

router.patch('/:commit_id', async function(
  req: Request & { checkBody: Function; validationErrors: Function },
  res
) {
  req.checkBody('commitId', 'Commit is a Git hash').isCommit();
  req.checkBody('status', 'Status must be a valid status').isStatus();
  req.checkBody('notes').optional();

  if (req.body.version)
    req
      .checkBody('version', 'Version must be a valid semantic version')
      .isSemver();

  var errors = req.validationErrors();

  if (errors) {
    return handleError(req, res, errors);
  }

  const repo = getRepository(Release);
  repo
    .findOne({
      where: { commitId: req.body.commitId },
      relations: ['game']
    })
    .then(({ game, id }) => {
      const { capabilities, version, notes, status, commitId } = req.body;
      repo
        .update(id, {
          commitId,
          version,
          capabilities: mapCapabilities(capabilities),
          notes,
          status,
          updatedBy: req.user.id,
          updated: new Date()
        })
        .then(() => {
          const baseUrl = game.isArchived ? '/archive' : '/games';
          return res.redirect(`${baseUrl}/${game.slug}/releases`);
        });
    });
});

// router.delete('/:commit_id', function(req, res) {
//   Release.removeById(req.body.release, async function(err) {
//     if (err) {
//       return handleError(err);
//     }
//     req.flash('success', 'Deleted release');
//     let game = await Game.getBySlug(req.body.game);
//     let baseUrl = '';
//     if (!game.isArchived) {
//       baseUrl = '/games';
//     } else {
//       baseUrl = '/archive';
//     }
//     res.redirect(baseUrl + '/' + game.slug + '/releases');
//   });
// });

module.exports = router;
