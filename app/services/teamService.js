routerApp.service('teamService', function(apiService) {
    
    this.getAll = function() {
        return apiService.get('/team');
    };
    
    this.getById = function(id) {
        return apiService.get('/team', id);
    };
    
    this.create = function(team) {
        return apiService.create('/team', team);
    };
    
    this.update = function(id, team) {
        return apiService.update('/team', id, team);
    };
    
    this.delete = function(id) {
        return apiService.delete('/team', id);
    };
});

