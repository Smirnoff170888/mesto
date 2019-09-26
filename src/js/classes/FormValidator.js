export default class FormValidator {
    constructor(form, options) {
        this._form = form;
        this._options = options;
        this._inputHandlers = new Array();
        this._errorsSet = new Set();
        this.validate = () => this._inputHandlers.forEach((f) => f());
        this.reset = () => {
            this._form.reset();
            this._submit.disabled = false;
        }

        this._form.forEach((elem) => {
            if (elem.tagName == 'INPUT' && options[elem.name]) this._initInputHandler(elem);
            if (elem.tagName == 'BUTTON' && elem.type == 'submit') this._submit = elem;
        });
        this._form.addEventListener('submit', this._submitHandler.bind(this));
    }

    set onSubmit(cb) {
        this._onSubmit = cb;
    }

    synchronize() {
        this._form.forEach((elem) => {
            if (this._options[elem.name] && this._options[elem.name].synchronize) {
                let synchElem = document.querySelector(this._options[elem.name].synchronize);
                elem.value = synchElem.textContent;
            }
        });
    }

    _initInputHandler(elem) {
        const f = () => {
            this._inputHandler(elem, this._options[elem.name])
            this._submit.disabled = this._errorsSet.size > 0;
        };
        elem.addEventListener('input', f);
        this._inputHandlers.push(f);
    }

    async _submitHandler(event) {
        event.preventDefault();

        const data = {};
        this._form.forEach((elem) => {
            if (elem.tagName == 'INPUT')
                data[elem.name] = elem.value;
        });
        this._submit.setAttribute('data-origin-text', this._submit.textContent);
        this._submit.textContent = this._options.submit.onSubmitText;
        this._submit.disabled = true;
        await this._onSubmit(data);
        this._submit.disabled = false;
        this._submit.textContent = this._submit.getAttribute('data-origin-text');
        this._form.reset();
    }

    _inputHandler(elem, cfg) {
        const errElem = document.querySelector(cfg.errSelector);
        const minLength = elem.getAttribute('minlength');
        const maxLength = elem.getAttribute('maxlength');
        const pattern = elem.getAttribute('pattern');
        const errHelper = (errText) => {
            errElem.textContent = errText;
            this._errorsSet.add(elem);
            return;
        };

        if (cfg.required && !elem.value.length)
            return errHelper('Это обязательное поле');

        if (minLength && elem.validity.tooShort)
            return errHelper(`Должно быть от ${minLength} до ${maxLength} символов`);

        if (pattern && elem.validity.patternMismatch)
            return errHelper(cfg.errPatternText);

        this._errorsSet.delete(elem);
        errElem.textContent = '';
    }
}