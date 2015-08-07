/**
 * Livebot Biffle Plugin
 * 
 * Fonctionnement :
 * 
 *      - !biffle [@]pseudonyme
 *          Si la commande est lancée par un admin, lance une nouvelle biffle pour l'utisateur spécifié (@ optionnel).
 *      - !biffle
 *          Si la commande est lancée par un admin, stoppe toute biffle en cours.
 *          Si la commande est lancée par un utilisateur lambda et qu'une biffle est en cours, lance une biffle.
 * 
 * Configuration :
 * 
 *      - adminUsernames:   Liste des utilisateurs pouvant lancer une biffle.
 *      - delayInSeconds:   Durée d'une biffle en secondes.
 *      - usernameRegex:    Regex utilisé pour la validation d'un pseudonyme.
 *      - slaps:            Liste des différentes biffles avec @X la personne bifflant et @Y la personne bifflée.
 * 
 */

module.exports = function(bot) {
    var adminUsernames = ['Oasis'];
    var delayInSeconds = 10;
    var usernameRegex = /^@?\w+$/;
    
    var slaps = [
        "@X slaps @Y around a bit with a large trout.",
        "@X pose son membre sur la tête de @Y."
        ];
    
    var enabled = false;
    var timer;
    var currentUsername;
    
    bot.on('message', function(username, message) {
        var message = message.split(' ');
        
        if (message[0] === '!biffle') {
            if (adminUsernames.indexOf(username) > -1) {
                clearTimeout(timer);
                
                if (message.length === 1) {
                    enabled = false;
                } else if (message.length === 2 && message[1].length > 0 && usernameRegex.test(message[1])) {
                    enabled = true;
                    currentUsername = message[1];
                    
                    if (currentUsername.charAt(0) === '@') {
                        currentUsername = currentUsername.substring(1);
                    }
                    
                    timer = setTimeout(function() { enabled = !enabled; }, delayInSeconds * 1000);   
                }
            } else {
                if (enabled && message.length === 1) {
                    var str = slaps[Math.floor(Math.random() * slaps.length)];
                    str = str.replace(/@X/g, username);
                    str = str.replace(/@Y/g, currentUsername);
                    
                    bot.send(str);
                }
            }
        }
    });
};