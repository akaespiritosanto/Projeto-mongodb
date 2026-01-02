routerApp.service('apiService', function($http, globalConfig) {
    
    this.get = function(endpoint, id) {
        var url = globalConfig.apiAddress + endpoint;
        if (id) {
            url += '/' + id;
        }
        return $http.get(url).then(function(response) {
            return response.data;
        });
    };
    
    this.create = function(endpoint, data) {
        return $http.post(globalConfig.apiAddress + endpoint, data).then(function(response) {
            return response.data;
        });
    };
    
    this.update = function(endpoint, id, data) {
        return $http.post(globalConfig.apiAddress + endpoint + '/' + id, data).then(function(response) {
            return response.data;
        });
    };
    
    this.delete = function(endpoint, id) {
        return $http.delete(globalConfig.apiAddress + endpoint + '/' + id).then(function(response) {
            return response.data;
        });
    };
});

