var definedCards = [
    {type: 0, name: 'ALPACA', value: 10},
    {type: 1, name: 'ONE', value: 1},
    {type: 2, name: 'TWO', value: 2},
    {type: 3, name: 'THREE', value: 3},
    {type: 4, name: 'FOUR', value: 4},
    {type: 5, name: 'FIVE', value: 5},
    {type: 6, name: 'SIX', value: 6},    
]


class Card{
    constructor(type){
        this.type = type;
        this.name = Card.GET_NAME(type);
        this.value = Card.GET_VALUE(type);
    }

    print(){
        console.log("Card: "+this.name+" ("+this.type+") Value: "+this.value);
    }
    
    static GET_NAME(type){
        var name = null;
        definedCards.forEach( cardObj => {
            if(cardObj.type === type)name = cardObj.name;
        });
        return name;
    }

    static GET_VALUE(type){
        var value = null;
        definedCards.forEach( cardObj => {
            if(cardObj.type === type)value = cardObj.value;
        });
        return value;
    }

    static GET_TYPE(name){
        var type = null;
        definedCards.forEach( cardObj => {
            if(cardObj.name === name.toUpperCase())type = cardObj.type;
        });
        return type;
    }

    static GET_DEFINED_CARDS(){
        return definedCards;
    }

    static PLAYABLE(handCard, pileCard){
        var playable = false;
        if((handCard.type - 1) === pileCard.type || handCard.type === pileCard.type){
            playable = true;
        }
        if((handCard.type === 0) && (pileCard.type === definedCards[definedCards.length-1].type)){//handCard is Alpaca and there is a 6 on the pile
            playable = true;
        }
        return playable;
    }
}

module.exports = Card;