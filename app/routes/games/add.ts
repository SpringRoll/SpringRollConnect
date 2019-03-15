import { Game } from '../../db/entities';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

const router = require('express').Router();

router.post('/', function(req, res) {
  const GameRepository = getRepository(Game);
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

    GameRepository.save(game)
      .then(() =>
        res.render('games/add', {
          success: 'Game added successfully'
        })
      )
      .catch(() =>
        res.render('game/add', {
          error: 'Unable to add the game'
        })
      );
  });
});

router.get('/', function(req, res) {
  res.render('games/add');
});

module.exports = router;
