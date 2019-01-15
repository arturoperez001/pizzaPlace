/*
 *  Request Handlers 
 */
 
// Dependencies
const _users = require('./handlers/users');
const _tokens = require('./handlers/tokens');
const _orders = require('./handlers/orders');
const _menu   = require('./handlers/menu');
const _payments   = require('./handlers/payments');
const helpers = require('./helpers')
// Define the handlers
const handlers = {};
//  Handlers users

handlers.users = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        _users[data.method](data,callback);
    }else{
        callback(405);
    }
};

// Token Handlers

handlers.tokens = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        _tokens[data.method](data,callback);
    }else{
        callback(405);
    }
};

// Order Handlers

handlers.orders = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        _orders[data.method](data,callback);
    }else{
        callback(405);
    }
};

// menu Handlers

handlers.menu = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        _menu[data.method](data,callback);
    }else{
        callback(405);
    }
};

// payments Handlers

handlers.payments = function(data,callback){
    var acceptableMethods = ['post','get'];
    if(acceptableMethods.indexOf(data.method) > -1){
        _payments[data.method](data,callback);
    }else{
        callback(405);
    }
};
// Ping handler

handlers.ping = function(data, callback){
    // Callback a http status code, and a payload object
    callback(200);
};

handlers.index = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'The Pizza place site ',
           'head.description' : `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. 
                                 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. 
                                 Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                 Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
           'body.class'    : 'index'
       }

       helpers.getTemplate('index',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

handlers.cartList = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Shopping cart list',
           
           'body.class'    : 'cart'
       }

       helpers.getTemplate('cart',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};
// Not found handler

handlers.notFound = function(data,callback){
 callback(404);
}

// Create Account

handlers.accountCreate = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Create an Account',
           'head.description' : 'Signup is easy and only takes few seconds.',
           'body.class'    : 'createAccount'
       }

       helpers.getTemplate('createAccount',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

// Create Session

handlers.sessionCreate = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Login to your Account',
           'head.description' : 'Please enter to your phone number and password access your account',
           'body.class'    : 'sessionCreate'
       }

       helpers.getTemplate('sessionCreate',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

// Deleted Session

handlers.sessionDeleted = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Logged Out',
           'head.description' : 'You have been logged out of your account',
           'body.class'    : 'sessionDeleted'
       }

       helpers.getTemplate('sessionDeleted',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

// Edit your Account

handlers.accountEdit = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Account Settings',
           'body.class'    : 'editAccount'
       }

       helpers.getTemplate('editAccount',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

// Account has been deleted

handlers.accountDeleted = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Account Deleted',
           'head.description' : 'Your account has been deleted',
           'body.class'    : 'deletedAccount'
       }

       helpers.getTemplate('deletedAccount',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

// Menu has been deleted

handlers.menuList = function(data,callback){
    if(data.method=='get'){
       let templateData = {
           'head.title' : 'Menu',
           'body.class'    : 'menuList'
       }

       helpers.getTemplate('menuList',templateData,function(err,str){
           if(!err&&str){
               helpers.addUniversalTemplates(str,templateData,function(err,str){
                   if(!err&&str){
                       callback(200,str,'html');
                   }else{
                       callback(500,undefined,'html');
                   }
               });
           }else{
               callback(500,undefined,'html');
           }
       })
       //callback(200,'<h1>Hello World</h1>','html');
    }else{
        callback(405,undefined,'html');
    }
};

// Public Assets
handlers.public = function(data,callback){
    //Reject any request that isn't a GET
    if(data.method){
        //console.log(data);
        // Get the filename being requested 
        let trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if(trimmedAssetName.length>0){
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName,function(err,data){
                if(!err&&data){

                    let contentType = 'plain';
                    
                    if(trimmedAssetName.indexOf('.css')>-1){
                        contentType='css'; 
                    }
                    
                    if(trimmedAssetName.indexOf('.png')>-1){
                        contentType='png'; 
                    }
                    
                    if(trimmedAssetName.indexOf('.jpg')>-1){
                        contentType='jpg'; 
                    }
                    
                    if(trimmedAssetName.indexOf('.ico')>-1){
                        contentType='ico'; 
                    }

                    callback(200,data,contentType);
                }else{
                    callback(404);
                }
            });
        }else{
            callback(404);
        }
    }else{
        callback(405);
    }
}
// Export The module

module.exports = handlers;