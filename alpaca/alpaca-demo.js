let AlpacaGame = require('./alpaca');
let Card = require('./lib/card');

var theAlpacaGame = new AlpacaGame(['johny0', 'mustafa1', 'lukas2']);
theAlpacaGame.DEBUG = true;

var numberOfTurn = 20;
var i = 0;

var theInterval = setInterval(() => {
    if(i <= numberOfTurn){
        playGame();
    }else{
        console.log();
        console.log();
        console.log("|---- |\\   | |--\\   /---\\ |---   |--\\  |--- |\\  /| /---\\ ");
        console.log("|____ | \\  | |   |  |   | |___   |   | |___ | \\/ | |   | ");
        console.log("|     |  \\ | |  /   |   | |      |  /  |    |    | |   | ");
        console.log("|____ |   \\| |_/    \\___/ |      |_/   |___ |    | \\___/ ");
        console.log();
        console.log();
        theAlpacaGame._cashUp();
        console.log();
        console.log("Score:");
        theAlpacaGame.printScoreln();
        clearInterval(theInterval);
    }
    i++;
}, 2000);

function playGame(){
    var currentPlayer = theAlpacaGame.currentPlayer;    //SELECT THE CURRENT PLAYER
    var playableCard = currentPlayer.hand.filter( card => { // SELECT THE PLAYABLE CARDS
        return Card.PLAYABLE(card, theAlpacaGame.getDiscardpileCard());
    });

    if(Math.random() > .61){
        theAlpacaGame.playTurn('LEAVE ROUND');      // PLAYER LEAVES THE ROUND
    }else{
        
        if(playableCard.length > 0){                //CHECK IF THER ARE PLAYABLE CARDS
            theAlpacaGame.playTurn('DROP CARD', playableCard[0].name);  //PLAY THE FIRST PLAYABLE CARD
        }else{
            if(theAlpacaGame.cardpile.length > 0){  //CHECK IF THERE ARE CARDS LEFT TO DRAW
                theAlpacaGame.playTurn('DRAW CARD');        //DRAW CARD
            }else{
                theAlpacaGame.playTurn('LEAVE ROUND');      //LEAVE THE ROUND
            }
        }
    }

}
