class DotaHeroesManager {
    constructor() {
        this.favorites = [];
        this.showOnlyFavorites = false;

        this.container = document.getElementById("heroes-container");
        this.toggleBtn = document.getElementById("toggle-favorites");
        this.exportBtn = document.getElementById("export-favorites");
        this.importBtn = document.getElementById("import-favorites-btn");
        this.importInput = document.getElementById("import-favorites");
        this.counter = document.getElementById("favorites-count");

        this.setupControls();
        this.fetchFavorites().then(() => this.fetchAndRender());
    }

    setupControls() {
        this.toggleBtn.addEventListener("click", () => {
            this.showOnlyFavorites = !this.showOnlyFavorites;
            this.fetchAndRender();
        });

        this.exportBtn.addEventListener("click", () => this.exportFavorites());

        this.importBtn.addEventListener("click", () => this.importInput.click());
        this.importInput.addEventListener("change", (e) => this.importFavorites(e));
    }

    async fetchFavorites() {
        const res = await fetch("http://localhost:3000/favorites");
        this.favorites = await res.json();
    }

    async fetchAndRender() {
        this.container.innerHTML = "Загрузка героев...";
        this.counter.textContent = `💛 Избранных: ${this.favorites.length}`;
        this.toggleBtn.textContent = this.showOnlyFavorites ? "Показать всех героев" : "Показать только избранных";

        try {
            const res = await fetch("https://api.opendota.com/api/heroStats");
            const data = await res.json();
            const filtered = this.showOnlyFavorites
                ? data.filter(hero => this.isFavorite(hero.id))
                : data;
            this.renderHeroes(filtered);
        } catch (err) {
            this.container.innerHTML = `<p style="color: red;">Не удалось загрузить героев 😥</p>`;
        }
    }

    renderHeroes(heroes) {
        this.container.innerHTML = "";
        const fragment = document.createDocumentFragment();

        heroes.forEach(hero => {
            const fav = this.favorites.find(f => f.id === hero.id);
            const note = fav?.note || "";

            const card = document.createElement("div");
            card.className = "hero-card";
            card.innerHTML = `
                <div class="character-info">
                    <img src="https://cdn.cloudflare.steamstatic.com${hero.icon}" alt="${hero.localized_name}" class="character-image">
                    <h2>${hero.localized_name}</h2>
                </div>
                <div class="stats-block">
                    <h3>Характеристики</h3>
                    <ul>
                        <li><strong>Сила:</strong> ${hero.base_str}</li>
                        <li><strong>Ловкость:</strong> ${hero.base_agi}</li>
                        <li><strong>Интеллект:</strong> ${hero.base_int}</li>
                        <li><strong>Атака:</strong> ${hero.base_attack_min} - ${hero.base_attack_max}</li>
                        <li><strong>Броня:</strong> ${hero.base_armor}</li>
                        <li><strong>Скорость:</strong> ${hero.move_speed}</li>
                    </ul>
                </div>
                <div class="custom-block">
                    <h3>Заметка</h3>
                    <textarea data-id="${hero.id}" placeholder="Оставьте заметку...">${note}</textarea>
                </div>
                <button class="favorite-btn" data-id="${hero.id}">
                    ${fav ? "🗑 Удалить из избранного" : "⭐ В избранное"}
                </button>
            `;
            fragment.appendChild(card);
        });

        this.container.appendChild(fragment);
        this.setupInteractions();
    }

    setupInteractions() {
        document.querySelectorAll(".favorite-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = parseInt(btn.dataset.id);
                const existing = this.favorites.find(f => f.id === id);

                if (existing) {
                    await fetch(`http://localhost:3000/favorites/${id}`, { method: "DELETE" });
                } else {
                    const note = document.querySelector(`textarea[data-id='${id}']`).value;
                    await fetch("http://localhost:3000/favorites", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, note })
                    });
                }

                await this.fetchFavorites();
                this.fetchAndRender();
            });
        });

        document.querySelectorAll("textarea[data-id]").forEach(area => {
            area.addEventListener("input", async () => {
                const id = parseInt(area.dataset.id);
                const note = area.value;
                const fav = this.favorites.find(f => f.id === id);
            
                if (fav) {
                    await fetch(`http://localhost:3000/favorites/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ note })
                    });
                } else {
                    await fetch("http://localhost:3000/favorites", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, note })
                    });
                    await this.fetchFavorites();
                }
            });
        });
    }

    exportFavorites() {
        const dataStr = JSON.stringify(this.favorites, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "dota_favorites.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    importFavorites(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) throw new Error("Неверный формат");

                await fetch("http://localhost:3000/favorites", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(imported)
                });

                await this.fetchFavorites();
                this.fetchAndRender();
                alert("Импорт завершен");
            } catch (err) {
                alert("Ошибка импорта: " + err.message);
            }
        };

        reader.readAsText(file);
    }

    isFavorite(id) {
        return this.favorites.some(f => f.id === id);
    }
}

new DotaHeroesManager();
