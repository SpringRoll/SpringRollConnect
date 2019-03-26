import { Router } from 'express';

module.exports = Router().get('/:slug*', (req, res) =>
  res.render('embed', {
    isDebug: !!req.query.status || !!req.query.version || !!req.query.commitId
  })
);
