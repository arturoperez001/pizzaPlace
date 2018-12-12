
const _data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const tokens = require('./tokens');

// Container for the users submethods
orders = {};
// Orders post
// Required data : id, menu items{description , quantity}
// Optional data : none
orders.post = function(data,callback){
    
    //check order
    let orders = typeof(data.payload.orders) == 'object' && data.payload.orders instanceof Array ? data.payload.orders : false;
   
    // Check that all required fields are filled out
    
    let email = typeof(data.payload.email) == 'string' && data.payload.email.indexOf('@') > 0 ? data.payload.email.trim() : false;
    
    _data.read('tokens',token,function(err,tokenData){
        if(!err&&tokenData){
            let userEmail = tokenData.email;

            // Lookup the user data
            _data.read('users',userEmail,function(err,userData){
                if(!err&&userEmail){

                }else{
                    callback(403)
                }
            })
        }else{
            callback(403)
        }
    }
    )
    if(firstName && lastName && email && password && tosAgreement && direction){
        // Check if user doesn't exist
        
    _data.read('orders',email, function(err,data){
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
                    _data.create('orders',email,userObject, function(err){
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

orders.get = function(data,callback){

};


orders.put = function(data,callback){

};

orders.delete = function(data,callback){

};

module.exports = orders;