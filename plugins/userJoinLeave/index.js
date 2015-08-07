/**
 * Livebot UserJoinLeave plugin
 * 
 * Fonctionnement :
 * 
 * Configuration :
 * 
 * Parametres :
 * 
 */
var request = require("request");
var xml2js = require("xml2js");
var spam = require("../../modules/spam");
module.exports = function(bot,rss){
    var spamFilter = new spam(30);
    bot.on('userLeave',function(pseudo){
        if(spamFilter.isOk(pseudo))
        request(rss, function (error, response, body) {
            //Si pas d'erreur dans la request
            if (!error && response.statusCode == 200) {
                //Parsing
                xml2js.parseString(body, function (err, result) {
                    var isFollower = false;
                    if(result.rss == undefined) return;
                    result.rss.channel[0].item.forEach(function (item, i, array) {
                        if(item.title[0].toLowerCase() == pseudo.toLowerCase()){
                            isFollower = true;
                        }
                    });
                    if(isFollower && pseudo != "michgeek"){
                        bot.send(pseudo+' est malheureusement parti! :tears: ');
                    }else{
                        bot.send(pseudo+' est enfin parti! :666: ');
                    }
                });
    
            }
        });
    });
    bot.on('userJoin',function(pseudo){
        //bot.send('Bonjour '+pseudo);
    });
}