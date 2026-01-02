var express = require('express'),
    router = express.Router(),
    game = require('../models/game.js');

router.get('/', function(req, res) {
    game.find({}, function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve games', message: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    game.findById(id, function(err, data) {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve game', message: err.message });
            return;
        }
        if (!data) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        res.status(200).json(data);
    });
});

router.post('/', function(req, res) {
    var obj = req.body;
    var model = new game(obj);
    
    model.save(function(err, savedGame) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create game', message: err.message });
            return;
        }
        res.status(201).json(savedGame);
    });
});

router.post('/:id', function(req, res) {
    var id = req.params.id;
    var obj = req.body;

    game.findByIdAndUpdate(id, {
        name: obj.name,
        abbreviation: obj.abbreviation,
        genre: obj.genre,
        publisher: obj.publisher,
        releaseDate: obj.releaseDate,
        description: obj.description
    }, { new: true, runValidators: true }, function(err, updatedGame) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ error: 'Validation error', message: err.message });
                return;
            }
            res.status(500).json({ error: 'Failed to update game', message: err.message });
            return;
        }
        if (!updatedGame) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        res.status(200).json(updatedGame);
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    game.findOneAndDelete({ _id: id }, function(err, deletedGame) {
        if (err) {
            res.status(500).json({ error: 'Failed to delete game', message: err.message });
            return;
        }
        if (!deletedGame) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        res.status(200).json({ message: 'Game deleted successfully' });
    });
});

module.exports = router;

