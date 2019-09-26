import FormValidator from './classes/FormValidator.js';

const form = document.forms.new;
const formEdit = document.forms.edit;
const formAvatar = document.forms.ava;

export const formNewValidator = new FormValidator(form, {
    name: {
      required: true,
      errSelector: '.popup__error_name'
    },
    link: {
      required: true,
      errSelector: '.popup__error_link-url',
      errPatternText: 'Здесь должна быть ссылка'
    },
    submit: {
      onSubmitText: 'Загрузка...'
    }
});

export const formEditValidator = new FormValidator(formEdit, {
    surname: {
      required: true,
      errSelector: '.popup__error_surname',
      synchronize: '.user-info__name'
    },
    job: {
      required: true,
      errSelector: '.popup__error_job',
      synchronize: '.user-info__job'
    },
    submit: {
      onSubmitText: 'Сохранение'
    }
});

export const formAvatarValidator = new FormValidator(formAvatar, {
    avatar: {
      required: true,
      errSelector: '.popup__error_avatar',
      errPatternText: 'Здесь должна быть ссылка'
    },
    submit: {
      onSubmitText: 'Загрузка...'
    }
});