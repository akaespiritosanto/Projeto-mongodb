var express = require('express'),
    router = express.Router(),
    team = require('../models/team.js');

router.get('/', function(req, res) {
    team.find({}).populate('gameId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve teams', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    team.findById(id).populate('gameId').exec(function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve team', message: err.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        res.status(200).json(data);
    });
});

router.post('/', function(req, res) {
    var obj = req.body;
    var model = new team(obj);
    
    model.save(function(err, savedTeam) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create team', message: err.message });
            return;
        }
        team.findById(savedTeam._id).populate('gameId').exec(function(err, populatedTeam) {
            if (err) {
                res.status(201).json(savedTeam);
                return;
            }
            res.status(201).json(populatedTeam);
        });
    });
});

router.post('/:id', function(req, res) {
    var id = req.params.id;
    var obj = req.body;

    team.findByIdAndUpdate(id, {
        name: obj.name,
        abbreviation: obj.abbreviation,
        gameId: obj.gameId,
        country: obj.country,
        region: obj.region,
        foundedDate: obj.foundedDate,
        logoUrl: obj.logoUrl,
        description: obj.description
    }, { new: true, runValidators: true }).populate('gameId').exec(function(err, updatedTeam) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to update team', message: err.message });
            return;
        }
        if (!updatedTeam) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        res.status(200).json(updatedTeam);
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    team.findOneAndDelete({ _id: id }, function(err, deletedTeam) {
        if (err) {
            res.status(500).json({ error: 'Failed to delete team', message: err.message });
            return;
        }
        if (!deletedTeam) {
            res.status(404).json({ error: 'Team not found' });
            return;
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    });
});

module.exports = router;

