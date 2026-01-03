require('dotenv').config();
var mongoose = require('mongoose');

var connectionString = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/esports_stats';

var connection = mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', function() {
    console.log('MongoDB connected successfully to:', connectionString.includes('mongodb+srv') ? 'Atlas' : 'Local');
});

mongoose.connection.on('error', function(err) {
    console.log('MongoDB connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('MongoDB disconnected');
});

module.exports = connection;

