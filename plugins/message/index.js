/**
 * Livebot message plugin
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
    var spamTest = new spam(10);
    var messages = {
        pfr : "Création d'un dashboard avec angular et d'une app avec ionic, pour que les streamer twitch puisses créer un programme tv et que les utilisateur avec une app mobile reçoive des notification avant le début d'un programme",
        users : function(){return "\n"+bot.users.join('\n');},
    };
    bot.on('message',function(pseudo,message){
        /**
         *  Send msg
         **/
        Object.keys(messages).forEach(function(key,i){
            if('!'+key == message){
                if(spamTest.isOk(key)){
                    if(typeof messages[key] == 'function'){
                        bot.send(messages[key]());
                    }else{
                        bot.send(messages[key]);
                    }
                }
                return false;
            }
        })
        /**
         *  Add msg
         **/
         if(message.substr(0,7) == '!addmsg' && pseudo == 'Oasis'){
             message = message.split("$#$");
             messages[message[1]]=message[2];
         }
    });
}