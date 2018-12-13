/*
 *  Request Handlers 
 */
 
// Dependencies
const _users = require('./handlers/users');
const _tokens = require('./handlers/tokens');
const _orders = require('./handlers/orders');
const _menu   = require('./handlers/menu');
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
// Ping handler

handlers.ping = function(data, callback){
    // Callback a http status code, and a payload object
    callback(200);
};

// Not found handler

handlers.notFound = function(data,callback){
 callback(404);
}

// Export The module

module.exports = handlers;