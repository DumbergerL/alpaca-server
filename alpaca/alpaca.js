let Player = require('./lib/player');
let Card = require('./lib/card');
let shuffle = require('shuffle-array');
let Coin = require('./lib/coin');

class AlpacaGame{

    constructor(playerArr){
        this.DEBUG = false;

        this.afterTurnCallback = function(){};

        this.playerList = Array();  
        playerArr.forEach(name => {
            var player = new Player(name, this);
            this.playerList.push( player );
        });

        this._initRound();

        this.currentPlayer;
        this.discardpile;
        this.cardpile;
    }

    _initRound(){
        if(this.DEBUG){console.log(); console.log("____INIT ROUND____");}

        this.cardpile = Array();    //Create Card Pile
        Card.GET_DEFINED_CARDS().forEach( cardObj => {
            for(var i = 0; i < 8; i++){
                this.cardpile.push(new Card(cardObj.type));
            }            
        });
        shuffle(this.cardpile);

        this.discardpile = Array(); //Create Discardpile
        this.discardpile.push( this.cardpile.pop() );

        this.playerList.forEach( player => {        //Every Player Joins Round
            player.leftRound = false;
            player.hand = Array();
        });
        
        for(var indexCard = 0; indexCard < 6; indexCard++){ //Draw Card for Player
            for(var indexPlayer = 0; indexPlayer < this.playerList.length; indexPlayer++){
                this.playerList[indexPlayer].drawCard();
            }
        }    

        var indexFirstPlayer = Math.floor(Math.random() * this.playerList.length);//Select Player to beginn
        this.currentPlayer = this.playerList[indexFirstPlayer];

        if(this.DEBUG){console.log(); console.log("____START GAME____");}
    }


    drawCard(){
        return this.cardpile.pop();
    }

    dropCard(card){
        this.discardpile.push(card);
    }

    getDiscardpileCard(){
        return this.discardpile[this.discardpile.length-1];
    }

    playTurn(action, cardName = null){
        switch (action.toUpperCase()) {
            case 'DROP CARD':
                this.currentPlayer.dropCard(cardName);
                break;
            case 'DRAW CARD':
                if(this.cardpile.length <= 0)throw("There are no Cards left on the Draw Pile! Choose other Action...");
                this.currentPlayer.drawCard();
                break;
            case 'LEAVE ROUND':
                this.currentPlayer.leaveRound();
                break;
            default:
                throw("Invalid Action ("+action+") invoked!");
                break;
        }
        if(this.DEBUG)this.currentPlayer.printCardln();

        if(this.currentPlayer.hand.length <= 0)this._finishedRound();

        var nextPlayerIndex = null;
        var currentPlayerIndex = this.playerList.indexOf( this.currentPlayer );
        var playersWhoLeft = 0;
        for(var i = currentPlayerIndex + 1; i != currentPlayerIndex; i++){  //check all other players...
            if(i >= this.playerList.length){
                i = 0;   //closes list to ring
            }
            
            if(!this.playerList[i].leftRound){
                nextPlayerIndex = i;
                break;
            }else{
                playersWhoLeft++;
                if(playersWhoLeft >= this.playerList.length)break;
            }
        }

        if(nextPlayerIndex != null){
            this.currentPlayer = this.playerList[nextPlayerIndex];
        }else{
            if(this.currentPlayer.leftRound){
                this._finishedRound();
            }
        }

        this.afterTurnCallback();
    }

    getPlayerStatus(playerName){
        var status = {};
        this.playerList.forEach( player => {
            if(player.name === playerName){
                status['hand'] = player.hand;
                status['my_turn'] = (player === this.currentPlayer);
                status['score'] = player.getScore();
                status['coins'] = player.coins;
                status['discarded_card'] = this.getDiscardpileCard();
            }
        });
        return status;
    }

    _finishedRound(){
        if(this.DEBUG){
            console.log();
            console.log();
            console.log();
            console.log("---------------------FINISCHED ROUND-----------------------");
            console.log();
        }
        
        this._cashUp();
        if(this.DEBUG)this.printScoreln();
        this._initRound();
    }

    _cashUp(){
        if(this.DEBUG)console.log("____COIN STATUS____");
        this.playerList.forEach(player => {
            if(this.currentPlayer === player){//WINNER
                player.dropCoin();
            }
            var points = 0;
            var alreadyAccounted = Array();
            player.hand.forEach( card => {
                if(alreadyAccounted.indexOf( card.type ) === -1){
                    points += card.value;
                    alreadyAccounted.push( card.type );
                }
            });

            var nWhite = 0 + points;
            var nBlack = 0;

            player.coins.forEach( coin => {
                if(coin.name === 'WHITE'){
                    nWhite++;
                }else if(coin.name === 'BLACK'){
                    nBlack++;
                }else{
                    throw ("Invalid Coin Name!");
                }
            });

            while(nWhite - 10 >= 0){
                nBlack++;
                nWhite -= 10;
            }
            
            player.coins = Array();
            for(var i = 0; i < nWhite; i++){
                player.drawCoin( new Coin('WHITE', 1));
            }

            for(var i = 0; i < nBlack; i++){
                player.drawCoin( new Coin('BLACK', 10));
            }
            
            if(this.DEBUG){
                console.log();
                console.log(">"+player.name);
                player.printCoinsln();
            }
        });
    }

    print(){
        this.playerList.forEach( player => {
            console.log(">"+player.name+" ("+player.hand.length+")");
        });
    }

    printScoreln(){
        var output = "";
        this.playerList.forEach( player => {
            output += (player.name +" ("+player.getScore()+"); ");
        });
        console.log(output);
    }
}

module.exports = AlpacaGame;