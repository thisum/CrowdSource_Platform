/**
 * Created by Thisum on 6/27/2016.
 */
var fs = require('fs');
var mongoose = require('mongoose');

var DatabaseConnector = function(conf){
    this.conf = conf;
}

DatabaseConnector.prototype.connectDB = function()
{
    try{
        mongoose.connect(this.conf.db_path);
        this.db = mongoose.connection;
        this.db.on('error', console.error);
        console.log('successfully connected to database');
    }
    catch(err){
        console.error('Error while connecting to the DB ' + err.message);
    }
}

module.exports = DatabaseConnector;
