import { createServer } from 'http'; // Import Node.js core module

var server = createServer(function (req, res) {   //create web server
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('OK, server is running');
    res.end();

});

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')