var Card = require('./card');

class Player{

    constructor(playerName, Game)
    {
        this.game = Game;
        this.name = playerName;
        this.hand = Array();
        this.coins = Array();
        this.leftRound = false;
    }

    drawCard(){
        var card = this.game.drawCard()
        this.hand.push( card );
        if(this.game.DEBUG)console.log(" << "+this.name+" draws Card "+card.name);
    }

    dropCard(cardName){
        var cardToDrop = null;
        this.hand = this.hand.filter( card => {
            if(card.name === cardName.toUpperCase() && !cardToDrop){
                cardToDrop = card;
                return false;
            }else{
                return true;
            }
        });

        if(!cardToDrop)throw("Player has no such card on the Hand!");

        if(Card.PLAYABLE(cardToDrop, this.game.getDiscardpileCard())){        
            this.game.dropCard(cardToDrop);
            if(this.game.DEBUG)console.log(" >> "+this.name+" drops Card "+ cardToDrop.name);
        }else{
            throw("Card ("+cardToDrop.name+") does not match the Discardpile ("+this.game.getDiscardpileCard().name+")!");
        }
    }

    leaveRound(){
        if(this.game.DEBUG)console.log(" XX "+this.name+" left the Round");
        this.leftRound = true;
    }

    dropCoin(){
        this.sortCoins();
        if(this.coins.length > 0){
            this.coins.pop();
        }
    }

    drawCoin(coin){
        this.coins.push(coin);
        this.sortCoins();
    }

    sortCoins(){
        this.coins.sort( (a,b) => {
            return b.value - a.value;
        });
    }

    getScore(){
        var score = 0;
        this.coins.forEach( coin => {
            score += coin.value;
        });
        return score;
    }

    print(){
        console.log();
        console.log("PLAYER "+this.name);
        console.log("> Cards: "+this.hand.length);
        console.log("> LeftRound: "+this.leftRound)
    }

    printCardln(){
        var output = "";
        for(var i = 0; i < this.hand.length; i++){
            output += "["+this.hand[i].value+"]";
        }
        console.log(output);
        console.log();
    }

    printCoinsln(){
        var output = "";
        for(var i = 0; i < this.coins.length; i++){
            output += "("+ (this.coins[i].name == 'BLACK' ? "B" : this.coins[i].name == 'WHITE' ? "W" : "?") +")";
        }
        console.log(output);
    }
}

module.exports = Player;