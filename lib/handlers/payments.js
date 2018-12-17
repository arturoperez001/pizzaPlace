
const _data = require('../data');
const helpers = require('../helpers');
//const orders = require('./orders');
const config = require('../config');
const tokens = require('./tokens');

payments = {};

// Payment proccess
// required : token, order id
// optional : none
payments.post = function(data,callback){

        
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false ;
    _data.read('tokens',token,function(err,tokenData){
        if(!err&&tokenData){
            let userEmail = tokenData.email;
            _data.read('users',userEmail,function(err,userData){
                if(!err&&userData){
                    let order = typeof(data.payload.order) == 'string' && data.payload.order.trim().length > 0 ? data.payload.order.trim() : false ;
                    _data.read('orders',order,function(err,orderData){
                        if(!err&&orderData){
                            if(orderData.email&&userEmail){

                                helpers.payStripe(userEmail,orderData, function(err){
                                    if(!err){
                                        callback(200);
                                    }else{
                                        console.log(err);
                                        callback(500,{'Error':'Could not connect to stripe.'});
                                    }
                                }); 

                            }else{
                                callback(403);
                            }
                        }else{
                            callback(403);
                        }
                    });

                }else{
                    callback(403);
                }
            });
        
        }else{
            callback(403);
        }
    })
    //*/
                
}
/*
payments.get = function(data,callback){
    let email ="arturoperez001@gmail.com";
    
    helpers.mailGun(email, function(err,res){
        if(!err){
            callback(200);
        }else{
            console.log(err);
            callback(500,{'Error':'Could not connect to stripe.'});
        }
    });
}

    //*/
module.exports = payments;

