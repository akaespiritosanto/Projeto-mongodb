routerApp.controller('teamController', function($scope, $state, $stateParams, teamService, gameService) {
    $scope.saveData = function(team) {
        if ($state.current.name === 'teamCreate') {
            teamService.create(team).then(function() {
                $state.go('teams');
            }, function(error) {
                console.error('Error creating team:', error);
                alert('Failed to create team. Please check the console for details.');
            });
        } else if ($state.current.name === 'teamEdit') {
            teamService.update($stateParams.id, team).then(function() {
                $state.go('teams');
            }, function(error) {
                console.error('Error updating team:', error);
                alert('Failed to update team. Please check the console for details.');
            });
        }
    };

    $scope.deleteTeam = function(id) {
        if (confirm('Are you sure you want to delete this team?')) {
            teamService.delete(id).then(function() {
                loadTeams();
            }, function(error) {
                console.error('Error deleting team:', error);
                alert('Failed to delete team. Please check the console for details.');
            });
        }
    };

    function loadTeams() {
        teamService.getAll().then(function(teams) {
            $scope.teams = teams;
        }, function(error) {
            console.error('Error loading teams:', error);
            $scope.teams = [];
        });
    }

    function loadTeam(id) {
        teamService.getById(id).then(function(team) {
            $scope.team = team;
        }, function(error) {
            console.error('Error loading team:', error);
            alert('Failed to load team. Redirecting to teams list.');
            $state.go('teams');
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

    if ($state.current.name === 'teams') {
        loadTeams();
    } else if ($state.current.name === 'teamEdit') {
        loadTeam($stateParams.id);
        loadGames();
    } else if ($state.current.name === 'teamCreate') {
        $scope.team = {};
        loadGames();
    }
});

