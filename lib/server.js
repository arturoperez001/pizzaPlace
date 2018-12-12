
/// Dependencies

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');
//Instatiate the server module object
var server = {};

// Todo: the server should respond to ll request with a string
// @TODO GET RID OF THIS
/*
helpers.sendTwilioSms('4158375389','Hello',function(err){
    console.log('This was the error: '+err);
})
//*/
// Intantiate the HTTP server

server.httpServer = http.createServer(function(req, res){
   server.unifiedServer(req,res);
});


// Intatiate the HTTPs server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname,'../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname,'../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
    server.unifiedServer(req,res);
 });
// All server logic for both, http and https server

server.unifiedServer = function (req, res){
     //Get the URL and parse it
     var parseUrl = url.parse(req.url, true);
     // Get the path
     var path = parseUrl.pathname;
     
     var trimmedPath = path.replace(/^\/+|\/+$/g,'');
 
     // Get the query string as an object
     
     var queryStringObject = parseUrl.query;
     
     // Get the http method
     
     var method = req.method.toLowerCase();
     
     // Get the headers as an object
 
     var headers = req.headers;
 
     //Get the Payload, if any
 
     var decoder = new StringDecoder('utf-8');
     var buffer = '';
     req.on('data', function(data){
        buffer += decoder.write(data);
     });
     
     req.on('end', function() {
         buffer += decoder.end();        
     
         // Choose the handler this request should go to. if none is not found, use the not found handler
         var choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : _handlers.notFound;
         //res.end('Hello World\n');
         //Construct the data object to send to the handler
 
         let data = {
             'trimmedPath' : trimmedPath,
             'queryStringObject': queryStringObject,
             'method' : method,
             'headers' : headers,
             'payload' : helpers.parseJsonToObject(buffer)
         };
         
         // Route the request to the handler specified in the router

         choosenHandler(data,function(statusCode,payload){
             // Use the status code called back by the handler, or default to not found
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
 
             // Use the payload called bakc by the handler, or default to not found
             payload = typeof(payload) == 'object' ? payload : {};
 
             //Convert the payload to a string
 
             var payloadString = JSON.stringify(payload);
 
             // Return the response
             res.setHeader('Content-Type','application/json');
             res.writeHead(statusCode);
             res.end(payloadString);
 
             //log the request path
            // if the response is 200, print greed otherwise print red
            if(statusCode=200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }else{
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }
             
         });
         //*/
   
     });
  
}

// Define a request router

server.router = {
    'ping': _handlers.ping,
    'user': _handlers.users,
    'tokens': _handlers.tokens,
    'orders': _handlers.orders
};

// init Script

// Start the HTTP server

server.init = function(){
    
    server.httpServer.listen(config.httpPort, function(){
        console.log('\x1b[36m%s\x1b[0m','The server is listening on port '+config.httpPort);
    });
    server.httpsServer.listen(config.httpsPort, function(){
        console.log('\x1b[36m%s\x1b[0m','The server is listening on port '+config.httpsPort);
    });

}

// Export the module

module.exports = server;