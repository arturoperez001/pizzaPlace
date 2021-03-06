/*
 *
 *
 */
//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const http = require('http');
const querystring = require('querystring');
const path  = require('path');
const fs = require('fs');
const url = require('url');
//var Tls = require('tls');
// Container for all the helpers

const helpers = {};

helpers.hash = function (str){
    console.log(typeof(str));
    if(typeof(str) == 'string' && str.length > 0){
        return crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    }else{
        return false;
    }
}
// Parse a json string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str){
    try{
        let obj = JSON.parse(str);
        return obj;
    } catch(e){
        return {};
    }
}

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : length;
    if(strLength){
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'

        // Start the final string
        var str ='';
        for(i=1;i<=strLength;i++){
            // Get a random character from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
            // Append this character to the final string
            str+=randomCharacter;
        }

        // Return the random string
        return str;
    }else{
        return false;
    }
}

// Send an email message via mailgun

helpers.mailGun = function(email,callback){
    // Validate parameters
    // Configure the request details
    email="arturoperez001@gmail.com";
    let payload = {
    'from':'Peter Peterson of sales <postmaster@'+config.mailGun.domainName+'>',
    'to': email,
    'subject':'Your order',
    'text':'Your order is ready'
    }
    
    let stringPayload = querystring.stringify(payload);

    let proxy = typeof(config.proxy.exist) == 'boolean' && config.proxy.exist ? config.proxy.protocol+'://'+config.proxy.name+':'+config.proxy.port+'/' : '';
    let parsedUrl = proxy+'https://api.mailgun.net/v3/'+config.mailGun.domainName+'/messages';
    parsedUrl = url.parse(parsedUrl, true);
    let hostName = parsedUrl.hostname;
    let path = typeof(config.proxy.exist) == 'boolean' && config.proxy.exist ? 'https://api.mailgun.net/v3/sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org/messages' : parsedUrl.path;// Using path and not "path name" because we want the query string 
    let port = parsedUrl.port;
    let protocol = parsedUrl.protocol;

    let requestDetails = {
        'protocol': protocol,
        'hostname': hostName,
        'port': port,//3128,
        'method':'post',
        'path': path,//'https://api.mailgun.net/v3/sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org/messages',//'https://api.stripe.com/v1/charges'
        'auth':'api:'+config.mailGun.authToken,//+config.twilio.authToken,
        
        'headers':{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-length':Buffer.byteLength(stringPayload)
        }
    };
    helpers.connect(stringPayload,requestDetails,function(err){
        if(!err){
            callback(false);
        }else{
            callback(err);
            //callback(500,{'Error':'Could not send the mail'});
        }
    });
    //*/
}

// Send an SMS message via stripe
// @TODO : take payment data    
helpers.payStripe = function(email,payData,callback){
    // Validate parameters
    //let email=typeof(email) == 'string' && email.trim().length == 10 ? email.trim() : false;

        // Configure the request details
        //@TODO: get rid of port
        let amount = 0;
        payData.items.forEach((item)=>{ 
                                                    amount += item.quantity*item.price;
                                                });
                                                
        let payload = {
            'amount'       : amount,//payData.amount,
            'currency'     : 'usd',//payData.currency,
            'source'       : 'tok_visa',
            'receipt_email': email,//payData.email
        }   
        //console.log(payData);
        let stringPayload = querystring.stringify(payload);

        let proxy = typeof(config.proxy.exist) == 'boolean' && config.proxy.exist ? config.proxy.protocol+'://'+config.proxy.name+':'+config.proxy.port+'/' : '';
        let parsedUrl = proxy+'https://api.stripe.com/v1/charges';
        parsedUrl = url.parse(parsedUrl, true);
        let hostName = parsedUrl.hostname;
        let path = typeof(config.proxy.exist) == 'boolean' && config.proxy.exist ? 'https://api.stripe.com/v1/charges' : parsedUrl.path;// Using path and not "path name" because we want the query string 
        let port = parsedUrl.port;
        let protocol = parsedUrl.protocol;
            
        let requestDetails = {
            'protocol': protocol,
            'hostname': hostName,
            'port': port,//3128,
            'method':'post',
            'path': path,//'https://api.mailgun.net/v3/sandboxcefcc3c653d0496da4fca075b97c3bf2.mailgun.org/messages',//'https://api.stripe.com/v1/charges'
            'auth':config.stripe.accountSid+':',//+config.twilio.authToken,
            
            'headers':{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-length':Buffer.byteLength(stringPayload)
            }
        };

        helpers.connect(stringPayload,requestDetails,function(err){
            if(!err){
                callback(false);
            }else{
                callback(err);
                //callback(500,{'Error':'Could not connect to service'});
            }
        });
}

//@TODO: use ttl to connect via proxy
helpers.connect = function(stringPayload,requestDetails,callback){
    
    let con = requestDetails.protocol == 'http:' ? http : https; 
    let req = con.request(requestDetails,function(res){
        //Grab the status of the sent request 
        var status = res.statusCode;
        // Callback successfully if the request went through
        
        if(status==200||status==201)
        {
            callback(false);
        }else{
            //console.log(res);
            callback(status);
        }
    });
    // Instantiate the request object

    // Bind to the error event so it doesn't get thrown
    req.on('error', function(err){
        callback(err);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
    //*/
}

// Templates and html loading

// Get the string content of a template
helpers.getTemplate = function(templateName,data,callback){
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof(data) == "object" && data !== null ? data : {};
    if(templateName){
        let templatesDir = path.join(__dirname,'/../templates/');
        fs.readFile(templatesDir+templateName+'.html','utf8',function(err,str){
            if(!err&&str){
                // Do interpolation on the string
                let finalString = helpers.interpolate(str,data);
                callback(false,finalString);
            }else{
                callback('No template could be found');
            }
        });
    }else{
        callback('A valid template name was not specified');
    }
};


// Add the universal header and footer to a string and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = function(str,data,callback){
    str  = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : null;
    // Get the Header 
    helpers.getTemplate('_header',data,function(err,headerString){
        if(!err&&headerString){
            // Get the footer
            helpers.getTemplate('_footer',data,function(err,footerString){
                if(!err&&footerString){
                    // Add them all together
                    let fullstring = headerString+str+footerString;
                    callback(false,fullstring);
                }else{
                    callback('Could not find the footer template');
                }
            })
        }else{
            callback('Could not find the header template');
        }
    })
}

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function(str,data){
    str = typeof(str) == "string" && str.length > 0 ? str : 0;
    data = typeof(data) == "object" && data !== null ? data : {};
    //console.log(str);
    //add the template globals do the data object, prepending their keys with "globals"

    for(var keyName in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }

    //For each key in the data object, insert its value into the string at the corresponding placeholder
    for(var key in data){
        if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
            let replace = data[key];
            let find    = '{'+key+'}';
            str = str.replace(find,replace);
        }
    }
    return str;
};

// Get the contents of a static public asset
helpers.getStaticAsset = function(fileName,callback){
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if(fileName){
        var publicDir = path.join(__dirname,'/../public/');
        fs.readFile(publicDir+fileName,function(err,fileData){
            if(!err&&fileData){
                callback(false,fileData);
            }else{
                callback("File could not be found");
            }
        })
    }else{
        callback('A valid file name was not specified');
    }
};

// Export the module

module.exports = helpers;
