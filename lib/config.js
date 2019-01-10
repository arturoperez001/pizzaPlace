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
    'stripe' : {
        'accountSid' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'//,
        //'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        //'fromPhone' : '+15005550006'
    },
    'mailGun' : {
        //'accountSid' : 'api',//'sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org',
        'authToken' : '699b4e6b47319e0bbe69beb655e1e0f9-b3780ee5-269c0df9',
        'domainName' : 'sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org'
        
    },
    'proxy' : {
        'protocol': "http",
        'name': 'proxy',
        'port'    : 3128,
        'exist': false
    },
    'templateGlobals' :{
        'appName'     : 'Pizza Place',
        'companyName' : 'Possers, Inc',
        'yearCreated' : '2018',
        'baseUrl'     : 'http://localhost:8000/'
    }
};

// Production enviroment
enviroments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret':'thisisanothersecret',
    'stripe' : {
        'accountSid' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'//,
        //'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        //'fromPhone' : '+15005550006'
    },
    'mailGun' : {
        //'accountSid' : 'api',//'sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org',
        'authToken' : '699b4e6b47319e0bbe69beb655e1e0f9-b3780ee5-269c0df9',
        'domainName' : 'sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org'
        
    },
    'proxy' : {
        'protocol': "http",
        'name': 'proxy',
        'port'    : 3128,
        'exist': false
    },
    'templateGlobals' :{
        'appName'     : 'Pizza Place',
        'companyName' : 'Possers, Inc',
        'yearCreated' : '2018',
        'baseUrl'     : 'http://localhost:5000/'
    }
};
// Determine which enviroment was passed as a command-line argument

var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not, default to staging enviroment

var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.stagging; 

// Export the module

module.exports = enviromentToExport;