routerApp.service('matchService', function(apiService) {
    
    this.getAll = function() {
        return apiService.get('/match');
    };
    
    this.getById = function(id) {
        return apiService.get('/match', id);
    };
    
    this.create = function(match) {
        return apiService.create('/match', match);
    };
    
    this.update = function(id, match) {
        return apiService.update('/match', id, match);
    };
    
    this.delete = function(id) {
        return apiService.delete('/match', id);
    };
});

