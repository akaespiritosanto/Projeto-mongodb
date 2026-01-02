var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routes = require('./server/routes/web');
var apiRoutes = require('./server/routes/api');

var connection = require('./server/config/db');

var server = express();

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
server.use(express.static(path.join(__dirname, 'app')));
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', routes);
server.use('/api', apiRoutes);

server.use(function(req, res, next) {
    next(createError(404));
});

server.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = server;

