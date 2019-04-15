import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Config } from '../db';
import { validate } from 'class-validator';
const router = Router();

router.get('/', async (req, res) =>
  res.render('configuration', {
    error: req.flash('error'),
    errors: req.flash('errors'),
    success: req.flash('success'),
    config: await getRepository(Config).findOne()
  })
);

router.post('/', function(req, res) {
  const repository = getRepository(Config);

  const config = repository.create({
    ...req.body,
    devExpireDays: Number(req.body.devExpireDays),
    maxDevReleases: Number(req.body.maxDevReleases),
    id: Number(req.body.id)
  });

  return validate(config, { skipMissingProperties: true })
    .then(errors =>
      0 < errors.length ? Promise.reject(errors) : Promise.resolve()
    )
    .catch(error =>
      req.flash(
        'error',
        'An error occurred while trying save the configuration'
      )
    )
    .then(() => repository.save(config))
    .then(() => {
      req.flash('success', 'Configuration saved!');
    })
    .finally(() => res.redirect('/configuration'));
});

module.exports = router;
