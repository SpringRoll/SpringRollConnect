import { Request, Response, NextFunction } from 'express';
import { user } from './user';

// If the user is logged in
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('redirect', req.originalUrl);
  res.redirect('/login');
}

// Access function if user is not logged in
export function isAnonymous(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }

  req.flash('redirect', req.originalUrl);
  res.redirect('/');
}

// Editor privilege can:
// - create a new project
// - delete a project
// - manage groups for which you're a member\
export function isEditor(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user) {
    req.flash('redirect', req.originalUrl);
    return res.redirect('/login');
  }

  return user(req).isEditor ? next() : res.redirect('/');
}

// Admin can:
// - create a new group
// - manage existing groups
// - change group permissions
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    req.flash('redirect', req.originalUrl);
    return res.redirect('/login');
  }

  return user(req).isAdmin ? next() : res.redirect('/');
}
