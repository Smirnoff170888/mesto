export default class Popup {
    constructor(container) {
        this._container = container;
        this._container.querySelector('.popup__close').addEventListener('click', this.close.bind(this));
    }

    open(onOpen) {
        if (onOpen) onOpen();
        this._container.classList.add('popup_is-opened');
    }

    close(event) {
        this._container.classList.remove('popup_is-opened');
    }
}