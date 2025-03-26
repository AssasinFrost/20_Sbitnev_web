class WaifusManager {
    constructor() {
        this.container = document.getElementById('waifus-container');
        this.fetchAndRender();
        document.getElementById('generate-btn').addEventListener('click', () => this.fetchAndRender());
    }

    async fetchAndRender() {
        this.container.innerHTML = 'Загрузка...';

        const cardCount = parseInt(document.getElementById('card-count').value) || 5;

        try {
            const promises = [];
            for (let i = 0; i < cardCount; i++) {
                promises.push(fetch('https://api.waifu.pics/sfw/waifu').then(res => res.json())); // Хммм... а причем тут буква n
            }

            const waifusData = await Promise.all(promises);

            this.renderWaifus(waifusData);
        } catch (err) {
            console.error('Ошибка загрузки waifus:', err);
            this.container.innerHTML = `<p style="color: red;">Не удалось загрузить 🥵 </p>`;
        }
    }

    renderWaifus(data) {
        this.container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        data.forEach((waifu, index) => {
            const card = document.createElement('div');
            card.className = 'waifu-card';
            card.innerHTML = `
                <img src="${waifu.url}" alt="Waifu">
                <h3>Waifu #${index + 1}</h3>
                <p>Тема: SFW</p>
                <a class="download-btn" href="${waifu.url}" download target="_blank">
                    Скачать изображение
                </a>
            `;
            fragment.appendChild(card);
        });

        this.container.appendChild(fragment);
    }
    

    setupInteractions() {
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const downloadLink = event.target;
                if (downloadLink.href) {
                    event.preventDefault();
                    this.downloadImage(downloadLink.href, downloadLink.download);
                }
            });
        });
    }

    async downloadImage(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;

            link.click();

            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Ошибка при скачивании изображения:', err);
        }
    }
}

new WaifusManager();
