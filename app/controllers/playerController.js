routerApp.controller('playerController', function($scope, $state, $stateParams, playerService, gameService, teamService) {
    $scope.saveData = function(player) {
        if ($state.current.name === 'playerCreate') {
            playerService.create(player).then(function() {
                $state.go('players');
            }, function(error) {
                console.error('Error creating player:', error);
                alert('Failed to create player. Please check the console for details.');
            });
        } else if ($state.current.name === 'playerEdit') {
            playerService.update($stateParams.id, player).then(function() {
                $state.go('players');
            }, function(error) {
                console.error('Error updating player:', error);
                alert('Failed to update player. Please check the console for details.');
            });
        }
    };

    $scope.deletePlayer = function(id) {
        if (confirm('Are you sure you want to delete this player?')) {
            playerService.delete(id).then(function() {
                loadPlayers();
            }, function(error) {
                console.error('Error deleting player:', error);
                alert('Failed to delete player. Please check the console for details.');
            });
        }
    };

    function loadPlayers() {
        playerService.getAll().then(function(players) {
            $scope.players = players;
        }, function(error) {
            console.error('Error loading players:', error);
            $scope.players = [];
        });
    }

    function loadPlayer(id) {
        playerService.getById(id).then(function(player) {
            $scope.player = player;
        }, function(error) {
            console.error('Error loading player:', error);
            alert('Failed to load player. Redirecting to players list.');
            $state.go('players');
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

    function loadTeams() {
        teamService.getAll().then(function(teams) {
            $scope.teams = teams;
        }, function(error) {
            console.error('Error loading teams:', error);
            $scope.teams = [];
        });
    }
    
    if ($state.current.name === 'players') {
        loadPlayers();
    } else if ($state.current.name === 'playerEdit') {
        loadPlayer($stateParams.id);
        loadGames();
        loadTeams();
    } else if ($state.current.name === 'playerCreate') {
        $scope.player = {};
        loadGames();
        loadTeams();
    }
});