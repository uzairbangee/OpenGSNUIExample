var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res) {
    if (req.url === '/') {
        fs.readFile('./etherless.html', function(err, data) {
            if (err){
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data); 
            res.end();
            return;
        });
    } else if (req.url === '/bundle.js') {
        fs.readFile('./bundle.js', function (err, data) {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
            return;
        });
    }
}).listen(3000);