
const _data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const tokens = require('./tokens');

// Container for the users submethods
users = {};

// Users - post
// Required data: firstName, lastName, email, password, tosAgreement
// Optional data: none
users.post = function(data,callback){
    
    // Check that all required fields are filled out
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let email = typeof(data.payload.email) == 'string' && data.payload.email.indexOf('@') > 0 ? data.payload.email.trim() : false;
    let direction = typeof(data.payload.direction) == 'string' && data.payload.direction.trim().length > 0 && data.payload.direction.trim().length <= 255 ? data.payload.direction.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && email && password && tosAgreement && direction){
        // Check if user doesn't exist
        
    _data.read('users',email, function(err,data){
        if(err){
            let hashedPassword  = helpers.hash(password);
            // Create the user object
            if(hashedPassword){
                    let userObject = {
                        'firstName':firstName,
                        'lastName':lastName,
                        'email':email,
                        'direction':direction,
                        'hashedPassword':hashedPassword,
                        'tosAgreement':tosAgreement
                    };
                    _data.create('users',email,userObject, function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500,{'Error':'Could not create the user'});
                        }
                    });
                }else{
                    callback(500,{'Error':'Could not hash password'});
                }
            }else{
                callback(400,{'Error':'A user with that email number already exist'});
            }
            
        
    });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }

};

// Users - get
// Required data: email
// Optional data: none

users.get = function(data,callback){
    //check that the email number is valid
    let email = typeof(data.queryStringObject.email) == 'string' && data.payload.email.indexOf('@') > 0 ? data.queryStringObject.email.trim() : false;
    if(email){
        //Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid from the email number
        tokens.verifyToken(token,email,function(tokenIsValid){
            if(tokenIsValid){

                _data.read('users',email,function(err,data){
                    if(!err&&data){
                        //Remove the hashed password from the user object before returning it to the requester
                        delete data.hashedPassword;
                        callback(200,data);
                    }else{
                        callback(404);
                    }
                })
            }else{
                callback(403,{'Error':'Missing required token in header, or token is invalid'})
            }
        });

    }else{
        callback(400,{'Error':'Missing required field'})
    }

};

// Users - put
// Required data: email
// Optional data: firstName, lastName, password(at least one specified)
users.put = function(data,callback){
    
    //check that the email number is valid
    let email = typeof(data.payload.email) == 'string' && data.payload.email.indexOf('@') > 0 ? data.payload.email.trim() : false;
    
    if(email){
        //check for the optionals field
        let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
        let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
        let direction = typeof(data.payload.direction) == 'string' && data.payload.direction.trim().length > 0 && data.payload.direction.trim().length <= 255 ? data.payload.direction.trim() : false;
        let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    
        // Error if nothing is sent to update
        if(lastName||firstName||password||direction){   
            //Get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            tokens.verifyToken(token,email,function(tokenIsValid){
                if(tokenIsValid){

                _data.read('users',email,function(err,userData){
                    if(!err && userData){
                        // Update the field necesary
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        
                        if(lastName){
                            userData.lastName = lastName;
                        }

                        if(direction){
                            userData.direction = direction;
                        }

                        if(password){
                            userData.password = password;
                        }

                        // Store the new updates
                        _data.update('users',email,userData,function(err){
                            if(!err){
                                callback(200);
                            } else {
                                console.log(err);
                                callback(500,{'Error':'Could not update the user'});
                            }
                        });

                    }else{
                        callback(400,{'Error':"Specified user doesn't exist"});
                    }
                    
                });
        
            }else{
                callback(403,{'Error':'Missing required token in header, or token is invalid'})
            }
        });    
        }else{
            callback(400,{'Error':'Missing fields to update'})        
        }
    }else{
        callback(400,{'Error':'Missing required field'})
    }
};

// Users - delete
// Required field: email
// @TODO Cleanup (delete) any other data files associated with this user
users.delete = function(data,callback){
    //check if the email is valid
        //check that the email number is valid
        var email = typeof(data.queryStringObject.email) == 'string' && data.payload.email.indexOf('@') > 0 ? data.queryStringObject.email.trim() : false;
        if(email){
            
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            tokens.verifyToken(token,email,function(tokenIsValid){
                if(tokenIsValid){
                _data.read('users',email,function(err,data){
                    if(!err&&data){
                        _data.delete('users',email,function(err){
                            if(!err){
                                callback(200);
                            }else{
                                callback(500);
                            }
                        })
                        
                    }else{
                        callback(400,{'Error':'Could not find the specified user'});
                    }
                })

            }else{
                callback(403,{'Error':'Missing required token in header, or token is invalid'})
            }
        });    
        }else{
            callback(400,{'Error':'Missing required field'})
        }
    
};

module.exports = users;