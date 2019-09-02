# Alpaca Server

## Start the Server
The Server will be started, when the constructor is called. You can manually set the Players the Server should expect, the default is two players.
```
var theServer = new AlpacaServer();
theServer.expectedPlayer = 2;
```

You can start the server by executing: `npm run-script start`

## Routes

### Join the Game
* Route: `/join`
* Method: `POST`
* JSON-Body Parameters:
    + `name` - the player's name
    + `callbackUrl` - url to signal your bot (optional) 
* Response: `{ player_id: "Bto2", player_name: "Sam"}`

When you have set the callbackUrl the Alpaca Server will send a POST request to your bot, to wake him up. The returned player_id is important for authentication to the server. You need to store it!

### Get Game Status
* Route: `/alpaca?id=Bto2`
* Method: `GET`
* Response: 
```
  "other_players": [
    {
      "John": {
        "hand_cards": 3,
        "coins": [
          {
            "name": "BLACK",
            "value": 10
          },
        ],
        "score": 10
      }
    }
  ],
  "hand": [
    {
      "type": 4,
      "name": "FOUR",
      "value": 4
    },
    {
      "type": 1,
      "name": "ONE",
      "value": 1
    }
  ],
  "my_turn": true,
  "score": 12,
  "coins": [
    {
      "name": "BLACK",
      "value": 10
    },
    {
      "name": "WHITE",
      "value": 1
    },
    {
      "name": "WHITE",
      "value": 1
    },
  ],
  "discarded_card": {
    "type": 3,
    "name": "THREE",
    "value": 3
  },
  "cardpile-cards": 24 
```

With the Alpace Endpoint you can get the current game state. In `other_players` you can see the names of the other players, how many cards they have on their hand, their score and the coins they have. The `hand` array contains your cards. `my_turn` tells you if its your turn to invoke an action. The `score` shows you the value of all your coins. In `coins` all your coins are stored. `discared_card` contains the current card on top of the discard pile. The `cardpile-cards` give you information on how many cards remain, that can be drawn.

### Perform an action
* Route: `/alpaca?id=Bto2`
* Method: `POST`
* Parameters: 
```
{
    "action": "DROP CARD"
    "card": "SIX"
}
```
* Response: Same as Get Game Status

There are three actions you can invoke: 
1. "DROP CARD" - You drop a card from your hand to the discard pile
2. "DRAW CARD" - You draw a card from the card pile (card attribute not necessary)
3. "LEAVE ROUND" - You quit this round and take the points remaining in your hand (card attribute not necessary)

## HTTP Error Codes
* 200 - Ok - Request was successful
* 400 - Bad Request - A parameter is missing or malformed
* 401 - Unauthorized - The id is invalid
* 403 - Forbidden - Its not your turn
* 404 - Not Found - Route is not defined
* 500 - Internal Server Error - General error
* 503 - Service Unavailable - Alpaca Game is already running, no more players can join


If an error occours, there will be a JSON Response:
```
{
  "error": {
    "code": 401,
    "message": "The player_id is not valid!"
  }
}
```
