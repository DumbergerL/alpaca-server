const urlParams = new URLSearchParams(window.location.search);
const VISUAL_TOKEN = urlParams.get('visual_token');
var TIMEOUT = 200;

var degreIndex = 0;
var randomDegres = [];
for(var i = 0; i < 1000; i++){
    var param = 4;
    var random = param/2 - (Math.random() * (param));
    randomDegres.push(random);    
}


$("#timeout").change(function(){
    TIMEOUT = $("#timeout").val();
});


var currentGameState = {};

updateGameServer();
function updateGameServer(){
    $.ajax({
        url: '/visual-data?visual_token='+VISUAL_TOKEN,
        method: 'GET',
        data: {}, 
        success: function(data, textStatus, jqXHR){
            
            visualizeGameState(data);
            
            setTimeout(() => {
                updateGameServer();
            }, TIMEOUT);
        },
        error: function(errorJson, status, errorMessage){
            console.log("error!");

            $("#error").html("<b>"+errorMessage+"</b><br>"+JSON.stringify(errorJson));
            $("#error").show();  
        },
    });
}

function visualizeGameState(gameState){

    $("#players").empty();

    var scores = [];

    for(playerId in gameState.players){
        var playerObj = gameState.players[playerId];
        
        //console.log(playerObj);

        var output = '<div class="col"><div class="card" style="'+ (playerObj.left_round ? 'opacity: 0.6;' : '') + (playerObj.my_turn ? 'background-color: green;' : '') +'"><div class="card-header"><b>'+playerObj.name+'</b></div><ul class="list-group list-group-flush">';

        playerObj.hand.sort( (a,b) => {
            return a.value - b.value;
        });

        playerObj.hand.forEach(card => {

            output += '<li class="list-group-item '+getColorClass(card.value)+'">'+ card.name +'</li>';
        });

        output += '</ul></div>';

        $("#players").append(output);

        scores.push({score: playerObj.score, name: playerObj.name});
    }

    scores.sort( (a,b) => {
        return a.score - b.score;
    });

    $("#scores").empty();
    scores.forEach( score => {
        $("#scores").append('<li class="list-group-item d-flex justify-content-between align-items-center">'+score.name+'<span class="badge badge-primary badge-pill">'+score.score+'</span></li>');
    })

    $("#cardpile-cards").text(gameState.cardpile_cards);


    $("#discard-pile ul").empty();
    $("#discard-pile ul").append('<li class="list-group-item '+getColorClass(gameState.discarded_card.value)+'">'+gameState.discarded_card.name+'</li>');
    

    //Karten schief machen...
    var degreIndex=0;
    $(".card li").each(function(element){
        $(this).css('transform', 'rotate('+randomDegres[degreIndex]+'deg)');
        degreIndex++;
    });

}

function getColorClass(value){
    color = '';

    if(value <= 2){
        color = 'list-group-item-dark';
    }else if(value <= 4){
        color = 'list-group-item-success';
    }else if(value <= 6){
        color = 'list-group-item-danger';
    }else{
        color = 'list-group-item-warning';
    }

    return color;
}