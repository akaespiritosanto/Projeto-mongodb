var express = require('express'),
    router = express.Router(),
    statistics = require('../aggregations/statistics.js'),
    team = require('../models/team.js'),
    player = require('../models/player.js'),
    game = require('../models/game.js'),
    tournament = require('../models/tournament.js');

router.get('/team-rankings', function(req, res) {
    team.aggregate(statistics.getTeamRankings(), function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve team rankings', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/best-players', function(req, res) {
    player.aggregate(statistics.getBestPlayers(), function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve best players', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/team/:id', function(req, res) {
    var teamId = req.params.id;
    team.aggregate(statistics.getTeamStatistics(teamId), function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve team statistics', message: err.message });
            return;
        }
        if (!data || data.length === 0) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        res.status(200).json(data[0]);
    });
});

router.get('/player/:id', function(req, res) {
    var playerId = req.params.id;
    player.aggregate(statistics.getPlayerStatistics(playerId), function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve player statistics', message: err.message });
            return;
        }
        if (!data || data.length === 0) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json(data[0]);
    });
});

router.get('/popular-games', function(req, res) {
    game.aggregate(statistics.getMostPopularGames(), function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve popular games', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/tournaments-by-game', function(req, res) {
    tournament.aggregate(statistics.getTournamentStatisticsByGame(), function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve tournament statistics', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

module.exports = router;

