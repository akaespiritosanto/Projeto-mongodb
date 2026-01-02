var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var matchSchema = new Schema({
    _id: { type: objectId, auto: true },
    
    tournamentId: { 
        type: objectId, 
        ref: 'tournamentModel', 
        required: true 
    },
    
    gameId: { 
        type: objectId, 
        ref: 'gameModel', 
        required: true 
    },
    
    team1Id: { 
        type: objectId, 
        ref: 'teamModel', 
        required: true 
    },
    
    team2Id: { 
        type: objectId, 
        ref: 'teamModel', 
        required: true 
    },
    
    team1Score: { 
        type: Number, 
        default: 0,
        min: 0
    },
    
    team2Score: { 
        type: Number, 
        default: 0,
        min: 0
    },
    
    matchDate: { 
        type: Date, 
        required: true 
    },
    
    status: { 
        type: String, 
        default: 'scheduled',
        enum: ['scheduled', 'live', 'completed', 'postponed', 'cancelled']
    },
    
    round: { 
        type: String,
        trim: true,
        maxlength: 100
    },
    
    bestOf: { 
        type: Number, 
        default: 1,
        min: 1,
        max: 7
    },
    
    winnerId: { 
        type: objectId, 
        ref: 'teamModel' 
    }
}, {
    versionKey: false,
    timestamps: true
});

matchSchema.pre('save', function(next) {
    if (this.team1Id && this.team2Id && this.team1Id.toString() === this.team2Id.toString()) {
        var error = new Error('Team 1 and Team 2 must be different');
        return next(error);
    }
    next();
});

var match = mongoose.model('matchModel', matchSchema, 'matches');

module.exports = match;

