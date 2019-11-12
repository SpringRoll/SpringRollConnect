/**
 * Helper middleware to enable caching for API routes. This middleware ignores
 * requests that are for games in DEV.
 */
module.exports = function(req, res, next) {
  if (req.query.status !== 'dev') {
    res.set('Cache-Control', 'max-age=60');
  }

  next();
}
