
const _data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const tokens = require('./tokens');

menu = {};


// menu post
// Required data : name, description, price
// Optional data : none
// @TODO         : only admin can change add to the menu
menu.post = function(data,callback){
    
    //check order
    
    let name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0  ? data.payload.name.trim() : false;
    let description = typeof(data.payload.description) == 'string' && data.payload.description.trim().length > 0  ? data.payload.description.trim() : false;
    let price = typeof(data.payload.price) == 'number' && data.payload.price > 0 ? data.payload.price : false;
    //*/
    if(name&&description&&price){
        
                //console.log(tokenData);
                // Lookup the user data

                        let id = helpers.createRandomString(10);
                        let itemObject = {
                            'id':id,
                            'description':description,
                            'name':name,
                            'price':price
                        };
                        
                        _data.create('menu',id,itemObject, function(err){
                            if(!err){
                                callback(200);
                            }else{
                                console.log(err);
                                callback(500,{'Error':'Could not create the user'});
                            }
                        });
                        //*/

    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};


// menu get
// Required data : token
// Optional data : id
// @TODO         : get by an item from menu only id
menu.get = function(data,callback){

        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        
        _data.read('tokens',token,function(err,tokenData){
            if(!err&&tokenData){
                let email = tokenData.email;

                _data.read('users',email,function(err,userData){
                    if(!err&&userData){
                        _data.list('menu',function(err,menuData){
                            if(!err&&menuData){
                                let items = [];
                                let count=0;
                                let readErrors=false;
                                let total = menuData.length;
                                menuData.forEach(item => {
                                    
                                   _data.read('menu',item,function(err,itemData){
                                    if(err){
                                        readErrors = true;
                                    }else{
                                        items.push(itemData);
                                        count++;
                                        if(count == total){
                                            if(!readErrors){
                                                callback(200,items);
                                            }else{
                                                callback(500, {'Error':'Errors encountered attempting to delete all of the user\'s checks. All checks may not have been deleted from the system successfully'})
                                            }
                                        }
                                    }
                                    
                                   }) 
                                   
                                });
                                

                            }else{
                                console.log(err);
                                callback(500,{'Error':'Could not load menu'})
                            }
                        })
                    }else{
                        callback(403);
                    }
                })
            }else{
                callback(403)
            }
        });

}




module.exports = menu;