import Card from './Card.js';

export default class CardList {
    constructor(container, popup, api, cards) {
      this._container = container;
      this._popup = popup;
      this._api = api;
      this._cards = Array();
      if (cards) this.render(cards);
    }
  
    addCard(data) {
      const meLiked = (data.likes.filter((elem) => elem._id == this._api.myId).length > 0);
      const card = new Card(this._container, data, meLiked, this._popup, (data.owner._id == this._api.myId));

      card.onRemove = async () => {
        if (await this._api.removeCard(data)) {
          this._cards.splice(this._cards.indexOf(card), 1);
          return true;
        }
        return false;
      }
      card.onLike = async () => Boolean(await this._api.pushLike(data));
      card.onRemoveLike = async () => Boolean(await this._api.removeLike(data));
    
      this._cards.push(card);
    }
  
    render(cards) {
      cards.forEach((card) => this.addCard(card, this._popup));
    }
}