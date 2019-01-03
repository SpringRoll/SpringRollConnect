var router = require('express').Router();
var log = require('../helpers/logger');
var Group = require('../models/group');

router.get('/:slug*', function(req, res)
{
  // check that the currently used token is still valid before even loading the page. This will prevent users from
  // loading a game, only to receive a vague "Invalid API Request" message.
  const token = req.query.token;

  Group.findOne({ token : token })
    .then(function(group) {
      // if no group was found, redirect them back to the releases page with an appropriate message
      if (group === null) {
        log.warn('Failed to load group for token ' + token + ' when embedding game');
        req.flash('error', 'Unable to view game. Unable to find group for API token ' + token);
        res.redirect('/games/' + req.params.slug + '/releases');
        return;
      }

      const now = new Date();

      // if the token has expired, redirect the user back to the releases page with an appropriate message
      if (group.tokenExpires !== null && group.tokenExpires < now) {
        log.warn('Group ' + group.name + ' attempting to load game ' + req.params.slug + ' with expired token ' + token);
        req.flash('error', 'Unable to view game. The ' + group.name + ' API token has expired.');
        res.redirect('/games/' + req.params.slug + '/releases');
        return;
      }

      // otherwise render the game
      res.render('embed', {
        isDebug: !!req.query.status ||
          !!req.query.version || 
            !!req.query.commitId
      });
    })
    .catch(function(err) {
      // if there was any uncaught exception, log it and still provide some sort of response.
      log.error('Error fetching group for token ' + token);
      log.error(err);

      req.flash('error', 'Unable to view game.');
      res.redirect('/games/' + req.params.slug + '/releases');
      return;
    });
});

module.exports = router;
