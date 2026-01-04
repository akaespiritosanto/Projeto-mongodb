var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var teamSchema = new Schema({
    _id: { type: objectId, auto: true },
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    abbreviation: { 
        type: String,
        trim: true,
        uppercase: true,
        maxlength: 10
    },
    gameId: { 
        type: objectId, 
        ref: 'gameModel', 
        required: true 
    },
    country: { 
        type: String,
        trim: true,
        maxlength: 100
    },
    region: { 
        type: String,
        trim: true,
        uppercase: true,
        maxlength: 10
    },
    foundedDate: { 
        type: Date 
    },
    logoUrl: { 
        type: String,
        trim: true,
        maxlength: 500
    },
    description: { 
        type: String,
        maxlength: 1000
    }
}, {
    versionKey: false,
    timestamps: true
});

var team = mongoose.model('teamModel', teamSchema, 'teams');

module.exports = team;

