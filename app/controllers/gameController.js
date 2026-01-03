routerApp.controller('gameController', function($scope, $state, $stateParams, gameService) {
    $scope.saveData = function(game) {
        if ($state.current.name === 'gameCreate') {
            gameService.create(game).then(function() {
                $state.go('games');
            }, function(error) {
                console.error('Error creating game:', error);
                alert('Failed to create game. Please check the console for details.');
            });
        } else if ($state.current.name === 'gameEdit') {
            gameService.update($stateParams.id, game).then(function() {
                $state.go('games');
            }, function(error) {
                console.error('Error updating game:', error);
                alert('Failed to update game. Please check the console for details.');
            });
        }
    };

    $scope.deleteGame = function(id) {
        if (confirm('Are you sure you want to delete this game?')) {
            gameService.delete(id).then(function() {
                loadGames();
            }, function(error) {
                console.error('Error deleting game:', error);
                alert('Failed to delete game. Please check the console for details.');
            });
        }
    };

    function loadGames() {
        gameService.getAll().then(function(games) {
            $scope.games = games;
        }, function(error) {
            console.error('Error loading games:', error);
            $scope.games = [];
        });
    }

    function loadGame(id) {
        gameService.getById(id).then(function(game) {
            $scope.game = game;
        }, function(error) {
            console.error('Error loading game:', error);
            alert('Failed to load game. Redirecting to games list.');
            $state.go('games');
        });
    }

    if ($state.current.name === 'games') {
        loadGames();
    } else if ($state.current.name === 'gameEdit') {
        loadGame($stateParams.id);
    } else if ($state.current.name === 'gameCreate') {
        $scope.game = {};
    }
});

