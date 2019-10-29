import { Router } from 'express';
import { Release, mapCapabilities, Game, User } from '../../db';
import { getRepository } from 'typeorm';
import { user } from '../../helpers';
import { validate } from 'class-validator';
import { sanitize } from 'class-sanitizer';
const router = Router();

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
      console.log(release.game);
    })
);

router.patch('/:commit_id', async (req, res) => {
  if (req.body.capabilities) {
    req.body.capabilities = mapCapabilities(req.body.capabilities);
  }
  const repository = getRepository(Release);

  repository
    .findOne({
      where: { commitId: req.body.commitId },
      relations: ['game']
    })
    .then(({ game, ...release }) => {
      const updatedRelease = repository.create(<object>{
        ...release,
        ...req.body,
        updatedById: (<User>req.user).id,
        updated: new Date()
      });
      sanitize(updatedRelease);
      validate(updatedRelease, { skipMissingProperties: true })
        .then(errors =>
          0 < errors.length ? Promise.reject(errors) : Promise.resolve()
        )
        .catch(errors => (console.log(errors), Promise.reject()))
        .then(() => repository.update(release.id, updatedRelease))
        .then(() =>
          res.redirect(
            `/${game.isArchived ? 'archive' : 'games'}/${game.slug}/releases`
          )
        )
        .catch(
          error => (
            req.flash('error', 'Unable to update release'),
            res.redirect(req.originalUrl)
          )
        );
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
