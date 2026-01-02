var express = require('express'),
    router = express.Router();

router.use('/game', require('../controllers/game.api'));

router.use('/team', require('../controllers/team.api'));

router.use('/player', require('../controllers/player.api'));

router.use('/tournament', require('../controllers/tournament.api'));

router.use('/match', require('../controllers/match.api'));

router.use('/statistics', require('../controllers/statistics.api'));

module.exports = router;

