# Alpaca Server

## Start the Server
The Server will be started, when the constructor is called. You can manually set the Players the Server should expect, by default it is 2 Players.
```
var theServer = new AlpacaServer();
theServer.expectedPlayer = 2;
```

You can start the Server by executing: `npm run-script start`

## Routes

### Join the Game
* Route: `/join`
* Method: `POST`
* JSON-Body Parameters:
    + `name` - Playername
    + `callbackUrl` - Url where the Bot can waked up (optional) 
* Response: `{ player_id: "Bto2", player_name: "Sam"}`

When you have set the callbackUrl the Alpaca Server will send an POST request to your bot, to wake him up. The returned player_id is important for authentification to the server. You need to store it!

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

With the Alpace Endpoint you can get the current Game state. In `other_players` you can see the names of the other players, how many cards they have on theyre hand, the score and the coins they have. The `hand`-Attribute shows you your own Handcards. `my_turn` tells you if its your turn to invoke an action. The `score` shows you the value of all your coins. In `coins` all your coins are stored. On `discared_card` you can see the peek of the Discardpile. The `cardpile-cards` give you information how many cards remains, that can be drawed.

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

There are three Actions you can invoke: 
1. "DROP CARD" - You drop a Card from your Hand to the Discardpile
2. "DRAW CARD" - You draw a Card from the Cardpile (card attribute not necessary)
3. "LEAVE ROUND" - You quit this Round and take the Minus Points of your Hand (card attribute not necessary)

## HTTP Error Codes
* 200 - Ok - Request was successful
* 400 - Bad Request - A Parameter is missing or not well formed
* 401 - Unauthorized - The Id is invalid
* 403 - Forbidden - Its not your Turn
* 404 - Not Found - Route is not defined
* 500 - Internal Server Error - General Error
* 503 - Service Unavailable - Alpaca Game is already running. No more Players accepted


If an Error occours, there will be a JSON Response:
```
{
  "error": {
    "code": 401,
    "message": "The player_id is not valid!"
  }
}
```
## Sensible Server
For Developing Purpose you can start an "Sensible" Server. Its a Server Express that is listening on the Port 3030 for every GET oder POST Request. This might help you develop the Callback Handler. 

To execupte run: `npm run-script sensible-server`