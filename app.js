class LinkModel {
    constructor() {
        this.links = JSON.parse(localStorage.getItem('shortlinks')) || [];
    }

    addLink(originalUrl, shortUrl) {
        const newLink = {
            id: Date.now(),
            original: originalUrl,
            short: shortUrl,
            clicks: 0,
            date: new Date().toLocaleDateString('uk-UA')
        };
        this.links.push(newLink);
        this._commit(this.links);
        return newLink;
    }

    deleteLink(id) {
        this.links = this.links.filter(link => link.id !== id);
        this._commit(this.links);
    }

    _commit(links) {
        localStorage.setItem('shortlinks', JSON.stringify(links));
    }
}

class LinkView {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.shortenBtn = document.getElementById('shortenBtn');
        this.resultCard = document.getElementById('resultCard');
        this.shortUrlText = document.getElementById('shortUrlText');
        this.originalUrlText = document.getElementById('originalUrlText');
        this.copyBtn = document.getElementById('copyBtn');

        this.tableBody = document.getElementById('linksTableBody');
    }

    get urlText() {
        return this.urlInput ? this.urlInput.value.trim() : '';
    }

    displayResult(shortUrl, originalUrl) {
        if (!this.resultCard) return;
        this.shortUrlText.textContent = shortUrl;
        this.shortUrlText.href = shortUrl;
        this.originalUrlText.textContent = `Оригінал: ${originalUrl}`;
        this.resultCard.style.display = 'block'; 
    }

    displayLinks(links) {
        if (!this.tableBody) return;
        
        this.tableBody.innerHTML = '';

        if (links.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">У вас ще немає збережених посилань.</td></tr>';
            return;
        }

        links.forEach((link, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="text-truncate" style="max-width: 250px;">
                    <a href="${link.original}" target="_blank" class="text-decoration-none text-muted">${link.original}</a>
                </td>
                <td><a href="${link.short}" target="_blank" class="text-decoration-none fw-bold text-primary">${link.short}</a></td>
                <td><span class="badge bg-success rounded-pill">${link.clicks}</span></td>
                <td>${link.date}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${link.id}" title="Видалити">🗑️</button>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });
    }

    bindShortenLink(handler) {
        if (this.shortenBtn) {
            this.shortenBtn.addEventListener('click', () => {
                if (this.urlText) {
                    handler(this.urlText);
                    this.urlInput.value = ''; 
                } else {
                    alert("Будь ласка, введіть посилання!");
                }
            });
        }
    }

    bindCopyLink() {
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => {
                const text = this.shortUrlText.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.copyBtn.textContent;
                    this.copyBtn.textContent = 'Скопійовано!';
                    setTimeout(() => this.copyBtn.textContent = originalText, 2000);
                });
            });
        }
    }

    bindDeleteLink(handler) {
        if (this.tableBody) {
            this.tableBody.addEventListener('click', event => {
                if (event.target.closest('.delete-btn')) {
                    const id = parseInt(event.target.closest('.delete-btn').dataset.id);
                    handler(id);
                }
            });
        }
    }
}

class LinkController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindShortenLink(this.handleShortenLink.bind(this));
        this.view.bindCopyLink();
        this.view.bindDeleteLink(this.handleDeleteLink.bind(this));

        this.view.displayLinks(this.model.links);
    }

    handleShortenLink(originalUrl) {
        const randomHash = Math.random().toString(36).substring(2, 8);
        const shortUrl = `https://short.ly/${randomHash}`;
        
        this.model.addLink(originalUrl, shortUrl);
        this.view.displayResult(shortUrl, originalUrl);
        this.view.displayLinks(this.model.links);
    }

    handleDeleteLink(id) {
        this.model.deleteLink(id);
        this.view.displayLinks(this.model.links);
    }
}

class AuthModel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    register(name, email, password) {
        if (this.users.find(u => u.email === email)) return false; 
        
        const newUser = { id: Date.now(), name, email, password };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }
}

class AuthView {
    constructor() {
        this.regName = document.getElementById('regName');
        this.regEmail = document.getElementById('regEmail');
        this.regPassword = document.getElementById('regPassword');
        this.regBtn = document.getElementById('regBtn');

        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.loginBtn = document.getElementById('loginBtn');
    }

    bindRegister(handler) {
        if (this.regBtn) {
            this.regBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.regName.value && this.regEmail.value && this.regPassword.value) {
                    handler(this.regName.value, this.regEmail.value, this.regPassword.value);
                } else {
                    alert("Будь ласка, заповніть усі поля!");
                }
            });
        }
    }

    bindLogin(handler) {
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.loginEmail.value && this.loginPassword.value) {
                    handler(this.loginEmail.value, this.loginPassword.value);
                } else {
                    alert("Введіть пошту та пароль!");
                }
            });
        }
    }
}

class AuthController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindRegister(this.handleRegister.bind(this));
        this.view.bindLogin(this.handleLogin.bind(this));
    }

    handleRegister(name, email, password) {
        if (this.model.register(name, email, password)) {
            alert('Реєстрація успішна!');
            window.location.href = 'profile.html';
        } else {
            alert('Користувач з такою поштою вже існує!');
        }
    }

    handleLogin(email, password) {
        if (this.model.login(email, password)) {
            alert('Вхід успішний!');
            window.location.href = 'profile.html';
        } else {
            alert('Невірна пошта або пароль!');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const linkApp = new LinkController(new LinkModel(), new LinkView());
    const authApp = new AuthController(new AuthModel(), new AuthView());
});