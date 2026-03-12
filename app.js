// ==========================================
// MODEL (Модель)
// ==========================================
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

    // Видалення посилання за ID
    deleteLink(id) {
        this.links = this.links.filter(link => link.id !== id);
        this._commit(this.links);
    }

    _commit(links) {
        localStorage.setItem('shortlinks', JSON.stringify(links));
    }
}

// ==========================================
// VIEW (Представлення)
// ==========================================
class LinkView {
    constructor() {
        // Елементи сторінки index.html
        this.urlInput = document.getElementById('urlInput');
        this.shortenBtn = document.getElementById('shortenBtn');
        this.resultCard = document.getElementById('resultCard');
        this.shortUrlText = document.getElementById('shortUrlText');
        this.originalUrlText = document.getElementById('originalUrlText');
        this.copyBtn = document.getElementById('copyBtn');

        // Елементи сторінки profile.html
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

    // Відмалювати таблицю на сторінці профілю
    displayLinks(links) {
        if (!this.tableBody) return; // Якщо ми не на сторінці профілю, ігноруємо
        
        this.tableBody.innerHTML = ''; // Очищаємо таблицю

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

    // Подія на клік кнопки "Видалити" в таблиці
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

// ==========================================
// CONTROLLER (Контролер)
// ==========================================
class LinkController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Біндимо події
        this.view.bindShortenLink(this.handleShortenLink.bind(this));
        this.view.bindCopyLink();
        this.view.bindDeleteLink(this.handleDeleteLink.bind(this));

        // Одразу відмальовуємо таблицю (якщо ми на profile.html)
        this.view.displayLinks(this.model.links);
    }

    handleShortenLink(originalUrl) {
        const randomHash = Math.random().toString(36).substring(2, 8);
        const shortUrl = `https://short.ly/${randomHash}`;
        
        this.model.addLink(originalUrl, shortUrl);
        this.view.displayResult(shortUrl, originalUrl);
        this.view.displayLinks(this.model.links); // Оновлюємо таблицю, якщо вона на екрані
    }

    handleDeleteLink(id) {
        this.model.deleteLink(id);
        this.view.displayLinks(this.model.links); // Перемальовуємо таблицю
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    const app = new LinkController(new LinkModel(), new LinkView());
});