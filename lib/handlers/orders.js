
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
    console.log(data.payload);
    //check order
    let order = typeof(data.payload.items) == 'object' && 
                data.payload.items instanceof Array && 
                data.payload.items.length > 0 &&
                data.payload.items.forEach( items => {
                     items.description.length > 0 && items.quantity > 0 ? true : false
                })
                ? data.payload.items : false;
    //console.log(data.payload.items);
    console.log(order);
    if(order){
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    
        _data.read('tokens',token,function(err,tokenData){
            if(!err&&tokenData){
                let userEmail = tokenData.email;
    
                // Lookup the user data
                _data.read('users',userEmail,function(err,userData){
                    if(!err&&userData){
                        console.log('validation ok');
                    }else{
                        callback(403)
                    }
                })
            }else{
                callback(403)
            }
        });
    }
    // Check that all required fields are filled out
    
    /*
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
    //*/
};

orders.get = function(data,callback){

};


orders.put = function(data,callback){

};

orders.delete = function(data,callback){

};

module.exports = orders;