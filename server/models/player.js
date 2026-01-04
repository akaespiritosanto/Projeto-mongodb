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
    },
    stats: {
        matchesPlayed: { 
            type: Number, 
            default: 0,
            min: 0
        },
        matchesWon: { 
            type: Number, 
            default: 0,
            min: 0
        },
        matchesLost: { 
            type: Number, 
            default: 0,
            min: 0
        },
        winRate: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        kills: { 
            type: Number, 
            default: 0,
            min: 0
        },
        deaths: { 
            type: Number, 
            default: 0,
            min: 0
        },
        assists: { 
            type: Number, 
            default: 0,
            min: 0
        },
        kda: { 
            type: Number, 
            default: 0,
            min: 0
        },
        headshots: { 
            type: Number, 
            default: 0,
            min: 0
        },
        headshotPercentage: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        averageDamagePerRound: { 
            type: Number, 
            default: 0,
            min: 0
        },
        clutchesWon: { 
            type: Number, 
            default: 0,
            min: 0
        },
        mvpAwards: { 
            type: Number, 
            default: 0,
            min: 0
        },
        tournamentsPlayed: { 
            type: Number, 
            default: 0,
            min: 0
        },
        tournamentsWon: { 
            type: Number, 
            default: 0,
            min: 0
        },
        totalPrizeMoney: { 
            type: Number, 
            default: 0,
            min: 0
        },
        currentRating: { 
            type: Number, 
            default: 1000,
            min: 0
        },
        peakRating: { 
            type: Number, 
            default: 1000,
            min: 0
        },
        worldRanking: { 
            type: Number,
            min: 1
        },
        lastUpdated: { 
            type: Date, 
            default: Date.now 
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

playerSchema.pre('save', function(next) {
    if (this.stats) {
        if (this.stats.matchesPlayed > 0) {
            this.stats.winRate = Math.round((this.stats.matchesWon / this.stats.matchesPlayed) * 100 * 100) / 100;
        }
        if (this.stats.deaths > 0) {
            this.stats.kda = Math.round(((this.stats.kills + this.stats.assists) / this.stats.deaths) * 100) / 100;
        } else if (this.stats.kills > 0 || this.stats.assists > 0) {
            this.stats.kda = this.stats.kills + this.stats.assists;
        }
        if (this.stats.kills > 0) {
            this.stats.headshotPercentage = Math.round((this.stats.headshots / this.stats.kills) * 100 * 100) / 100;
        }
        if (this.stats.currentRating > this.stats.peakRating) {
            this.stats.peakRating = this.stats.currentRating;
        }
        this.stats.lastUpdated = new Date();
    }
    next();
});

var player = mongoose.model('playerModel', playerSchema, 'players');

module.exports = player;

