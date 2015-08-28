var prompt = require("prompt");
var LiveBot = require("./lctvLib");
var rss_feed = "https://www.livecoding.tv/rss/oasis/followers/?key=GamSOPCpH1AFdCze";


prompt.start();
prompt.get({properties: {password: {hidden: true}}}, function (err, result) {
    
    var bot = new LiveBot('livebot',result.password,'oasis','BOT#');
    
    require('./plugins/restService')(bot);

    require('./plugins/userJoinLeave')(bot, rss_feed);
    
    require('./plugins/follower')(bot, rss_feed);
    
    require('./plugins/message')(bot);
    
    require('./plugins/roulette')(bot);
    
    require('./plugins/random')(bot);
    
    require('./plugins/rank')(bot);
    
    require('./plugins/biffle')(bot);
    
    require('./plugins/beer')(bot);
    
    //require('./eval')(bot);
});