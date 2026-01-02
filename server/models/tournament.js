var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var tournamentSchema = new Schema({
    _id: { type: objectId, auto: true },
    
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 200
    },
    
    gameId: { 
        type: objectId, 
        ref: 'gameModel', 
        required: true 
    },
    
    startDate: { 
        type: Date, 
        required: true 
    },
    
    endDate: { 
        type: Date, 
        required: true 
    },
    
    prizePool: { 
        type: Number,
        min: 0
    },
    
    location: { 
        type: String,
        trim: true,
        maxlength: 200
    },
    
    format: { 
        type: String,
        trim: true,
        maxlength: 100
    },
    
    status: { 
        type: String, 
        default: 'upcoming',
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled']
    },
    
    description: { 
        type: String,
        maxlength: 2000
    }
}, {
    versionKey: false,
    timestamps: true
});

tournamentSchema.pre('save', function(next) {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
        var error = new Error('End date must be after start date');
        return next(error);
    }
    next();
});

var tournament = mongoose.model('tournamentModel', tournamentSchema, 'tournaments');

module.exports = tournament;

