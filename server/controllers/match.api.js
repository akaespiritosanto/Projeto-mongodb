var express = require('express'),
    router = express.Router(),
    match = require('../models/match.js');

router.get('/', function(req, res) {
    match.find({}).populate('tournamentId gameId team1Id team2Id winnerId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve matches', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    match.findById(id).populate('tournamentId gameId team1Id team2Id winnerId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve match', message: err.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: 'Match not found' });
            return;
        }
        res.status(200).json(data);
    });
});

router.post('/', function(req, res) {
    var obj = req.body;
    var model = new match(obj);
    
    model.save(function(err, savedMatch) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create match', message: err.message });
            return;
        }
        match.findById(savedMatch._id).populate('tournamentId gameId team1Id team2Id winnerId').exec(function(err, populatedMatch) {
            if (err) {
                res.status(201).json(savedMatch);
                return;
            }
            res.status(201).json(populatedMatch);
        });
    });
});

router.post('/:id', function(req, res) {
    var id = req.params.id;
    var obj = req.body;

    match.findByIdAndUpdate(id, {
        tournamentId: obj.tournamentId,
        gameId: obj.gameId,
        team1Id: obj.team1Id,
        team2Id: obj.team2Id,
        team1Score: obj.team1Score,
        team2Score: obj.team2Score,
        matchDate: obj.matchDate,
        status: obj.status,
        round: obj.round,
        bestOf: obj.bestOf,
        winnerId: obj.winnerId
    }, { new: true, runValidators: true }).populate('tournamentId gameId team1Id team2Id winnerId').exec(function(err, updatedMatch) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to update match', message: err.message });
            return;
        }
        if (!updatedMatch) {
            res.status(404).json({ error: 'Match not found' });
            return;
        }
        res.status(200).json(updatedMatch);
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    match.findOneAndDelete({ _id: id }, function(err, deletedMatch) {
        if (err) {
            res.status(500).json({ error: 'Failed to delete match', message: err.message });
            return;
        }
        if (!deletedMatch) {
            res.status(404).json({ error: 'Match not found' });
            return;
        }
        res.status(200).json({ message: 'Match deleted successfully' });
    });
});

module.exports = router;

