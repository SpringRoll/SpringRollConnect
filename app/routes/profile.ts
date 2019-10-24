import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../db/entities';
import { validate } from 'class-validator';
const router = Router();

router.get('/', function(req: Request, res: Response) {
  res.render('profile', {
    errors: [],
    success: req.flash('success')
  });
});

router.post('/', async function(req: Request, res: Response) {
  const userRepo = getRepository(User);
  const user = userRepo.merge(<User>req.user, req.body);

  validate(user)
    .catch(errors =>
      res.render('profile', {
        errors,
        success: null
      })
    )
    .then(() =>
      userRepo
        .update((<User>req.user).id, req.body)
        .catch(err => Promise.reject(err))
    )
    .catch(({ message }) => {
      let msg = 'An error occurred while updating';
      if (/duplicate.+username/.test(message)) {
        msg = 'A user with that username already exists';
      } else if (/duplicate.+email/.test(message)) {
        msg = 'A user with that email already exists';
      }
      req.flash('error');
      res.render('profile', {
        errors: [{ msg }]
      });
    })
    .then(
      () => (
        req.flash('success', 'Profile saved!'), res.redirect(req.originalUrl)
      )
    );
});

module.exports = router;
