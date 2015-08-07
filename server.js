var prompt = require("prompt");
var LiveBot = require("./lctvLib");


prompt.start();
prompt.get({properties: {password: {hidden: true}}}, function (err, result) {
    
    var bot = new LiveBot('livebot',result.password,'oasis','BOT#');
    

    require('./plugins/userJoinLeave')(bot,"https://www.livecoding.tv/rss/oasis/followers/?key=GamSOPCpH1AFdCze");
    
    require('./plugins/follower')(bot,"https://www.livecoding.tv/rss/oasis/followers/?key=GamSOPCpH1AFdCze");
    
    require('./plugins/message')(bot);
    
    require('./plugins/roulette')(bot);
    
    require('./plugins/random')(bot);
    
    require('./plugins/rank')(bot);
    
    require('./plugins/biffle')(bot);
    
    
    //require('./eval')(bot);
});