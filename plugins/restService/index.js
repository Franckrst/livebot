
var restify = require("restify");


function respond(req, res, next) {
  res.send('hello ');
  next();
}

var server = restify.createServer();
server.use(restify.bodyParser());
server.get('/start', function(req, res, next){
    console.log('emit event : true');
    bot.sendEvent = true;
    res.send('OK');
    return next();
});
server.get('/stop', function(req, res, next){
    console.log('emit event : false');
    bot.sendEvent = false;
    res.send('OK');
    return next();
});
server.post('/cmd', function(req, res, next){
    console.log('message','Oasis',req.params);
    bot.events.emit('message','Oasis',req.params.emit);
    res.send('OK');
    return next();
});

console.log(process.env.IP+":"+process.env.PORT);
server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});