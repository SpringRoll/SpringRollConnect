import { Game } from '../../db/entities';
import { getConnection } from 'typeorm';
import { validate } from 'class-validator';
const GameRepository = getConnection().getMongoRepository(Game);

const router = require('express').Router();

router.post('/', function(req, res) {
  const date = new Date();

  const game = GameRepository.create(<object>req.body);

  validate(game, {
    skipMissingProperties: true,
    validationError: { target: false }
  }).then(errors => {
    if (0 < errors.length) {
      return res.render('games/add', {
        errors: errors.map(error => ({
          msg: `${Object.values(error.constraints).join(' , ')}`
        }))
      });
    }
    GameRepository.save(game)
      .then(game => {
        return res.render('games/add', {
          success: 'Game added successfully'
        });
      })
      .catch(error => {
        console.log(String(error).red);
        return res.render('game/add', {
          error: 'Unable to add the game'
        });
      });
  });
});

router.get('/', function(req, res) {
  res.render('games/add');
});

module.exports = router;