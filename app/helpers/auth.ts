import { PassportStatic } from 'passport';
import { User } from '../db';
import { getRepository } from 'typeorm';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { compareSync } from 'bcryptjs';

module.exports = function(passport: PassportStatic) {
  // Passport also needs to serialize and deserialize
  // user instance from a session store in order to
  // support login sessions, so that every subsequent
  // request will not contain the user credentials.
  // It provides two method:
  passport.serializeUser(function(user: User, done: Function) {
    done(null, user, user.id);
  });

  passport.deserializeUser(function(id: number, done: Function) {
    getRepository(User)
      .findByIds([id])
      .then(([user]) => done(null, user))
      .catch(err => done(err));
  });

  passport.use(
    'login',
    new Strategy(
      {
        passReqToCallback: true
      },
      (req: Request, username: string, password: string, done: Function) => {
        // check in mongo if a user with username exists or not
        getRepository(User)
          .findOne({
            where: { username },
            select: ['id', 'password', 'active']
          })
          .then(user => {
            let error;
            switch (true) {
              case !user:
                error = 'User Not Found';
                break;
              case !user.active:
                error = 'Deactivated Account';
                break;
              case !compareSync(password, user.password):
                error = 'Invalid Password';
                break;
            }
            return error
              ? done(null, false, req.flash('error', error))
              : done(null, user);
          })
          .catch(err => done(err));
      }
    )
  );
};
