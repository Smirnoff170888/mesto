import Api from './classes/Api.js';
import CardList from './classes/CardList.js';
import Popup from './classes/Popup.js';

const serverUrl = (NODE_ENV === 'development') ? 'http://praktikum.tk/cohort2' : 'https://praktikum.tk/cohort2';

const form = document.forms.new;
const formEdit = document.forms.edit;
const formAvatar = document.forms.ava;

const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');
const userAvatar = document.querySelector('.user-info__photo');
const errorSurname = document.querySelector('.popup__error_surname');
const inputSurname = document.querySelector('.popup__input_type_surname');
const inputJob = document.querySelector('.popup__input_type_job');
const errorJob = document.querySelector('.popup__error_job');
const btnplace = document.querySelector('#btnplace');
const btnprofile = document.querySelector('#btnprofile');
const btnavatar = document.querySelector('#btnavatar');
const errorName = document.querySelector('.popup__error_name');
const inputName = document.querySelector('.popup__input_type_name');
const errorLink = document.querySelector('.popup__error_link-url');
const inputLink = document.querySelector('.popup__input_type_link-url');
const errorAvatar = document.querySelector('.popup__error_avatar');
const inputAvatar = document.querySelector('.popup__input_type_avatar');

const btnOpenNewPlace = document.querySelector('.user-info__button');
const btnOpenEdit = document.querySelector('.user-info__edit-button');

function validateFormPlace(event) {
  let f = true;
  errorName.textContent = '';
  errorLink.textContent = '';
  if (inputName.value.length == 0) {
    errorName.textContent = 'Это обязательное поле';
    f = false;
  }
  if (inputLink.value.length == 0) {
    errorLink.textContent = 'Это обязательное поле';
    f = false;
  }

  if (inputName.validity.tooShort) {
    errorName.textContent = 'Должно быть от 2 до 30 символов';
    f = false;
  }

  if (inputLink.validity.patternMismatch) {
    errorLink.textContent = 'Здесь должна быть ссылка';
    f = false;
  }

  btnplace.disabled = !f;
}

function validateFormProfile(event) {
  let f = true;
  errorSurname.textContent = '';
  errorJob.textContent = '';
  if (inputSurname.value.length == 0) {
    errorSurname.textContent = 'Это обязательное поле';
    f = false;
  }

  if (inputJob.value.length == 0) {
    errorJob.textContent = 'Это обязательное поле';
    f = false;
  }

  if (inputSurname.validity.tooShort) {
    errorSurname.textContent = 'Должно быть от 2 до 30 символов';
    f = false;
  }

  if (inputJob.validity.tooShort) {
    errorJob.textContent = 'Должно быть от 2 до 30 символов';
    f = false;
  }

  btnprofile.disabled = !f;
}

function validateFormAvatar(event) {
  let f = true;
  errorAvatar.textContent = '';
  if (inputAvatar.value.length == 0) {
    errorAvatar.textContent = 'Это обязательное поле';
    f = false;
  }

  if (inputAvatar.validity.patternMismatch) {
    errorAvatar.textContent = 'Здесь должна быть ссылка';
    f = false;
  }

  btnavatar.disabled = !f;
}

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

  btnOpenNewPlace.addEventListener('click', (event) => newPlacePopup.open(validateFormPlace));
  btnOpenEdit.addEventListener('click', (event) => {
    inputSurname.value = userName.textContent;
    inputJob.value = userJob.textContent;
    profilePopup.open();
  });
  userAvatar.addEventListener('click', (event) => {
    inputAvatar.value = '';
    avatarPopup.open(validateFormAvatar);
  });
  inputSurname.addEventListener('input', validateFormProfile);
  inputJob.addEventListener('input', validateFormProfile);
  inputName.addEventListener('input', validateFormPlace);
  inputLink.addEventListener('input', validateFormPlace);
  inputAvatar.addEventListener('input', validateFormAvatar);
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { name, link } = form.elements;
    btnplace.disabled = true;
    btnplace.textContent = 'Загрузка...';
    await api.pushCard({name: name.value, link: link.value}, cardList.addCard.bind(cardList));
    btnplace.disabled = false;
    btnplace.textContent = '+';
    newPlacePopup.close();
    form.reset();
  });
  
  formEdit.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { surname, job } = formEdit.elements;
    const profileData = {name: surname.value, about: job.value};

    btnprofile.disabled = true;
    btnprofile.textContent = 'Загрузка...';
    await api.saveMe(profileData, renderMe);
    btnprofile.disabled = false;
    btnprofile.textContent = 'Сохранить';
    formEdit.reset();
    profilePopup.close();
  });

  formAvatar.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newUrl = inputAvatar.value;
    btnavatar.disabled = true;
    btnavatar.textContent = 'Загрузка...';
    await api.updateAvatar({avatar: newUrl}, () => userAvatar.style.backgroundImage = `url(${newUrl})`);
    btnavatar.disabled = false;
    btnavatar.textContent = 'Сохранить';
    formAvatar.reset();
    avatarPopup.close();
  })

  const imgPopup = new Popup(document.querySelector('.popup__img'));
  const profilePopup = new Popup(document.querySelector('.popup__edit'));
  const newPlacePopup = new Popup(document.querySelector('.popup__new-place'));
  const avatarPopup = new Popup(document.querySelector('.popup__avatar'));
  const cardList = new CardList(document.querySelector('.places-list'), imgPopup, api, await api.initialCards());
});