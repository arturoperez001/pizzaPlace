
const _data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const tokens = require('./tokens');

// Container for the users submethods
orders = {};
// Orders post
// Required data : id, menu items{description , quantity}
// Optional data : direction
// @TODO         : add state atribute
orders.post = function(data,callback){
    
    //check order
    
    let order = typeof(data.payload.items) == 'object' && 
                data.payload.items instanceof Array && 
                data.payload.items.length > 0 &&
                data.payload.items.filter(element => {
                    try{
                        return !(element.id.length > 0 && element.quantity > 0 ? true : false);
                    }catch(e){
                        console.log(e);
                        return false;
                    }
                    }).length == 0
                
                ? data.payload.items : false;
    //*/
    if(order){
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    
        _data.read('tokens',token,function(err,tokenData){
            if(!err&&tokenData){
                let userEmail = tokenData.email;
                //console.log(tokenData);
                // Lookup the user data
                _data.read('users',userEmail,function(err,userData){
                    if(!err&&userData){

                        let direction = typeof(data.payload.direction) == 'string' && data.payload.direction.trim().length > 0 ? data.payload.direction.trim() : userData.direction;
                        let id = helpers.createRandomString(10);
                        let userObject = {
                            'id':id,
                            'email':userData.email,
                            'direction':direction,
                            'items':order,
                            'createon':Date.now()
                        };
                        
                        _data.create('orders',id,userObject, function(err){
                            if(!err){
                                callback(200);
                            }else{
                                console.log(err);
                                callback(500,{'Error':'Could not create the user'});
                            }
                        });
                        //*/
                    }else{
                        callback(403)
                    }
                })
            }else{
                callback(403)
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Order get 
// Required data : token for authetication, order 
// Optional data : none
orders.get = function(data,callback){
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
                                callback(200,orderData);
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
};

// Order get 
// Required data : token for authetication, order 
// Optional data : none
// @TODO         : Only change order when state is still pending
orders.put = function(data,callback){
    let direction = typeof(data.payload.direction) == 'string' && data.payload.direction.trim().length > 0 && data.payload.direction.trim().length <= 255 ? data.payload.direction.trim() : false;
                
    let items     = typeof(data.payload.items) == 'object' && 
                    data.payload.items instanceof Array && 
                    data.payload.items.length > 0 &&
                    data.payload.items.git (element => {
                        try{
                            return !(element.id.length > 0 && element.quantity > 0 && element.precio > 0 ? true : false);
                        }catch(e){
                            console.log(e);
                            return false;
                        }
                        }).length == 0
                    
                    ? data.payload.items : false;

    if(direction || items){
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false ;

        _data.read('tokens',token,function(err,tokenData){
                if(!err&&tokenData){
                let userEmail = tokenData.email;
                _data.read('users',userEmail,function(err,userData){
                    if(!err&&userData){
                        let order = typeof(data.payload.order) == 'string' && data.payload.order.trim().length > 0 ? data.payload.order.trim() : false ;
                            _data.read('orders',order,function(err,orderData){
                                if(!err&&orderData){
                                    
                                    if(direction){
                                        userData.firstName = direction;
                                    }
                                    
                                    if(items){
                                        userData.lastName = items;
                                    }

                                    _data.update('orders',order,orderData,function(err){
                                        if(!err){
                                            callback(200);
                                        }else{
                                            console.log(err);
                                            callback(500,{'Error':'Could not update the order'});
                                        }
                                    });
                                }else{
                                    callback(403)
                                }
                            })

                    }else{
                        callback(403);
                    }
                });
            
            }else{
                callback(403);
            }
        })
    }else{
        callback(400,{'Errors':'Missing fieds'})
    }
};

// Order delete
// Required data : token for authetication, order 
// Optional data : none
orders.delete = function(data,callback){
    let token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false ;
    _data.read('tokens',token,function(err,tokenData){
        if(!err&&tokenData){
            let userEmail = tokenData.email;
            _data.read('users',userEmail,function(err,userData){
                if(!err&&userData){
                    let order = typeof(data.payload.order) == 'string' && data.payload.order.trim().length > 0 ? data.payload.order.trim() : false ;
                    _data.read('orders',order,function(err,data){
                        if(!err&&data){
                            if(data.email&&userEmail){
                                _data.delete('order',order,function(err){
                                    if(!err){
                                        callback(200);
                                    }else{
                                        callback(500,{'Error':'Could not delete the order'})
                                    }
                                })
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

};

module.exports = orders;