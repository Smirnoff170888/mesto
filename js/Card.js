'use strict'
class Card {
    constructor(container, {link, name, _id, likes}, liked, popup, showDelete) {
        this._link = link;
        this._name = name;
        this._id = _id;
        this._popup = popup;
        this._likesCount = likes.length;
        this._liked = liked;
        this._container = container;
                /**
                 * Передавать обработчик хорошая идея
                 * Стоит записывать функцию в поля класса напрямую, вместо передачи
                 * параметров для этого существуют сеттеры, которые делают классы чище
                 * https://learn.javascript.ru/es-class#gettery-settery-i-vychislyaemye-svoystva
                 * 
                 * class Card { 
                 *  constructor(container, {link, name}, popup) {
                 *    this._onRemove = this.onRemove;
                 *  }
                 *  
                 *  set onRemove (fn) {
                 *    this._onRemove = fn
                 *  }
                 * }
                 * 
                 * addCard(data) {
                 *  const card = new Card()
                 * 
                 *  card.onRemove = card => ...
                 * 
                 *  this.cards.push(card)
                 * }
                 * 
                 * https://frontender.info/es6-classes-final/
                 */

        this._cardElem = this.create();
        this._likeCounter = this._cardElem.querySelector('.place-card__like-counter');
        this._likeButton = this._cardElem.querySelector('.place-card__like-icon');
        // this._cardElement = this.create()
        // Поле класса лучше очевидным образом объявлять
        if (showDelete) {
            const delButton = this._cardElem.querySelector('.place-card__delete-icon');
            delButton.addEventListener('click', this.remove.bind(this));
            delButton.style.display = 'block';
        }
        this._cardElem.querySelector('.place-card__like-icon').addEventListener('click', this.like.bind(this));
        this._cardElem.querySelector('.place-card__image').addEventListener('click', this.show.bind(this));
    
        this._likeCounter.textContent = this._likesCount;
        if (this._liked) this._likeButton.classList.toggle('place-card__like-icon_liked');
        this.render();
    }

    set onRemove(cb) {
        this._onRemove = cb;
    }

    set onLike(cb) {
        this._onLike = cb;
    }

    set onRemoveLike(cb) {
        this._onRemoveLike = cb;
    }

    create() {
        const template = `
        <div class="place-card__image" style="background-image: url(${this._link})">
        <button class="place-card__delete-icon"></button></div>
        <div class="place-card__description">
            <h3 class="place-card__name">${this._name}</h3>
            <button class="place-card__like-icon"></button>
            <div class="place-card__like-counter"></div>
        </div>
        </div>`;
        /**
         * Можно улучшить
         * 
         * Каждый метод должен выполянять одно действие. 
         * this._cardElem = this.create() происходит в конструкторе
         * 
         * внутри create достаточно 
         * const card = document.createElement('div');
         * использовать и возвращать
         */
        const cardElem = document.createElement('div'); 
        cardElem.classList = 'place-card';
        cardElem.insertAdjacentHTML('beforeend', template);
        return cardElem;
    }

    render() {
        this._container.appendChild(this._cardElem); // Это логика отдельного метода render()
        // внутри конструктора следующий логический порядок:
        /**
         * this._cardElem = this.create()
         * добавление обработчиков
         * this.render()
         */
    }

    async like() { // ключи которые не используются лучше удалять
        let f = true;
        if (!this._liked && this._onLike) f = await this._onLike(this);
        if (this._liked && this._onRemove) f = await this._onRemoveLike(this);
        if (!f) return;

        this._liked = !this._liked;
        this._liked ? this._likesCount++ : this._likesCount--;
        this._likeButton.classList.toggle('place-card__like-icon_liked');
        this._likeCounter.textContent = this._likesCount;
    }

    async remove() {
        if (confirm('Вы действительно хотите удалить эту карточку?')) {
            let f = true;
            if (this._onRemove) f = await this._onRemove(this);
            if (f) this._container.removeChild(this._cardElem);
        }
    }

    show(event) {
        if (event.target.classList.contains('place-card__image')) {
        this._popup.open(() => // Отлично - используется callback функция
            document.querySelector('.place-card__image-big').style.backgroundImage = `url(${this._link})`);
        }
    }
}