let request = require('request');
let express = require('express');
let slowDown = require("express-slow-down");

let app = express();

let AlpacaGame = require('../alpaca/alpaca');
let JoinedPlayer = require('./lib/JoinedPlayer');




class AlpacaServer{

    constructor(){
        this.alpacaGame;

        this.visualToken = JoinedPlayer.GENERATE_ID();
        
        this.expectedPlayer = 2;
        this.joinedPlayerList = Array();

        app.use(express.static(__dirname+'/www'));
        app.use(express.json());                        
        app.use(express.urlencoded({ extended: true }));

        app.use(this.middleware_authorize.bind(this));

     
        var speedLimiter = slowDown({
            windowMs: 1000, // 15 minutes
            delayAfter: 100, // allow 100 requests per 15 minutes, then...
            delayMs: 100 // begin adding 500ms of delay per request above 100:
            // request # 101 is delayed by  500ms
            // request # 102 is delayed by 1000ms
            // request # 103 is delayed by 1500ms
            // etc.
        });
        app.use(speedLimiter);

        app.get('/', this.getStartpage.bind(this));
        app.get('/visual-data', this.getVisualData.bind(this));
        app.post('/join', this.postJoin.bind(this));
        app.get('/alpaca', this.getGames.bind(this));
        app.post('/alpaca', this.postGames.bind(this));

        app.use(this.middleware_errorhandler);
        
        app.listen(3000, function () {
            console.log('\nAlpaca-Server started and listening to port 3000!');
        });

    }

    initGame(){
        this.alpacaGame = new AlpacaGame(
            this.joinedPlayerList.map( joinedPlayer => {
                return joinedPlayer.id;
            })
        );
        this.alpacaGame.DEBUG = true;
        this.alpacaGame.afterTurnCallback = this.afterTurnTrigger.bind(this);
        this.afterTurnTrigger();
    }

    afterTurnTrigger(){
        this.joinedPlayerList.forEach( joinedPlayer => {
            if(joinedPlayer.id === this.alpacaGame.currentPlayer.name){
                if(joinedPlayer.callbackUrl){
                    request({ uri: joinedPlayer.callbackUrl, method: 'POST', json: {action: 'WAKE UP!'}}, (err, res, body) => {
                        //if(err) throw "error oc";
                    });
                }
            }
        });
    }

    getStartpage(req, res){
        res.send('<script>location.href = "visual.html?visual_token='+this.visualToken+'";</script>');
    }

    postJoin(req, res){
        if (req.body.name === null || req.body.name === "" || !req.body.hasOwnProperty('name')) {
            throw {code: 400, message: "'name' attribute must be set!"};
        }
        
        if(this.alpacaGame)throw {code: 504, message: "Alpaca Game already startet! No other Players can join..."};

        var hash = JoinedPlayer.GENERATE_ID();
        var player = new JoinedPlayer(req.body.name, hash, req.body.callbackUrl)
        this.joinedPlayerList.push(player);
        player.println();
        if(this.joinedPlayerList.length >= this.expectedPlayer)this.initGame();

        res.json({player_id: hash, player_name: req.body.name});
    }

    getVisualData(req, res){
        if(!req.query.visual_token)throw "No Visual Token has been set!";
        if(req.query.visual_token != this.visualToken)throw "Visual Token is invalid!";
        
        if(!this.alpacaGame)throw "The Game has not been started";

        var responseObj = {
            players: {}
        };
        
        this.joinedPlayerList.forEach( joinedPlayer => {
            var playerObj =this.alpacaGame.getPlayerStatus(joinedPlayer.id);
            responseObj.discarded_card = playerObj.discarded_card;
            delete playerObj.discarded_card;
            
            playerObj.name = joinedPlayer.name;

            responseObj.players[joinedPlayer.id] = playerObj;
        });

        responseObj.cardpile_cards = this.alpacaGame.cardpile.length;                
        responseObj.players_left = this.alpacaGame.getNumberLeftPlayers();

        res.send( responseObj );
    }


    getGames(req, res){
        var player_id = req.query.id;
        
        if(!this.alpacaGame)res.send( {} );

        var responseObj = {
            other_players: []
        };
        
        this.joinedPlayerList.forEach( joinedPlayer => {
            if(joinedPlayer.id === player_id){
                Object.assign(responseObj, this.alpacaGame.getPlayerStatus(joinedPlayer.id));
                responseObj['cardpile_cards'] = this.alpacaGame.cardpile.length;                
            }else{
                var statusObject = this.alpacaGame.getPlayerStatus(joinedPlayer.id);
                var anonymObject = {
		    player_name: joinedPlayer.name,
                    hand_cards: statusObject.hand.length,
                    coins: statusObject.coins,
                    score: statusObject.score,
                    left_round: statusObject.left_round,
                };

                responseObj.other_players.push(anonymObject);
            }
        });

        responseObj.players_left = this.alpacaGame.getNumberLeftPlayers();

        res.send( responseObj );
    }

    postGames(req, res){
        if (req.query.id != this.alpacaGame.currentPlayer.name) {
            throw {code: 403, message: "It's not your turn!"};  //forbidden, spieler ist nicht am zug zum zeitpunkt der post anfrage
        }

        if(!req.body.hasOwnProperty('action'))throw {code: 400, message: "'action' Attribute ist not set!"};
        if(req.body.action.toUpperCase() == 'DROP CARD' && !req.body.card)throw {code: 400, message: "'card' Attribute must be set, if you want to Drop a Card!"};

        this.alpacaGame.playTurn(req.body.action, req.body.card);

        this.getGames(req, res);
    }

    middleware_authorize(req, res, next){
        if (req.query.hasOwnProperty('id')) {
            var player_id = req.query.id;
            var valid = false;

            this.joinedPlayerList.forEach( joinedPlayer => {
                if(joinedPlayer.id === player_id)valid = true;
            });
            
            if (!valid) {
                throw {code: 401, message: "The player_id is not valid!"};
            }
        }
        next();
    }

    middleware_errorhandler(err, req, res, next){
        var status_code = 500;
        var status_message = err;

        if(err.hasOwnProperty('code') && err.hasOwnProperty('message')){ //well formed throwed exception
            status_code = err.code;
            status_message = err.message;
        }
        
        res.status(status_code);
        res.json({error: err, stack: err.stack});
    }
}

module.exports = AlpacaServer;
