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

router.get('/rankings/by-rating', function(req, res) {
    var gameId = req.query.gameId;
    var query = {};
    
    if (gameId) {
        query.gameId = gameId;
    }
    
    player.find(query)
        .populate('gameId teamId')
        .sort({ 'stats.currentRating': -1, 'stats.kda': -1, 'stats.winRate': -1 })
        .limit(50)
        .exec(function(err, data) {
            if (err) {
                res.status(500).json({ error: 'Failed to retrieve rankings', message: err.message });
                return;
            }
            
            var rankings = data.map(function(player, index) {
                var playerObj = player.toObject();
                playerObj.rankPosition = index + 1;
                return playerObj;
            });
            
            res.status(200).json(rankings);
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
        bio: obj.bio,
        stats: obj.stats
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

router.get('/:id/stats', function(req, res) {
    var id = req.params.id;
    player.findById(id, 'username realName stats').populate('gameId teamId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve player stats', message: err.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json({
            player: {
                _id: data._id,
                username: data.username,
                realName: data.realName,
                gameId: data.gameId,
                teamId: data.teamId
            },
            stats: data.stats || {}
        });
    });
});

router.put('/:id/stats', function(req, res) {
    var id = req.params.id;
    var statsUpdate = req.body;
    
    player.findByIdAndUpdate(
        id, 
        { $set: { stats: statsUpdate } }, 
        { new: true, runValidators: true }
    ).populate('gameId teamId').exec(function(err, updatedPlayer) {
        if (err) {
            res.status(400).json({ error: 'Failed to update player stats', message: err.message });
            return;
        }
        if (!updatedPlayer) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json(updatedPlayer);
    });
});

router.patch('/:id/stats', function(req, res) {
    var id = req.params.id;
    var statsUpdate = {};
    
    Object.keys(req.body).forEach(function(key) {
        statsUpdate['stats.' + key] = req.body[key];
    });
    
    player.findByIdAndUpdate(
        id, 
        { $set: statsUpdate }, 
        { new: true, runValidators: true }
    ).populate('gameId teamId').exec(function(err, updatedPlayer) {
        if (err) {
            res.status(400).json({ error: 'Failed to update player stats', message: err.message });
            return;
        }
        if (!updatedPlayer) {
            res.status(404).json({ error: 'Player not found' });
            return;
        }
        res.status(200).json(updatedPlayer);
    });
});

module.exports = router;

