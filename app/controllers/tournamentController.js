routerApp.controller('tournamentController', function($scope, $state, $stateParams, tournamentService, gameService) {
    
    $scope.saveData = function(tournament) {
        if ($state.current.name === 'tournamentCreate') {
            tournamentService.create(tournament).then(function() {
                $state.go('tournaments');
            }, function(error) {
                console.error('Error creating tournament:', error);
                alert('Failed to create tournament. Please check the console for details.');
            });
        } else if ($state.current.name === 'tournamentEdit') {
            tournamentService.update($stateParams.id, tournament).then(function() {
                $state.go('tournaments');
            }, function(error) {
                console.error('Error updating tournament:', error);
                alert('Failed to update tournament. Please check the console for details.');
            });
        }
    };

    $scope.deleteTournament = function(id) {
        if (confirm('Are you sure you want to delete this tournament?')) {
            tournamentService.delete(id).then(function() {
                loadTournaments();
            }, function(error) {
                console.error('Error deleting tournament:', error);
                alert('Failed to delete tournament. Please check the console for details.');
            });
        }
    };

    function loadTournaments() {
        tournamentService.getAll().then(function(tournaments) {
            $scope.tournaments = tournaments;
        }, function(error) {
            console.error('Error loading tournaments:', error);
            $scope.tournaments = [];
        });
    }

    function loadTournament(id) {
        tournamentService.getById(id).then(function(tournament) {
            $scope.tournament = tournament;
        }, function(error) {
            console.error('Error loading tournament:', error);
            alert('Failed to load tournament. Redirecting to tournaments list.');
            $state.go('tournaments');
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

    if ($state.current.name === 'tournaments') {
        loadTournaments();
    } else if ($state.current.name === 'tournamentEdit') {
        loadTournament($stateParams.id);
        loadGames();
    } else if ($state.current.name === 'tournamentCreate') {
        $scope.tournament = {};
        loadGames();
    }
});

