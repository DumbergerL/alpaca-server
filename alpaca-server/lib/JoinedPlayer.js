
class JoinedPlayer{
    constructor(name, id, callbackUrl=null){
        this.name = name;
        this.id = id;
        this.callbackUrl = callbackUrl;
    }

    println(){
        console.log("Joined: "+this.name+" ("+this.id+") URL: "+this.callbackUrl);
    }

    static GENERATE_ID(){
        var hash = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 4; i++ ) {
           hash += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        return hash;
    }
}

module.exports = JoinedPlayer;