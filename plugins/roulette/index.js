/**
 * Livebot roulette plugin
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
        if(message == '!roulette'){
            if(spamTest.isOk("roulette")){
                var val = Math.floor((Math.random() * 10) + 1);
                if(val != 5 && pseudo != 'michgeek'){
                    bot.send(pseudo+' Gagner');
                }else{
                    bot.send(pseudo+' Perdu');
                }
            }
        }
    });
    
}