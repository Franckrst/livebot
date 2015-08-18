/**
* Livebot Beer Plugin
*
* Fonctionnement :
*
*      - !beer [@]{username}
*          Donne une bière à l'utilisateur {username}.
*
* Configuration :
*
*/

var spam = require("../../modules/spam");

module.exports = function(bot) {

  var spamTest = new spam(5);
  bot.on('message',function(pseudo,message){
    var message = message.split(' ');
    if( message[0] == '!beer' &&
      message.length === 2){
        if(spamTest.isOk("beer")){
          var users = bot.users;
          if (message[1] in users) {
            bot.send(bot.username + ' donne une bière à '+ message[1]);
          }
        }
      }
  });

};
