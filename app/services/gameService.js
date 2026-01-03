routerApp.service('gameService', function(apiService) {
    this.getAll = function() {
        return apiService.get('/game');
    };
    
    this.getById = function(id) {
        return apiService.get('/game', id);
    };
    
    this.create = function(game) {
        return apiService.create('/game', game);
    };
    
    this.update = function(id, game) {
        return apiService.update('/game', id, game);
    };
    
    this.delete = function(id) {
        return apiService.delete('/game', id);
    };
});

