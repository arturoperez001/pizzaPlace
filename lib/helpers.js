/*
 *
 *
 */
//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
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

// Send an SMS message via Twilio
helpers.sendTwilioSms = function(phone,msg,callback){
    // Validate parameters
    phone=typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
    msg=typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() :false;
    if(phone&&msg){
        // Configure the request payload
        let payload = {
            'From' : config.twilio.formPhone,
            'to'   : '+1'+phone,
            'Body' : msg
        }

        // Stringify the payload
        let stringPayload = querystring.stringify(payload);

        // Configure the request details
        let requestDetails = {
            'protocol':'https:',
            'hostname':'api.twilio.com',
            'method':'post',
            'path':'/2010-04-01/Accounts/'+config.twilio.accountSid+'/Message.json',
            'auth':config.twilio.accountSid+':'+config.twilio.authToken,
            'headers':{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-length':Buffer.byteLength(stringPayload)
            }
        };

        // Instantiate the request object
        let req = https.request(requestDetails,function(res){
            //Grab the status of the sent request 
            var status = res.statusCode;
            // Callback successfully if the request went through
            if(status==200||status==201)
            {
                callback(false);
            }else{
                callback('Status code returned was '+status);
            }
        });

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
