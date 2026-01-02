var express = require('express'),
    router = express.Router(),
    player = require('../models/player.js');

router.get('/', function(req, res) {
    player.find({}).populate('gameId teamId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve players', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    player.findById(id).populate('gameId teamId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve player', message: err.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json(data);
    });
});

router.post('/', function(req, res) {
    var obj = req.body;
    var model = new player(obj);
    
    model.save(function(err, savedPlayer) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create player', message: err.message });
            return;
        }
        player.findById(savedPlayer._id).populate('gameId teamId').exec(function(err, populatedPlayer) {
            if (err) {
                res.status(201).json(savedPlayer);
                return;
            }
            res.status(201).json(populatedPlayer);
        });
    });
});

router.post('/:id', function(req, res) {
    var id = req.params.id;
    var obj = req.body;

    player.findByIdAndUpdate(id, {
        username: obj.username,
        realName: obj.realName,
        gameId: obj.gameId,
        teamId: obj.teamId,
        country: obj.country,
        role: obj.role,
        birthDate: obj.birthDate,
        bio: obj.bio
    }, { new: true, runValidators: true }).populate('gameId teamId').exec(function(err, updatedPlayer) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to update player', message: err.message });
            return;
        }
        if (!updatedPlayer) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json(updatedPlayer);
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    player.findOneAndDelete({ _id: id }, function(err, deletedPlayer) {
        if (err) {
            res.status(500).json({ error: 'Failed to delete player', message: err.message });
            return;
        }
        if (!deletedPlayer) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json({ message: 'Player deleted successfully' });
    });
});

module.exports = router;

