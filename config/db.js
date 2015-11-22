// Load up mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

// Build the connection string
var dbUri = 'mongodb://localhost/MongoosePM';

// Create the database connection
mongoose.connect(dbUri);

mongoose.connection.on('connected', function() {
  console.log('Zordon connected to ' + dbUri);
});

mongoose.connection.on('error', function (err) {
  console.log('Zordon connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Zordon disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Zordon disconnected through app termination');
    process.exit(0);
  });
});
