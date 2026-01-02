var mongoose = require('mongoose');

var connectionString = 'mongodb://localhost:27017/esports_stats';

var connection = mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', function() {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', function(err) {
    console.log('MongoDB connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('MongoDB disconnected');
});

module.exports = connection;

