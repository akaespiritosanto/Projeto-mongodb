var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var playerSchema = new Schema({
    _id: { type: objectId, auto: true },
    
    username: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 50
    },
    
    realName: { 
        type: String,
        trim: true,
        maxlength: 100
    },
    
    gameId: { 
        type: objectId, 
        ref: 'gameModel', 
        required: true 
    },
    
    teamId: { 
        type: objectId, 
        ref: 'teamModel' 
    },
    
    country: { 
        type: String,
        trim: true,
        maxlength: 100
    },
    
    role: { 
        type: String,
        trim: true,
        maxlength: 50
    },
    
    birthDate: { 
        type: Date 
    },
    
    bio: { 
        type: String,
        maxlength: 1000
    }
}, {
    versionKey: false,
    timestamps: true
});

var player = mongoose.model('playerModel', playerSchema, 'players');

module.exports = player;

