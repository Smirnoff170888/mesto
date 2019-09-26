export default class Api {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    get myId() {
        return this._owner._id;
    }

    async _query(path, method, data) {
        const url = `${this._baseUrl}/${path}`;
        const options = {
            method: method,
            headers: this._headers,
            body: JSON.stringify(data)
        }

        try {
            let response = await fetch(url, options);
            if (!response.ok) {
                console.log(`AJAX error, url: ${url}, status: ${response.status}`, response);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.log(`AJAX general error, url: ${url}`, error);
            return null;
        }
    }

    async initialCards(cb) {
        let rdata = await this._query('cards', 'GET');
        if (cb && rdata) cb(tdata);
        return rdata;
    }

    async loadMe(cb) {
        let rdata = await this._query('users/me', 'GET');
        if (cb && rdata) cb(rdata);
        this._owner = rdata;
        return rdata;
    }

    async saveMe(data, cb) {
        let rdata = await this._query('users/me', 'PATCH', data);
        if (cb && rdata) cb(rdata);
        return rdata;
    }
    async pushCard(data, cb) {
        let rdata = await this._query('cards', 'POST', data);
        if (cb && rdata) cb(rdata);
        return rdata;
    }

    async removeCard(data, cb) {
        let rdata = await this._query(`cards/${data._id}`, 'DELETE');
        if (cb && rdata) cb(rdata);
        return rdata;
    }

    async pushLike(data, cb) {
        let rdata = await this._query(`cards/like/${data._id}`, 'PUT');
        if (cb && rdata) cb(rdata);
        return rdata;
    }

    async removeLike(data, cb) {
        let rdata = await this._query(`cards/like/${data._id}`, 'DELETE');
        if (cb && rdata) cb(rdata);
        return rdata;
    }

    async updateAvatar(data, cb) {
        let rdata = await this._query('users/me/avatar', 'PATCH', data);
        if (cb && rdata) cb(rdata);
        return rdata;
    }
}