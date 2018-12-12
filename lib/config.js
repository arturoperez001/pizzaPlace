/*
* Create and export configuration variables
*
*
*/

//Container for all the enviroments
var enviroments = {};

// Staging (default) enviroment
enviroments.stagging = {
    'httpPort' : 8000,
    'httpsPort' : 8001,
    'envName' :'stagging',
    'hashingSecret':'thisisasecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    }
};

// Production enviroment
enviroments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret':'thisisanothersecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid':'',
        'authtoken':'',
        'fromPhone':''
    }
};
// Determine which enviroment was passed as a command-line argument

var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not, default to staging enviroment

var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.stagging; 

// Export the module

module.exports = enviromentToExport;