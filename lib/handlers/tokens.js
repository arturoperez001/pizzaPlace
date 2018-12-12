
const _data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
//  Tokens Handlers


// Container for all the tokens methods
tokens = {};

// Tokens - post
tokens.post = function(data,callback){
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(phone&&password){
        _data.read('users',phone,function(err,userData){
            if(!err&&userData){
                // Hash the send password, and 
            let hashedPassword  = helpers.hash(password);
            if(hashedPassword == userData.hashedPassword){
                // If valid, create new token with a valid name. set expiration date 1 hou into the future
                var tokenId = helpers.createRandomString(20);

                var expires = Date.now()+1000*60*60;
                var tokenObject = {
                    'phone':phone,
                    'id':tokenId,
                    'expires':expires
                };

                // Store the token
                _data.create('tokens',tokenId,tokenObject,function(err){
                    if(!err){
                        callback(200,tokenObject);
                    }else{
                        console.log(err);
                        callback(500,{'Error':'Could not create token'});
                    }
                })
            }else{
                callback(400,{'Error':'Did not match the specified user\'s stored password'})
            }
            }else{
                callback(400,{'Error':'Could not find the specified user'})
            }
        })
    }else{
        callback(400,{'Error':'Missing required field'})
    }
};

// Tokens - get
// Required data : id
// Optional data : none
tokens.get = function(data,callback){
    // Check the id is valid
    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.read('tokens',id,function(err,data){
            if(!err&&data){
                //Remove the hashed password from the user object before returning it to the requester
                delete data.hashedPassword;
                callback(200,data);
            }else{
                callback(404);
            }
        })
    }else{
        callback(400,{'Error':'Missing required field'})
    }
};

// Tokens - put
// Required data : id
// Optional data : none
tokens.put = function(data,callback){
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  
    if (id && extend){
        // Lookup the token
        _data.read('tokens',id,function(err,tokenData){
            if(!err&&tokenData){
                //Check to the make sure the token isn't already expired
                if(tokenData.expires > Date.now()){
                    //Set  the experiration an hour from now
                    tokenData.expires = Date.now() + 1000*60*60;

                    //Store the expiration an hour from now
                    _data.update('tokens',id,tokenData,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500,{'Error':'Could not update the token\'s Experation'})
                        }
                    })
                }else{
                    callback(400,{'Error':'The token has already expired, and cannot be extended'})
                }
            }else{
                callback(400,{'Error':'Specified token does not exist'})
            }
        })
    } else {
        callback(400,{'Error':'Missing required field(s) or field(s) are invalid'})
    }
};

// Tokens - delete
// Required date : id
// Optional data : none
tokens.delete = function(data,callback){
    //Check the id is valid
        var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
        if(id){
            _data.read('tokens',id,function(err,data){
                if(!err&&data){
                    _data.delete('tokens',id,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500, {'Error':'Could not delete the specified id.'});
                        }
                    })
                    
                }else{
                    callback(400,{'Error':'Could not find the specified token'});
                }
            })
        }else{
            callback(400,{'Error':'Missing required field'})
        }
    
};

// Verify if a given token id is currently valid for a given user
tokens.verifyToken = function(id,phone,callback){
    //Lookup the token
    _data.read('tokens',id,function(err,tokenData){
        if(!err&&tokenData){
            // Check that the token is for the given user and has not expired
            if(tokenData.phone == phone && tokenData.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
};

module.exports = tokens;