
const _data = require('../data');
const helpers = require('../helpers');
const config = require('../config');
const tokens = require('./tokens');

payments = {};

payments.get = function(data,callback){
    let email ="some email";
    
    helpers.payStripe(email,data, function(err,res){
        if(!err&&res){

        }else{
            console.log(err);
            callback(500,{'Erro':'Could not connect to stripe.'});
        }
    });
}

module.exports = payments;

