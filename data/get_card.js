var _ = require('underscore')._
var cards = require('./cards')
function get_card(id){
  if (typeof id == 'undefined') return "-";
  var card = _.find(cards.data.Cards, function(n){return n.CardId == id});
  return card ? card.CardName : '-';
}
module.exports = get_card;
