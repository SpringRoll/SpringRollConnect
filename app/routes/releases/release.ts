import { Router, Request } from 'express';
import { Release, mapCapabilities, Game } from '../../db';
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
      release.game.capabilities = release.capabilities;
      res.render('games/release', {
        game: release.game,
        release,
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
    .then(({ game, id, capabilities, version, notes, status, commitId }) => {
      const body = req.body;
      const record = {
        capabilities: body.capabilities
          ? mapCapabilities(body.capabilities)
          : capabilities,
        version: body.version ? body.version : version,
        notes: body.notes ? body.notes : notes,
        status: body.status ? body.status : status,
        commitId: body.commitId ? body.commitId : commitId
      };

      repo
        .update(id, {
          ...record,
          updatedBy: req.user.id,
          updated: new Date()
        })
        .then(() => {
          const baseUrl = game.isArchived ? '/archive' : '/games';
          return res.redirect(`${baseUrl}/${game.slug}/releases`);
        });
    });
});

router.delete('/:commit_id', function(req, res) {
  const repository = getRepository(Release);
  return repository
    .findOne({ commitId: req.params.commit_id })
    .then(release => repository.remove(release))
    .then(release => getRepository(Game).findOne(release.gameUuid))
    .then(game => {
      req.flash('success', 'Deleted release');

      const baseUrl = game.isArchived ? '/archive' : '/games';

      return res.redirect(`${baseUrl}/${game.slug}/releases`);
    });
});

module.exports = router;
