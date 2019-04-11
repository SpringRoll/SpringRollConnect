import { Game, User, GroupPermission } from '../../db/entities';
import { mapCapabilities } from '../../db/json';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

const router = require('express').Router();

router.post('/', function(req, res) {
  const GameRepository = getRepository(Game);
  const GroupRepository = getRepository(GroupPermission);
  if (!req.body.thumbnail) {
    const { thumbnail, ...body } = req.body;
    req.body = body;
  }

  const group = (<User>req.user).groups.find(({ isUserGroup }) => isUserGroup);
  req.body.capabilities = mapCapabilities(req.body.capabilities);
  const game = GameRepository.create(<object>req.body);

  validate(game, {
    skipMissingProperties: true,
    validationError: { target: false }
  }).then(errors => {
    if (0 < errors.length) {
      res.render('games/add', {
        errors: errors.map(error => ({
          msg: `${Object.values(error.constraints).join(' , ')}`
        }))
      });
    }

    GameRepository.insert(game)
      .then(result => {
        const [{ uuid }] = result.generatedMaps;
        GroupRepository.insert(
          GroupRepository.create({
            gameID: uuid,
            groupID: group.id,
            permission: 2
          })
        ).then(() =>
          res.render('games/add', {
            success: 'Game added successfully'
          })
        );
      })
      .catch(() => {
        return res.render('games/add', {
          error: 'Unable to add the game'
        });
      });
  });
});

router.get('/', (_, res) => res.render('games/add'));

module.exports = router;
