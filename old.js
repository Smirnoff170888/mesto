const root = document.querySelector('.root');
const placesList = root.querySelector('.places-list');
const template = '<div class="place-card__image" style="background-image: url(%link%)"><button class="place-card__delete-icon"></button></div><div class="place-card__description"><h3 class="place-card__name">%name%</h3><button class="place-card__like-icon"></button></div>';

const form = document.forms.new;
const formEdit = document.forms.edit;
const userName = root.querySelector('.user-info__name');
const userJob = root.querySelector('.user-info__job');
const popupImg = root.querySelector('.popup__img');
const placeCardImg = root.querySelector('.place-card__image-big');
const errorSurname = root.querySelector('.popup__error_surname');
const inputSurname = root.querySelector('.popup__input_type_surname');
const inputJob = root.querySelector('.popup__input_type_job');
const errorJob = root.querySelector('.popup__error_job');
const btnplace = root.querySelector('#btnplace');
const btnprofile = root.querySelector('#btnprofile');
const errorName = root.querySelector('.popup__error_name');
const inputName = root.querySelector('.popup__input_type_name');
const errorLink = root.querySelector('.popup__error_link-url');
const inputLink = root.querySelector('.popup__input_type_link-url');

const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
  },
  {
    name: 'Нургуш',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/khrebet-nurgush.jpg',
  },
  {
    name: 'Тулиновка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg',
  },
  {
    name: 'Остров Желтухина',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/zheltukhin-island.jpg',
  },
  {
    name: 'Владивосток',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/vladivostok.jpg',
  },
];

function addCard(card) {
  let x = template;
  let dummyCheck = true;
  Object.keys(card).forEach(function(k) {
    if (!card[k]) {
      dummyCheck = false;
      return;
    }
    x = x.replace('%' + k + '%', card[k].replace(/[<>]/g, ''));
  });
  if (!dummyCheck) {
    alert('Проверьте правильность ввода данных');
    return;
  }
  const e = document.createElement('div');
  e.className = 'place-card';
  e.innerHTML = x;
  /**
   * Можно улучшить
   * 
   * Сокращение e обычно используют для ключа event
   * для элемента elem выглядит более понятно
   * 
   * Вставка разметки с помощью insertAdjacentHTML
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
   * более безопасна, разметку карточки удобней передавать через шаблонную строку
   * const getCardMarkup = (imgUrl) => `
   *    <div class="place-card">
   *      <div class="place-card__image" style="background-image: url(${imgUrl})"></div>
   *    </div>`
   * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings
   * placesList.insertAdjacentHTML('beforeend', getCardMarkup...
   */
  placesList.appendChild(e);
}


function likeHandler(event) {
  if (event.target.classList.contains('place-card__like-icon')) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }
};

function togglePopup(e) {
  const dataTarget = e.target.dataset.target;
  if (dataTarget) {
    root.querySelector(dataTarget).classList.toggle('popup_is-opened');
  } else {
    e.target.closest('.popup').classList.toggle('popup_is-opened');
  }
}

function userAdd(event) {
  event.preventDefault();
  /**
   * Можно улучшить
   * 
   * Стоит придерживаться единого стиля в коде
   * сокращения события лучше читаются в едином стиле по всему проекту
   */
  const name = form.elements.name;
  const link = form.elements.link;
  /**
   * Запись получения переменных можно сократить
   * const { name, link } = form.elements;
   */
  addCard({name: name.value, link: link.value});

  form.reset();
  togglePopup(event);
}

function cardDeleter(event) {
  if (event.target.classList.contains('place-card__delete-icon')) {
    placesList.removeChild(event.target.parentNode.parentNode);
  }
}

function editProfile(event) {
  event.preventDefault();
  const surname = formEdit.elements.surname;
  const job = formEdit.elements.job;
  // const { surname, job } = formEdit.elements
  userName.textContent = surname.value;
  userJob.textContent = job.value;
  formEdit.reset();
  togglePopup(event);
}

function imgOpener(event) {
  if (event.target.classList.contains('place-card__image')) {
    popupImg.classList.add('popup_is-opened');
    placeCardImg.style.backgroundImage = event.target.style.backgroundImage;
  }
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

document.addEventListener('DOMContentLoaded', function() {
  initialCards.forEach(function(e) {
    addCard(e);
    /**
     * Можно улучшить
     * 
     * Параметр одного элемента массива initialCards может называться initialCard
     * или card - ключ е не дает явного понимания.
     */
  });
});
placesList.addEventListener('click', likeHandler);
form.addEventListener('submit', userAdd);
placesList.addEventListener('click', cardDeleter);
formEdit.addEventListener('submit', editProfile);
root.addEventListener('click', imgOpener);
inputSurname.addEventListener('input', validateFormProfile);
inputJob.addEventListener('input', validateFormProfile);
inputName.addEventListener('input', validateFormPlace);
inputLink.addEventListener('input', validateFormPlace);

document.querySelectorAll('[data-toggle="popup"]').forEach(function(e) {
  e.addEventListener('click', togglePopup);
});

document.querySelectorAll('.popup__close').forEach(function(e) {
  e.addEventListener('click', togglePopup);
});
// Можно улучшить
// Для создания цикла по коллекции элементов удобнее использовать
// оператор for of 
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/for...of

/**
 * Хорошо
 * 
 * Выполнен функционал задания, код организован аккуратно и отлично читается.
 * Обратите внимание на именование ключей события в едином стиле и применение
 * сокращений e только для событий.
 */