var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })
        .state('games', {
            url: '/games',
            templateUrl: 'views/games/list.html',
            controller: 'gameController'
        })
        .state('gameCreate', {
            url: '/games/create',
            templateUrl: 'views/games/form.html',
            controller: 'gameController'
        })
        .state('gameEdit', {
            url: '/games/edit/:id',
            templateUrl: 'views/games/form.html',
            controller: 'gameController'
        })
        .state('teams', {
            url: '/teams',
            templateUrl: 'views/teams/list.html',
            controller: 'teamController'
        })
        .state('teamCreate', {
            url: '/teams/create',
            templateUrl: 'views/teams/form.html',
            controller: 'teamController'
        })
        .state('teamEdit', {
            url: '/teams/edit/:id',
            templateUrl: 'views/teams/form.html',
            controller: 'teamController'
        })
        .state('players', {
            url: '/players',
            templateUrl: 'views/players/list.html',
            controller: 'playerController'
        })
        .state('playerCreate', {
            url: '/players/create',
            templateUrl: 'views/players/form.html',
            controller: 'playerController'
        })
        .state('playerEdit', {
            url: '/players/edit/:id',
            templateUrl: 'views/players/form.html',
            controller: 'playerController'
        })
        .state('tournaments', {
            url: '/tournaments',
            templateUrl: 'views/tournaments/list.html',
            controller: 'tournamentController'
        })
        .state('tournamentCreate', {
            url: '/tournaments/create',
            templateUrl: 'views/tournaments/form.html',
            controller: 'tournamentController'
        })
        .state('tournamentEdit', {
            url: '/tournaments/edit/:id',
            templateUrl: 'views/tournaments/form.html',
            controller: 'tournamentController'
        })
        .state('matches', {
            url: '/matches',
            templateUrl: 'views/matches/list.html',
            controller: 'matchController'
        })
        .state('matchCreate', {
            url: '/matches/create',
            templateUrl: 'views/matches/form.html',
            controller: 'matchController'
        })
        .state('matchEdit', {
            url: '/matches/edit/:id',
            templateUrl: 'views/matches/form.html',
            controller: 'matchController'
        });
}).constant("globalConfig", {
    apiAddress: 'http://localhost:3000/api'
});

