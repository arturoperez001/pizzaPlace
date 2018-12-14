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
var Tls = require('tls');
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
// @TODO : take payment data    
helpers.mailGun = function(email,payData,callback){
    // Validate parameters
    //let email=typeof(email) == 'string' && email.trim().length == 10 ? email.trim() : false;
    if(email){

        // Configure the request details
        //@TODO: get rid of port
        let payload = {
            'amount'       : 123,//payData.amount,
            'currency'     : 'usd',//payData.currency,
            'source'       : 'tok_visa',
            'receipt_email': "jenny.rosen@example.com",//payData.email
        }   
        user 'api:YOUR_API_KEY' \
        https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
         'from':'Excited User <mailgun@YOUR_DOMAIN_NAME>' \
        'to'=YOU@YOUR_DOMAIN_NAME \
        -F subject='Hello' \
        -F text='Testing some Mailgun awesomeness!'
        let stringPayload = querystring.stringify(payload);

        let requestDetails = {
            'protocol': "http:",
            'hostname': 'proxy',
            'port':3128,
            'method':'post',
            'path': 'https://api.stripe.com/v1/charges',//+config.twilio.accountSid+'/Message.json',
            'auth':config.stripe.accountSid+':',//+config.twilio.authToken,
            
            'headers':{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-length':Buffer.byteLength(stringPayload)
            }//*/
        };
        let req = http.request(requestDetails,function(res){
            //Grab the status of the sent request 
            var status = res.statusCode;
            // Callback successfully if the request went through
            if(status==200||status==201)
            {
                /*
                req.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                  });
                //*/
                callback(false);
            }else{
                console.log(res);
                callback('Status code returned was '+status);
            }
        });
        // Instantiate the request object

        // Bind to the error event so it doesn't get thrown
        req.on('error', function(e){
            callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
    }else{
        callback('Given parameters were missing or invalid');
    }

}

// Send an SMS message via stripe
// @TODO : take payment data    
helpers.payStripe = function(email,payData,callback){
    // Validate parameters
    //let email=typeof(email) == 'string' && email.trim().length == 10 ? email.trim() : false;
    if(email){

        // Configure the request details
        //@TODO: get rid of port
        let payload = {
            'amount'       : 123,//payData.amount,
            'currency'     : 'usd',//payData.currency,
            'source'       : 'tok_visa',
            'receipt_email': "jenny.rosen@example.com",//payData.email
        }   

        let stringPayload = querystring.stringify(payload);

        let requestDetails = {
            'protocol': "http:",
            'hostname': 'proxy',
            'port':3128,
            'method':'post',
            'path': 'https://api.stripe.com/v1/charges',//+config.twilio.accountSid+'/Message.json',
            'auth':config.stripe.accountSid+':',//+config.twilio.authToken,
            
            'headers':{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-length':Buffer.byteLength(stringPayload)
            }//*/
        };
        let req = http.request(requestDetails,function(res){
            //Grab the status of the sent request 
            var status = res.statusCode;
            // Callback successfully if the request went through
            if(status==200||status==201)
            {
                /*
                req.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                  });
                //*/
                callback(false);
            }else{
                console.log(res);
                callback('Status code returned was '+status);
            }
        });
        // Instantiate the request object

        // Bind to the error event so it doesn't get thrown
        req.on('error', function(e){
            callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
    }else{
        callback('Given parameters were missing or invalid');
    }

}

// Export the module

module.exports = helpers;
