routerApp.controller('matchController', function($scope, $state, $stateParams, matchService, gameService, tournamentService, teamService) {
    
    $scope.saveData = function(match) {
        if ($state.current.name === 'matchCreate') {
            matchService.create(match).then(function() {
                $state.go('matches');
            }, function(error) {
                console.error('Error creating match:', error);
                alert('Failed to create match. Please check the console for details.');
            });
        } else if ($state.current.name === 'matchEdit') {
            matchService.update($stateParams.id, match).then(function() {
                $state.go('matches');
            }, function(error) {
                console.error('Error updating match:', error);
                alert('Failed to update match. Please check the console for details.');
            });
        }
    };

    $scope.deleteMatch = function(id) {
        if (confirm('Are you sure you want to delete this match?')) {
            matchService.delete(id).then(function() {
                loadMatches();
            }, function(error) {
                console.error('Error deleting match:', error);
                alert('Failed to delete match. Please check the console for details.');
            });
        }
    };

    function loadMatches() {
        matchService.getAll().then(function(matches) {
            $scope.matches = matches;
        }, function(error) {
            console.error('Error loading matches:', error);
            $scope.matches = [];
        });
    }

    function loadMatch(id) {
        matchService.getById(id).then(function(match) {
            $scope.match = match;
        }, function(error) {
            console.error('Error loading match:', error);
            alert('Failed to load match. Redirecting to matches list.');
            $state.go('matches');
        });
    }

    function loadGames() {
        gameService.getAll().then(function(games) {
            $scope.games = games;
        }, function(error) {
            console.error('Error loading games:', error);
            $scope.games = [];
        });
    }

    function loadTournaments() {
        tournamentService.getAll().then(function(tournaments) {
            $scope.tournaments = tournaments;
        }, function(error) {
            console.error('Error loading tournaments:', error);
            $scope.tournaments = [];
        });
    }

    function loadTeams() {
        teamService.getAll().then(function(teams) {
            $scope.teams = teams;
        }, function(error) {
            console.error('Error loading teams:', error);
            $scope.teams = [];
        });
    }

    if ($state.current.name === 'matches') {
        loadMatches();
    } else if ($state.current.name === 'matchEdit') {
        loadMatch($stateParams.id);
        loadGames();
        loadTournaments();
        loadTeams();
    } else if ($state.current.name === 'matchCreate') {
        $scope.match = {};
        loadGames();
        loadTournaments();
        loadTeams();
    }
});

