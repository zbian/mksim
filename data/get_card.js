var _ = require('underscore')._
var cards = require('./cards')
function get_card(id){
  if (typeof id == 'undefined') return _.chain(undefined);
  return _.chain(cards.data.Cards).find(function(n){return n.CardId == id});
}
module.exports = get_card;
