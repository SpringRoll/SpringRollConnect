import { Router } from 'express';

module.exports = Router().get('/', (req, res) => {
  req.logout();
  return res.redirect('/');
});
