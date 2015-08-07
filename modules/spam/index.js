module.exports = function(delai){
    this.delai = delai;
    this.lastMessages  = {};
    this.isOk = function(message){
        var now = Date.now()/1000;
        if(this.lastMessages[message] == undefined){
            this.lastMessages[message] = now;
            return true;
        }
        if(this.lastMessages[message] < (now-this.delai)){
            this.lastMessages[message] = now;
            return true;
        }
        return false;
    }
}