/**
 * Livebot Ranks Plugin
 * 
 * Fonctionnement :
 * 
 *      - @pseudonyme [+|-]point(s)
 *          Si la commande est lancée par un admin, ajoute ou soustrait x point(s) à l'utilisateur spécifié.
 *      - !top
 *          Affiche le top des utilisateurs du channel.
 * 
 * Configuration :
 * 
 *      - adminUsernames:       Liste des utilisateurs pouvant ajouter / enlever des points.
 *      - usernameRegex:        Regex utilisée pour la validation d'un pseudonyme.
 *      - ranksFilename:        Fichier utilisé pour la sauvegarde des ranks (les ranks sont sauvegardés déjà classés pour éviter la redondance de l'opération).
 *      - allowNegativeRanks:   Détermine si les ranks négatifs sont autorisés ou non (arrondi à zéro si false).
 *      - topLength:            Nombre d'entrées maximale affichées par la commande !top.
 * 
 */

var spam = require("../../modules/spam");

module.exports = function(bot) {
    var adminUsernames = ['Oasis'];0
    var usernameRegex = /^@\w+$/;
    var ranksFilename = __dirname+'/ranks.json';
    var allowNegativeRanks = true;
    var topLength = 10;
    
    var fs = require('fs');
    var ranks = {};
    var spamTest = new spam(5);
    function saveRanks(content) {
        console.log( JSON.stringify(content));
        fs.writeFile(ranksFilename, JSON.stringify(content), function(err) {
            if (err) {
                throw err;
            }
        });
    }
    
    function operationOutput(operationString, rawPoints, currentUsername, currentPoints) {
        return operationString + rawPoints + pluralize(' point', rawPoints) + ' to ' + currentUsername + ' (Total ' + pluralize(' point', currentPoints) + ': ' + currentPoints + ')';
    }
    
    function pluralize(word, amount) {
        if (amount > 1 || amount < -1) {
            word += 's';
        }
        
        return word;
    }
    
    function sortRanks(obj) {
        var sortable = [];
        
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                sortable.push([key, obj[key]]);
            }
        }
    
        sortable.sort(function(a, b) { return b[1] - a[1]; });
        
        var ranks = {};
        
        sortable.forEach(function(rank) {
            ranks[rank[0]] = rank[1];
        });
        
        return ranks;
    }
    
    fs.stat(ranksFilename, function(err, stat) {
        if (err !== null) {
            saveRanks('');
        } else {
            fs.readFile(ranksFilename, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                
                ranks = JSON.parse(data);
            });
        }
    });
    
    bot.on('message', function(username, message) {
        var message = message.split(' ');
        
        if (message.length === 2 && 
            message[0].charAt(0) === '@' &&
            (message[1].charAt(0) === '+' || message[1].charAt(0) === '-') &&
            adminUsernames.indexOf(username) > -1 && 
            usernameRegex.test(message[0]) &&
            /^[\+-]\d+$/.test(message[1])) {
                
            var currentUsername = message[0];
            currentUsername = currentUsername.substring(1);
            var points = message[1];
            var currentPoints = 0;
            var operationString = '';
            
            if (currentUsername in ranks) {
                currentPoints = ranks[currentUsername];
            }
            
            var rawPoints = parseInt(points.substring(1));
            var operator = points.charAt(0);
            
            if (rawPoints === 0) {
                return;
            }
            
            if (operator === '+') {
                currentPoints += rawPoints;
                operationString = 'Added ';
            } else if (operator === '-') {
                currentPoints -= rawPoints;
                operationString = 'Removed ';
            }
            
            if (!allowNegativeRanks && currentPoints < 0) {
                currentPoints = 0;
            }
            
            ranks[currentUsername] = currentPoints;
            ranks = sortRanks(ranks);
            
            bot.send(operationOutput(operationString, rawPoints, currentUsername, currentPoints));

            saveRanks(ranks);
        } else if (message.length === 1 && message[0] === '!top') {
            if (spamTest.isOk("top")) {
                var length = topLength;
                
                if (ranks.length < length) {
                    length = ranks.length;
                }
                
                var i = 0;
                var str = 'Top users:\n';
                
                for (var key in ranks) {
                    if (ranks.hasOwnProperty(key) && i < length) {
                        str += '#' + (i + 1) + ' - ' + key + ' (' + ranks[key] + pluralize(' point', ranks[key]) + ')\n';
                    }
                    
                    i++;
                }
                
                bot.send(str);
            }
        }
    });
};