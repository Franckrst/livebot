/**
 * Livebot Follower Plugin
 * 
 * Fonctionnement :
 * 
 * Configuration :
 * 
 *      - checkDelais:      Delais de l'infinit loop pour le check de followers
 *      - message :         Message du bot quand on a un nouveau follow avec
 *                          pour variable pseudo %pseudo%
 * 
 * Parametres :
 * 
 *      - bot :             Instance de bot
 *      - rss :             Flux rss livecoding des followers
 * 
 */
 
var request = require('request');
var xml2js = require('xml2js');

var message  = "\n▂▃▅▇█▓▒░۩۞۩ ۩۞۩░▒▓█▇▅▃▂"+
"\nBienvenue à vous ma seigneurie %pseudo%"+
"\n▂▃▅▇█▓▒░۩۞۩ ۩۞۩░▒▓█▇▅▃▂";



var rss = null;
var checkDelais = 5000;

var lastFollowers = [];
var bot = null;
/**
 * 
 * Infit loop Check followers
 * 
 **/
var checkFollowers = function() {
    //On charge le rss
    request(rss, function (error, response, body) {
        //Si pas d'erreur dans la request
        if (!error && response.statusCode == 200) {
            //Parsing
            xml2js.parseString(body, function (err, result) {
                    //Stock la liste des follower du rss charger
                    var lastFollowersUpdate = [];
                    //stock la diférence entre lastFollowersUpdate et lastFollowers
                    var newFollowers = [];
                    
                    if(result.rss == undefined) return;
                    //Boucle sur le XML
                    if(result.rss == undefined) return;
                    result.rss.channel[0].item.forEach(function (item, i, array) {
                        if (lastFollowers.length != 0)
                        if(lastFollowers.indexOf(item.title[0]) == -1){
                            bot.send(message.replace("%pseudo%",item.title[0]));
                            newFollowers.push(item.title[0]);
                        }
                        //push tout les followers
                        lastFollowersUpdate.push(item.title[0]);
                    });
                    //Update
                    lastFollowers = lastFollowersUpdate;
            });

        }
    });
    //Relance
    setTimeout(checkFollowers,checkDelais);
};

/**
 * Main function
 * 
 * @param botp - bot instance
 * @param rssp - Flux rss livecoding des followers
 **/
module.exports = function(botp,rssp){
    bot = botp;
    rss = rssp;
    checkFollowers();
    bot.on('message',function(pseudo,message){
        if(pseudo == 'Oasis' && message == '!followers'){
            bot.send('\n'+lastFollowers.join('\n'));
        }
    });
}