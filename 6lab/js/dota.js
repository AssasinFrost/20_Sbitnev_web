class DotaHeroesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem("dotaFavorites") || "[]");
        this.showOnlyFavorites = false;

        this.container = document.getElementById("heroes-container");
        this.toggleBtn = document.getElementById("toggle-favorites");
        this.exportBtn = document.getElementById("export-favorites");
        this.importBtn = document.getElementById("import-favorites-btn");
        this.importInput = document.getElementById("import-favorites");
        this.counter = document.getElementById("favorites-count");

        this.setupControls();
        this.fetchAndRender();
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

    async fetchAndRender() {
        this.container.innerHTML = "Загрузка героев...";
        this.toggleBtn.textContent = this.showOnlyFavorites ? "Показать всех героев" : "Показать только избранных";
        this.counter.textContent = `💛 Избранных: ${this.favorites.length}`;

        try {
            const res = await fetch("https://api.opendota.com/api/heroStats");
            const data = await res.json();
            this.renderHeroes(this.showOnlyFavorites ? data.filter(h => this.isFavorite(h.id)) : data);
        } catch (err) {
            this.container.innerHTML = `<p style="color: red;">Не удалось загрузить героев 😥</p>`;
            console.error(err);
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
                    <h3>Роли</h3>
                    <p>${hero.roles.join(", ")}</p>
                </div>
                <div class="custom-block">
                    <h3>Winrate</h3>
                    <p>${(hero.pro_win / (hero.pro_pick || 1) * 100).toFixed(1)}%</p>
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
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const note = document.querySelector(`textarea[data-id='${id}']`).value;
                const index = this.favorites.findIndex(f => f.id === id);

                if (index === -1) {
                    this.favorites.push({ id, note });
                } else {
                    this.favorites.splice(index, 1);
                }

                this.saveFavorites();
                this.fetchAndRender();
            });
        });

        document.querySelectorAll("textarea[data-id]").forEach(area => {
            area.addEventListener("input", () => {
                const id = parseInt(area.dataset.id);
                const note = area.value;
                const fav = this.favorites.find(f => f.id === id);

                if (fav) {
                    fav.note = note;
                } else {
                    this.favorites.push({ id, note });
                }

                this.saveFavorites();
            });
        });
    }

    saveFavorites() {
        localStorage.setItem("dotaFavorites", JSON.stringify(this.favorites));
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
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) throw new Error("Некорректный формат файла");

                const merged = [...this.favorites];

                imported.forEach(newFav => {
                    const existing = merged.find(f => f.id === newFav.id);
                    if (!existing) merged.push(newFav);
                    else if (newFav.note && !existing.note) existing.note = newFav.note;
                });

                this.favorites = merged;
                this.saveFavorites();
                this.fetchAndRender();
                alert("Импорт завершён успешно!");
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
