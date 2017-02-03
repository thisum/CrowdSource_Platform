/**
 * Created by Thisum on 7/15/2016.
 */

var fs = require('fs');

var ConfigHandler = function() {
    
}

ConfigHandler.prototype.readConfigurations = function() {
    try{
        this.configuration = JSON.parse(fs.readFileSync('config.json'));
        console.log(this.configuration.path);
    }
    catch(err){
        console.error('Error reading configurations: ' + err.message);
    }
}

ConfigHandler.prototype.getConfigurations = function() {
    return this.configuration;
}

module.exports = ConfigHandler;

