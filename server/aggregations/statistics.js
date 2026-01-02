var mongoose = require('mongoose');
var match = require('../models/match.js');
var team = require('../models/team.js');
var player = require('../models/player.js');
var game = require('../models/game.js');
var tournament = require('../models/tournament.js');

function getTeamRankings() {
    return [
        {
            $lookup: {
                from: 'matches',
                localField: '_id',
                foreignField: 'team1Id',
                as: 'matchesAsTeam1'
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: '_id',
                foreignField: 'team2Id',
                as: 'matchesAsTeam2'
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                allMatches: {
                    $concatArrays: ['$matchesAsTeam1', '$matchesAsTeam2']
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                completedMatches: {
                    $filter: {
                        input: '$allMatches',
                        as: 'match',
                        cond: { $eq: ['$$match.status', 'completed'] }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                totalMatches: { $size: '$completedMatches' },
                wins: {
                    $size: {
                        $filter: {
                            input: '$completedMatches',
                            as: 'match',
                            cond: { $eq: ['$$match.winnerId', '$_id'] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                totalMatches: 1,
                wins: 1,
                losses: { $subtract: ['$totalMatches', '$wins'] },
                winPercentage: {
                    $cond: {
                        if: { $gt: ['$totalMatches', 0] },
                        then: {
                            $multiply: [
                                { $divide: ['$wins', '$totalMatches'] },
                                100
                            ]
                        },
                        else: 0
                    }
                }
            }
        },
        {
            $match: {
                totalMatches: { $gt: 0 }
            }
        },
        {
            $sort: {
                winPercentage: -1,
                wins: -1
            }
        },
        {
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'game'
            }
        },
        {
            $unwind: {
                path: '$game',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                abbreviation: 1,
                game: {
                    name: '$game.name',
                    abbreviation: '$game.abbreviation'
                },
                country: 1,
                region: 1,
                totalMatches: 1,
                wins: 1,
                losses: 1,
                winPercentage: { $round: ['$winPercentage', 2] }
            }
        }
    ];
}

function getBestPlayers() {
    return [
        {
            $lookup: {
                from: 'teams',
                localField: 'teamId',
                foreignField: '_id',
                as: 'team'
            }
        },
        {
            $unwind: {
                path: '$team',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'team._id',
                foreignField: 'team1Id',
                as: 'matchesAsTeam1'
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'team._id',
                foreignField: 'team2Id',
                as: 'matchesAsTeam2'
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: {
                    name: '$team.name',
                    abbreviation: '$team.abbreviation'
                },
                allMatches: {
                    $concatArrays: ['$matchesAsTeam1', '$matchesAsTeam2']
                }
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: 1,
                completedMatches: {
                    $filter: {
                        input: '$allMatches',
                        as: 'match',
                        cond: { $eq: ['$$match.status', 'completed'] }
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: 1,
                teamWins: {
                    $size: {
                        $filter: {
                            input: '$completedMatches',
                            as: 'match',
                            cond: { $eq: ['$$match.winnerId', '$team._id'] }
                        }
                    }
                },
                teamTotalMatches: { $size: '$completedMatches' }
            }
        },
        {
            $match: {
                teamTotalMatches: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'game'
            }
        },
        {
            $unwind: {
                path: '$game',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: {
                teamWins: -1,
                teamTotalMatches: -1
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                realName: 1,
                game: {
                    name: '$game.name',
                    abbreviation: '$game.abbreviation'
                },
                team: 1,
                teamWins: 1,
                teamTotalMatches: 1,
                teamWinPercentage: {
                    $round: [
                        {
                            $multiply: [
                                { $divide: ['$teamWins', '$teamTotalMatches'] },
                                100
                            ]
                        },
                        2
                    ]
                }
            }
        }
    ];
}

function getTeamStatistics(teamId) {
    return [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(teamId)
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: '_id',
                foreignField: 'team1Id',
                as: 'matchesAsTeam1'
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: '_id',
                foreignField: 'team2Id',
                as: 'matchesAsTeam2'
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                allMatches: {
                    $concatArrays: ['$matchesAsTeam1', '$matchesAsTeam2']
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                completedMatches: {
                    $filter: {
                        input: '$allMatches',
                        as: 'match',
                        cond: { $eq: ['$$match.status', 'completed'] }
                    }
                },
                scheduledMatches: {
                    $filter: {
                        input: '$allMatches',
                        as: 'match',
                        cond: { $eq: ['$$match.status', 'scheduled'] }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                totalMatches: { $size: '$completedMatches' },
                scheduledMatches: { $size: '$scheduledMatches' },
                wins: {
                    $size: {
                        $filter: {
                            input: '$completedMatches',
                            as: 'match',
                            cond: { $eq: ['$$match.winnerId', '$_id'] }
                        }
                    }
                },
                team1Scores: {
                    $sum: {
                        $map: {
                            input: {
                                $filter: {
                                    input: '$completedMatches',
                                    as: 'match',
                                    cond: { $eq: ['$$match.team1Id', '$_id'] }
                                }
                            },
                            as: 'match',
                            in: '$$match.team1Score'
                        }
                    }
                },
                team2Scores: {
                    $sum: {
                        $map: {
                            input: {
                                $filter: {
                                    input: '$completedMatches',
                                    as: 'match',
                                    cond: { $eq: ['$$match.team2Id', '$_id'] }
                                }
                            },
                            as: 'match',
                            in: '$$match.team2Score'
                        }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                gameId: 1,
                country: 1,
                region: 1,
                totalMatches: 1,
                scheduledMatches: 1,
                wins: 1,
                losses: { $subtract: ['$totalMatches', '$wins'] },
                winPercentage: {
                    $cond: {
                        if: { $gt: ['$totalMatches', 0] },
                        then: {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: ['$wins', '$totalMatches'] },
                                        100
                                    ]
                                },
                                2
                            ]
                        },
                        else: 0
                    }
                },
                totalScore: { $add: ['$team1Scores', '$team2Scores'] },
                averageScore: {
                    $cond: {
                        if: { $gt: ['$totalMatches', 0] },
                        then: {
                            $round: [
                                {
                                    $divide: [
                                        { $add: ['$team1Scores', '$team2Scores'] },
                                        '$totalMatches'
                                    ]
                                },
                                2
                            ]
                        },
                        else: 0
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'game'
            }
        },
        {
            $unwind: {
                path: '$game',
                preserveNullAndEmptyArrays: true
            }
        }
    ];
}

function getPlayerStatistics(playerId) {
    return [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playerId)
            }
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'teamId',
                foreignField: '_id',
                as: 'team'
            }
        },
        {
            $unwind: {
                path: '$team',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'team._id',
                foreignField: 'team1Id',
                as: 'matchesAsTeam1'
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'team._id',
                foreignField: 'team2Id',
                as: 'matchesAsTeam2'
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: {
                    name: '$team.name',
                    abbreviation: '$team.abbreviation'
                },
                allMatches: {
                    $concatArrays: ['$matchesAsTeam1', '$matchesAsTeam2']
                }
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: 1,
                completedMatches: {
                    $filter: {
                        input: '$allMatches',
                        as: 'match',
                        cond: { $eq: ['$$match.status', 'completed'] }
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: 1,
                teamTotalMatches: { $size: '$completedMatches' },
                teamWins: {
                    $size: {
                        $filter: {
                            input: '$completedMatches',
                            as: 'match',
                            cond: { $eq: ['$$match.winnerId', '$team._id'] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                realName: 1,
                gameId: 1,
                team: 1,
                teamTotalMatches: 1,
                teamWins: 1,
                teamLosses: { $subtract: ['$teamTotalMatches', '$teamWins'] },
                teamWinPercentage: {
                    $cond: {
                        if: { $gt: ['$teamTotalMatches', 0] },
                        then: {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: ['$teamWins', '$teamTotalMatches'] },
                                        100
                                    ]
                                },
                                2
                            ]
                        },
                        else: 0
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'game'
            }
        },
        {
            $unwind: {
                path: '$game',
                preserveNullAndEmptyArrays: true
            }
        }
    ];
}

function getMostPopularGames() {
    return [
        {
            $lookup: {
                from: 'matches',
                localField: '_id',
                foreignField: 'gameId',
                as: 'matches'
            }
        },
        {
            $lookup: {
                from: 'tournaments',
                localField: '_id',
                foreignField: 'gameId',
                as: 'tournaments'
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                genre: 1,
                publisher: 1,
                totalMatches: { $size: '$matches' },
                totalTournaments: { $size: '$tournaments' },
                completedMatches: {
                    $size: {
                        $filter: {
                            input: '$matches',
                            as: 'match',
                            cond: { $eq: ['$$match.status', 'completed'] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                abbreviation: 1,
                genre: 1,
                publisher: 1,
                totalMatches: 1,
                completedMatches: 1,
                totalTournaments: 1,
                popularityScore: {
                    $add: ['$totalMatches', '$totalTournaments']
                }
            }
        },
        {
            $match: {
                popularityScore: { $gt: 0 }
            }
        },
        {
            $sort: {
                popularityScore: -1,
                totalMatches: -1,
                totalTournaments: -1
            }
        }
    ];
}

function getTournamentStatisticsByGame() {
    return [
        {
            $group: {
                _id: '$gameId',
                totalTournaments: { $sum: 1 },
                totalPrizePool: { $sum: { $ifNull: ['$prizePool', 0] } },
                upcoming: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'upcoming'] }, 1, 0]
                    }
                },
                ongoing: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'ongoing'] }, 1, 0]
                    }
                },
                completed: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'games',
                localField: '_id',
                foreignField: '_id',
                as: 'game'
            }
        },
        {
            $unwind: {
                path: '$game',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                game: {
                    name: '$game.name',
                    abbreviation: '$game.abbreviation'
                },
                totalTournaments: 1,
                totalPrizePool: 1,
                upcoming: 1,
                ongoing: 1,
                completed: 1,
                averagePrizePool: {
                    $round: [
                        {
                            $divide: ['$totalPrizePool', '$totalTournaments']
                        },
                        2
                    ]
                }
            }
        },
        {
            $sort: {
                totalTournaments: -1
            }
        }
    ];
}

module.exports = {
    getTeamRankings: getTeamRankings,
    getBestPlayers: getBestPlayers,
    getTeamStatistics: getTeamStatistics,
    getPlayerStatistics: getPlayerStatistics,
    getMostPopularGames: getMostPopularGames,
    getTournamentStatisticsByGame: getTournamentStatisticsByGame
};

