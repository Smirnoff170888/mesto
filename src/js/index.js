import Api from './classes/Api.js';
import CardList from './classes/CardList.js';
import Popup from './classes/Popup.js';
import * as Validators from './validators.cfg.js';

const serverUrl = (NODE_ENV === 'development') ? 'http://praktikum.tk/cohort2' : 'https://praktikum.tk/cohort2';
const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');
const userAvatar = document.querySelector('.user-info__photo');

const btnOpenNewPlace = document.querySelector('.user-info__button');
const btnOpenEdit = document.querySelector('.user-info__edit-button');

function renderMe(data) {
  userName.textContent = data.name;
  userJob.textContent = data.about;
  if (data.avatar)
    userAvatar.style.backgroundImage = `url(${data.avatar})`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const api = new Api({
    baseUrl: serverUrl,
    headers: {
      authorization: 'ec6220b5-ab34-43b0-99ca-028d2827c72a',
      'Content-Type': 'application/json'
    }
  });

  if (!await api.loadMe(renderMe)) {
    btnOpenEdit.disabled = true;
    btnOpenNewPlace.disabled = true;
    alert('Ошибка на этапе загрузки пользователя, корректное продоложение работы невозможно');
    return;
  }

  const imgPopup = new Popup(document.querySelector('.popup__img'));
  const profilePopup = new Popup(document.querySelector('.popup__edit'));
  const newPlacePopup = new Popup(document.querySelector('.popup__new-place'));
  const avatarPopup = new Popup(document.querySelector('.popup__avatar'));
  const cardList = new CardList(document.querySelector('.places-list'), imgPopup, api, await api.initialCards());

  Validators.formNewValidator.onSubmit = async (data) => {
    await api.pushCard(data, cardList.addCard.bind(cardList));
    newPlacePopup.close();
  };
  Validators.formAvatarValidator.onSubmit = async (data) => {
    await api.updateAvatar(data, () => userAvatar.style.backgroundImage = `url(${data.avatar})`);
    avatarPopup.close();
  }
  Validators.formEditValidator.onSubmit = async (data) => {
    await api.saveMe({name: data.surname, about: data.job}, renderMe);
    profilePopup.close();
  }

  userAvatar.addEventListener('click', () => {
    Validators.formAvatarValidator.reset();
    avatarPopup.open(Validators.formAvatarValidator.validate());
  });
  btnOpenEdit.addEventListener('click', () => {
    Validators.formEditValidator.synchronize();
    profilePopup.open(Validators.formAvatarValidator.validate);
  });
  btnOpenNewPlace.addEventListener('click', () => newPlacePopup.open(Validators.formNewValidator.validate));
});