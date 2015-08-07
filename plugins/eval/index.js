module.exports = function(bot){
    bot.on('message',function(pseudo,message){
        if(pseudo != 'Oasis')return;
        console.log(message.substr(0,5) );
        if(message.substr(0,5) == '!eval'){
            var code = message.substr(6,message.length-6);
            bot.send(eval(code));
        }
    });
}