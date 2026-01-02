var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var gameSchema = new Schema({
    _id: { type: objectId, auto: true },
    
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    
    abbreviation: { 
        type: String, 
        required: true,
        trim: true,
        uppercase: true,
        maxlength: 10
    },
    
    genre: { 
        type: String,
        trim: true,
        maxlength: 50
    },
    
    publisher: { 
        type: String,
        trim: true,
        maxlength: 100
    },
    
    releaseDate: { 
        type: Date 
    },
    
    description: { 
        type: String,
        maxlength: 500
    }
}, {
    versionKey: false,
    timestamps: true
});

var game = mongoose.model('gameModel', gameSchema, 'games');

module.exports = game;

