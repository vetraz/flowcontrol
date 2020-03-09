const finalhandler = require('finalhandler');
const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');

//Static http server
// Serve up public/ftp folder
let serve = serveStatic(path.join(__dirname, './frontend'));

// Create server
let server = http.createServer(function onRequest(req, res) {
    serve(req, res, finalhandler(req, res))
});

// Listen
server.listen(process.env.HTTP_PORT || 9696);