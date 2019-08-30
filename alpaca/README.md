# Alpaca Game Engine
Code Examples of this Readme File are in the `alpaca-demo.js`. You can run the Demo by enter `npm run-script demo`.

## Game Play:

### 1. Init / Start the Game-Engine
The Constructor required an Array of Playernames. You can the the Debug Mode (default `false`) on `true` if you want to. After hitting the Constructor the Game-Engine Runs and selects randomly one Player to begin:
```
var theAlpacaGame = new AlpacaGame(['johny0', 'mustafa1', 'lukas2']);
theAlpacaGame.DEBUG = true;
```

### 2. Play your Turn
The Current Player who is on turn is stored in the `currentPlayer`-Variable. The Card Object has a static Method to compare wheter a card can be played or not. With the filter Function you can select all Playable Cards:

```
var currentPlayer = theAlpacaGame.currentPlayer;    //SELECT THE CURRENT PLAYER
var playableCard = currentPlayer.hand.filter( card => { // SELECT THE PLAYABLE CARDS
    return Card.PLAYABLE(card, theAlpacaGame.getDiscardpileCard());
});
```

You now can invoke the `playTurn(action, cardName)` method. The Parameter are defined as followed:
* `action` is the Action you want to do. You can set it as a String to: `DROP CARD`, `DRAW CARD`or `LEAVE ROUND`
* `cardName` is the Card you want to Play. Like `ONE`, `TWO`, `THREE`, ..., `SIX`, `ALPACA`. This Options is online required when you Drop a Card.

**Important:** You can only draw a card, when there are Cards left on the Card Pile (`theAlpacaGame.cardpile`)!

```
if(playableCard.length > 0){                //CHECK IF THER ARE PLAYABLE CARDS
    theAlpacaGame.playTurn('DROP CARD', playableCard[0].name);  //PLAY THE FIRST PLAYABLE CARD
}else{
    if(theAlpacaGame.cardpile.length > 0){  //CHECK IF THERE ARE CARDS LEFT TO DRAW
        theAlpacaGame.playTurn('DRAW CARD');        //DRAW CARD
    }else{
        theAlpacaGame.playTurn('LEAVE ROUND');      //LEAVE THE ROUND
    }
}
```

## Data / Classes:
### Card
* Attributes:
    + `type` - Type of the Card to identify. The numeric cards are ints and the alpaca Card has type 0
    + `name` - Name of the Card that it's called (1 => "ONE", 2 => "TWO", 0 => "ALPACA")
    + `value` - The Value is at the numeric cards the card type. The Alpaca Card has value 10
* constructor: `cardType`

Static Methods on Card:
* `GET_NAME(type)`
* `GET_VALUE(type)`
* `GET_TYPE(name)`
* `GET_DEFINED_CARDS()` -> Return an array of above listed attribtues of all Cards
* `PLAYABLE(handCard, pileCard)` - Return true/false if the given in Card can be played on the pileCard

### Coin
* Attributes:
    + `name` - Can be WHITE / BLACK
    + `value` - Can be 1 or 10

### Player
* Attributes:
    + `game` - Assigned Game
    + `name` - Player name
    + `hand` - Array of Handcard Objects
    + `coins` - Array of Coins
    + `leftRound` - Booleand wheter player remains in the Round
* Methods:
    + `drawCard()` - Draw a Card from Pile
    + `dropCard(cardName)` - Drops a card on the Discardpile selected from Cards Name (ONE, TWO, ..., ALPACA)
    + `leaveRound()` - Leaves the Gaming Round
    + `dropCoin()` - Drops a Coin
    * `drawCoin(coin)` - Add the Coin instance to the coins Array
    * `sortCoins()` - Sort the coins Array with Value descending
    * `getScore()` - Calculates the current Score