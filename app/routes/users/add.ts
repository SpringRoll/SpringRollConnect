import { Router } from 'express';
import { User, Group } from '../../db';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { hash, genSalt } from 'bcryptjs';

const router = Router();

router.post('/', async (req, res) => {
  if (!req.body.confirm || req.body.password !== req.body.confirm) {
    req.flash('errors', <any>{ msg: "Passwords don't match" });
    return res.redirect('/users/add');
  }

  const userRepo = getRepository(User);
  const user = userRepo.create(<object>req.body);
  user.groups = [
    getRepository(Group).create({
      name: user.name,
      slug: user.username,
      isUserGroup: true,
      privilege: Number(req.body.privilege),
      token: Group.generateToken()
    })
  ];

  validate(user, { skipMissingProperties: true })
    .then(errors =>
      errors.length ? Promise.reject('Must provide a valid email') : undefined
    )
    .then(() => genSalt(10))
    .then(salt => hash(user.password, salt))
    .then(password => ((user.password = password), user))
    .then(user => userRepo.save(user))
    .catch(error => {
      const msg = error.detail
        ? `A user already exists with this ${
            /username/g.test(error.detail) ? 'username' : 'email'
          }.`
        : error;
      return Promise.reject(msg);
    })
    .then(() =>
      req.flash('success', req.body.name + ' has been added successfully')
    )
    .catch(err => req.flash('error', err))
    .finally(() => res.redirect('/users/add'));
});

router.get('/', (req, res) =>
  res.render('users/add', {
    error: req.flash('error'),
    errors: req.flash('errors'),
    success: req.flash('success')
  })
);

module.exports = router;
