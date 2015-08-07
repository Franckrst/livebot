/**
 * Livebot Random plugin
 * 
 * Fonctionnement :
 * 
 * Configuration :
 * 
 * Parametres :
 * 
 */
 
var spam = require("../../modules/spam");
module.exports = function(bot){
    
    var spamTest = new spam(5);
    bot.on('message',function(pseudo,message){
        var message = message.split(' ');
        var reg = /^\d+$/;
        if( message[0] == '!random' &&
            message.length === 2 &&
            message[1] > 0 &&
            reg.test(message[1])){
            if(spamTest.isOk("random")){
            var val = Math.floor((Math.random() * message[1]));
            bot.send('@'+pseudo+' entre : 0 et '+message[1]+ ' : ' +val);
            }
        }
    });
    
}