var express = require('express'),
    router = express.Router(),
    tournament = require('../models/tournament.js');

router.get('/', function(req, res) {
    tournament.find({}).populate('gameId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve tournaments', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    tournament.findById(id).populate('gameId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve tournament', message: err.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }
        res.status(200).json(data);
    });
});

router.post('/', function(req, res) {
    var obj = req.body;
    var model = new tournament(obj);
    
    model.save(function(err, savedTournament) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create tournament', message: err.message });
            return;
        }
        tournament.findById(savedTournament._id).populate('gameId').exec(function(err, populatedTournament) {
            if (err) {
                res.status(201).json(savedTournament);
                return;
            }
            res.status(201).json(populatedTournament);
        });
    });
});

router.post('/:id', function(req, res) {
    var id = req.params.id;
    var obj = req.body;

    tournament.findByIdAndUpdate(id, {
        name: obj.name,
        gameId: obj.gameId,
        startDate: obj.startDate,
        endDate: obj.endDate,
        prizePool: obj.prizePool,
        location: obj.location,
        format: obj.format,
        status: obj.status,
        description: obj.description
    }, { new: true, runValidators: true }).populate('gameId').exec(function(err, updatedTournament) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to update tournament', message: err.message });
            return;
        }
        if (!updatedTournament) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }
        res.status(200).json(updatedTournament);
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    tournament.findOneAndDelete({ _id: id }, function(err, deletedTournament) {
        if (err) {
            res.status(500).json({ error: 'Failed to delete tournament', message: err.message });
            return;
        }
        if (!deletedTournament) {
            res.status(404).json({ error: 'Tournament not found' });
            return;
        }
        res.status(200).json({ message: 'Tournament deleted successfully' });
    });
});

module.exports = router;

