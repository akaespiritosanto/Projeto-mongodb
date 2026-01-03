routerApp.service('playerService', function(apiService) {
    this.getAll = function() {
        return apiService.get('/player');
    };
    
    this.getById = function(id) {
        return apiService.get('/player', id);
    };
    
    this.create = function(player) {
        return apiService.create('/player', player);
    };
    
    this.update = function(id, player) {
        return apiService.update('/player', id, player);
    };
    
    this.delete = function(id) {
        return apiService.delete('/player', id);
    };
});

