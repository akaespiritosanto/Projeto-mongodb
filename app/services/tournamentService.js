routerApp.service('tournamentService', function(apiService) {
    
    this.getAll = function() {
        return apiService.get('/tournament');
    };
    
    this.getById = function(id) {
        return apiService.get('/tournament', id);
    };
    
    this.create = function(tournament) {
        return apiService.create('/tournament', tournament);
    };
    
    this.update = function(id, tournament) {
        return apiService.update('/tournament', id, tournament);
    };
    
    this.delete = function(id) {
        return apiService.delete('/tournament', id);
    };
});

