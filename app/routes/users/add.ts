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

  const userRepository = getRepository(User);
  const groupRepository = getRepository(Group);

  const user = userRepository.create(<object>req.body);
  const group = groupRepository.create({
    name: user.name,
    slug: user.username,
    isUserGroup: true,
    privilege: Number(req.body.privilege),
    token: Group.generateToken()
  });
  user.groups = [group];

  validate(user, { skipMissingProperties: true })
    .then(errors =>
      errors.length ? Promise.reject('Must provide a valid email') : undefined
    )
    .then(() => user.hashPassword())
    .then(user => userRepository.save(user))
    .catch(error => {
      console.log(error);
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
