var _ = require('underscore')._
var cards = require('./cards')
function get_card(id){
  return _.find(cards.data.Cards, function(n){return n.CardId == id}).CardName;
}
console.log(
  get_card(40 ),
  get_card(141),
  get_card(68 ),
  get_card(6  ),
  get_card(4  )
);
