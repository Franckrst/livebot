var xmpp = require('simple-xmpp').SimpleXMPP;
var EventEmitter = require('events').EventEmitter;

module.exports = function(userName,password,room,surnom,admins,eventDelai){
    var self = this;
    
    var HOST = 'livecoding.tv';
    var HOST_PORT = '5222';
    var HOST_MUC = "chat.livecoding.tv";
    
    this.admins = admins;
    this.eventDelai = eventDelai || true;
    this.sendEvent = false || !this.eventDelai
    this.surnom = surnom || userName;
    this.userName = userName;
    this.password = password;
    this.room = room+"@"+HOST_MUC;
    this.xmpp = new xmpp();
    this.events = new EventEmitter();
    
    this.users = [];
        
        
    this.isAdmin = function(pseudo){
        return this.admins.indexOf(pseudo) != -1
    }
    /**
     * Listener Add / Remove
     **/
    this.on = function() {
        this.events.on.apply(self.events, Array.prototype.slice.call(arguments));
    };
    this.removeListener = function() {
        this.events.removeListener.apply(self.events, Array.prototype.slice.call(arguments));
    };
    this.send = function(message){
        this.xmpp.send(self.room, message,true);
    }
    /**
     * Connection deconnection des utilisateurs
     **/
    this.xmpp.on('groupbuddy', function( id, name, state, statusText) {
        if(state == 'online'){
            if(self.users.indexOf(name) != -1)return;
            self.users.push(name);
            if(self.sendEvent)
            self.events.emit('userJoin',name);
        }else{
            self.users.splice(self.users.indexOf(name),1);
            if(self.sendEvent)
            self.events.emit('userLeave',name);
        }
        if(self.sendEvent)
        self.events.emit('usersChange',self.users);
    });
    /**
     * connection au salon OK
     **/
    this.xmpp.on('buddy', function(id, state, statusText) {
        self.events.emit('joined', id, state, statusText);
    });
    /**
     * Réception des messages
     **/
    this.xmpp.on('groupchat', function( conference, id, message, stamp) {
        if(self.sendEvent){
            self.xmpp.conn.connection.socket.write('');
            self.events.emit('message',id, message);
        }
    });
    /**
     * joindre un salon apres connection 
     **/
    this.xmpp.on('online', function(data) {
        // Delai pour les events car sinon on se fait spam au début.
        if(self.eventDelai)
        setTimeout(function(){self.sendEvent = true;console.log('emit event')},5000);
        console.log('Connected with JID: ' + data.jid.user);
        var joinTo = self.room+'/'+self.surnom; 
        self.xmpp.join(joinTo);
        self.events.emit('online',data);
    });
    /**
     * Error
     **/
    this.xmpp.on('error', function(err) {
        console.error("ERR!",err);
    });
    /**
     * Deconection
     **/
    this.xmpp.on('close', function() {
        console.error("ERR!",'Deconnection');
        self.events.emit('close');
        setTimeout(function(){
            console.error("ERR!",'Reconnection');
            self.connect();
        },5000);
    });
    /**
     * Connection
     **/
    this.connect = function(){
        this.xmpp.connect({
            jid                 : this.userName+'@'+HOST,
            password            : this.password,
            host                : HOST,
            port                : HOST_PORT
        });
     }
     this.connect();
}
