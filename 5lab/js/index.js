let isEditing = false;
let shopItems = [];
let heroes = [];

class Block {
    constructor(id) {
        this.id = id;
    }

    render() {
        return "";
    }

    enableEditing() {}
}

class HeroCard extends Block {
    constructor(id, name, imageUrl, stats, inventory = [], blocks = []) {
        super(id);
        this.name = name;
        this.imageUrl = imageUrl;
        this.stats = stats;
        this.inventory = inventory.length ? inventory : Array(6).fill(null);
        this.blocks = blocks;
    }

    render() {
        return `
            <div class="hero-card" id="${this.id}">
                ${isEditing ? `<button class="delete-hero" data-id="${this.id}">🗑</button>` : ""}

                <div class="character-info">
                    <label for="upload-${this.id}" class="image-label">
                        <img src="${this.imageUrl}" alt="${this.name}" class="character-image" id="img-${this.id}">
                        ${isEditing ? `<input type="file" id="upload-${this.id}" class="image-upload" data-id="${this.id}" accept="image/*">` : ""}
                    </label>
                    ${isEditing 
                        ? `<input type="text" class="hero-name-input" data-id="${this.id}" value="${this.name}">`
                        : `<h2>${this.name}</h2>`}
                </div>

                <div class="stats-block">
                    <h3>Характеристики</h3>
                    <ul>
                        ${Object.entries(this.stats).map(([key, value]) => 
                            `<li><strong>${key}:</strong> 
                                ${isEditing 
                                    ? `<input type="number" class="stat-input" data-id="${this.id}" data-key="${key}" value="${value}">`
                                    : value}
                            </li>`).join('')}
                    </ul>
                </div>

                <div class="inventory-block">
                    <h3>Инвентарь</h3>
                    <div class="inventory-grid">
                        ${Array.from({ length: 6 }).map((_, i) =>
                            `<div class="inventory-slot" data-slot="${i}" ondrop="dropItem(event, '${this.id}', ${i})" ondragover="allowDrop(event)">
                                ${this.inventory[i] ? `<img src="${this.inventory[i].image}" class="inventory-item" draggable="true" ondragstart="dragItem(event, '${this.id}', ${i})" title="${this.inventory[i].name}: ${this.inventory[i].description}">` : ""}
                            </div>`).join('')}
                    </div>
                </div>

                ${this.blocks.map(block => block.render()).join('')}
                ${isEditing ? `<button class="add-block" data-id="${this.id}">+ Добавить блок</button>` : ""}
            </div>
        `;
    }

    enableEditing() {
        const input = document.querySelector(`.hero-name-input[data-id="${this.id}"]`);
        if (input) this.name = input.value;

        document.querySelectorAll(`.stat-input[data-id="${this.id}"]`).forEach(input => {
            const key = input.dataset.key;
            this.stats[key] = Number(input.value);
        });

        this.blocks.forEach(block => block.enableEditing());
    }
}

class CustomBlock extends Block {
    constructor(id, title, content) {
        super(id);
        this.title = title;
        this.content = content;
    }

    render() {
        return `
            <div class="custom-block" id="${this.id}">
                ${isEditing ? `<button class="delete-block" data-id="${this.id}">🗑</button>` : ""}
                <h3>${isEditing ? `<input type="text" class="block-title-input" data-id="${this.id}" value="${this.title}">` : this.title}</h3>
                <p>${isEditing ? `<textarea class="block-content-input" data-id="${this.id}">${this.content}</textarea>` : this.content}</p>
            </div>
        `;
    }

    enableEditing() {
        const titleInput = document.querySelector(`.block-title-input[data-id="${this.id}"]`);
        const contentInput = document.querySelector(`.block-content-input[data-id="${this.id}"]`);
        if (titleInput) this.title = titleInput.value;
        if (contentInput) this.content = contentInput.value;
    }
}

function renderShop() {
    const shopContainer = document.getElementById("shop-items");
    if (!shopContainer) return;

    const formHTML = isEditing ? `
        <div class="shop-form">
            <input type="text" id="item-name" placeholder="Название предмета">
            <input type="text" id="item-description" placeholder="Описание">
            <input type="file" id="item-image" accept="image/*">
            <img id="preview-image" style="max-width: 100px; display: none; margin-top: 5px;">
            <button id="create-item">Добавить</button>
        </div>
    ` : "";

    const itemsHTML = shopItems.map((item, index) => `
        <div class="shop-item-container">
            ${isEditing ? `<button class="delete-shop-item" data-index="${index}">🗑</button>` : ""}
            <img src="${item.image}" class="shop-item" draggable="true" ondragstart="dragNewItem(event, ${index})">
            <p>${item.name}</p>
            <small>${item.description}</small>
        </div>
    `).join('');

    const sellAreaHTML = `
        <div class="shop-sell-area" ondrop="sellItem(event)" ondragover="allowDrop(event)">
            <p>${isEditing ? "Перетащите предмет сюда, чтобы продать" : "Перетащите предмет сюда, чтобы продать"}</p>
        </div>
    `;

    shopContainer.innerHTML = formHTML + itemsHTML + sellAreaHTML;

    if (isEditing) {
        const fileInput = document.getElementById("item-image");
        const previewImage = document.getElementById("preview-image");

        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) {
                alert("Выбранный файл не является изображением!");
                fileInput.value = "";
                previewImage.style.display = "none";
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        });

        document.getElementById("create-item").addEventListener("click", () => {
            const name = document.getElementById("item-name").value.trim();
            const description = document.getElementById("item-description").value.trim();
            const image = previewImage.src;

            if (!name || !description || !image) {
                alert("Пожалуйста, заполните все поля.");
                return;
            }

            shopItems.push({ name, description, image });
            saveShopToLocalStorage();
            renderShop();
        });

        document.querySelectorAll(".delete-shop-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                shopItems.splice(index, 1);
                saveShopToLocalStorage();
                renderShop();
            });
        });
    }
}

function renderHeroes() {
    document.body.innerHTML = `
        <div class="controls">
            <button id="edit-toggle">${isEditing ? "Сохранить" : "Редактировать"}</button>
            <button id="add-hero">Добавить героя</button>
        </div>
        <div class="shop">
            <h3>Магазин</h3>
            <div class="shop-items" id="shop-items"></div>
        </div>
        <div id="heroes-container">
            ${heroes.map(hero => hero.render()).join('')}
        </div>
    `;

    document.getElementById("edit-toggle").addEventListener("click", toggleEditMode);
    document.getElementById("add-hero").addEventListener("click", addHero);

    document.querySelectorAll(".delete-hero").forEach(btn => {
        btn.addEventListener("click", e => deleteHero(e.target.dataset.id));
    });

    document.querySelectorAll(".add-block").forEach(btn => {
        btn.addEventListener("click", e => addBlock(e.target.dataset.id));
    });

    document.querySelectorAll(".delete-block").forEach(btn => {
        btn.addEventListener("click", e => deleteBlock(e.target.dataset.id));
    });

    document.querySelectorAll(".image-upload").forEach(input => {
        input.addEventListener("change", (event) => changeHeroImage(event.target.dataset.id, event.target.files[0]));
    });

    renderShop();
}

function allowDrop(event) {
    event.preventDefault();
}

function dragItem(event, heroId, slotIndex) {
    event.dataTransfer.setData("heroId", heroId);
    event.dataTransfer.setData("slotIndex", slotIndex);
}

function dragNewItem(event, itemIndex) {
    event.dataTransfer.setData("newItem", JSON.stringify(shopItems[itemIndex]));
}

function dropItem(event, heroId, slotIndex) {
    event.preventDefault();

    const newItemData = event.dataTransfer.getData("newItem");
    if (newItemData) {
        const newItem = JSON.parse(newItemData);
        const targetHero = heroes.find(h => h.id === heroId);
        if (targetHero) {
            targetHero.inventory[slotIndex] = newItem;
            saveToLocalStorage();
            renderHeroes();
        }
        return;
    }

    const sourceHeroId = event.dataTransfer.getData("heroId");
    const sourceSlotIndex = event.dataTransfer.getData("slotIndex");

    const sourceHero = heroes.find(h => h.id === sourceHeroId);
    const targetHero = heroes.find(h => h.id === heroId);

    if (sourceHero && targetHero) {
        const item = sourceHero.inventory[sourceSlotIndex];
        if (item) {
            sourceHero.inventory[sourceSlotIndex] = null;
            targetHero.inventory[slotIndex] = item;
            saveToLocalStorage();
            renderHeroes();
        }
    }
}

function sellItem(event) {
    event.preventDefault();
    const heroId = event.dataTransfer.getData("heroId");
    const slotIndex = parseInt(event.dataTransfer.getData("slotIndex"));

    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;

    const item = hero.inventory[slotIndex];
    if (!item) return;

    const indexInShop = shopItems.findIndex(shopItem =>
        shopItem.name === item.name &&
        shopItem.description === item.description &&
        shopItem.image === item.image
    );

    if (indexInShop === -1) {
        shopItems.push(item);
    }

    hero.inventory[slotIndex] = null;

    saveToLocalStorage();
    renderHeroes();
}

function changeHeroImage(heroId, file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Выбранный файл не является изображением!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const hero = heroes.find(h => h.id === heroId);
        if (hero) {
            hero.imageUrl = event.target.result;
            document.getElementById(`img-${heroId}`).src = event.target.result;
            saveToLocalStorage();
        }
    };
    reader.readAsDataURL(file);
}

function toggleEditMode() {
    if (isEditing) {
        heroes.forEach(hero => hero.enableEditing());
        saveToLocalStorage();
    }
    isEditing = !isEditing;
    renderHeroes();
}

function addHero() {
    const newId = `hero-${Date.now()}`;
    const defaultStats = { Сила: 10, Ловкость: 10, Интеллект: 10, Урон: "10 - 10", Броня: 2, Скорость: 300 };

    heroes.push(new HeroCard(newId, "Новый персонаж", "../res/base.png", defaultStats));
    saveToLocalStorage();
    renderHeroes();
}

function addBlock(heroId) {
    const hero = heroes.find(h => h.id === heroId);
    if (hero) {
        const newBlockId = `block-${Date.now()}`;
        hero.blocks.push(new CustomBlock(newBlockId, "Новый блок", "Введите текст..."));
        saveToLocalStorage();
        renderHeroes();
    }
}

function deleteHero(id) {
    heroes = heroes.filter(hero => hero.id !== id);
    saveToLocalStorage();
    renderHeroes();
}

function deleteBlock(id) {
    heroes.forEach(hero => {
        hero.blocks = hero.blocks.filter(block => block.id !== id);
    });
    saveToLocalStorage();
    renderHeroes();
}

function saveToLocalStorage() {
    const data = heroes.map(hero => ({
        id: hero.id,
        name: hero.name,
        imageUrl: hero.imageUrl,
        stats: hero.stats,
        inventory: hero.inventory,
        blocks: hero.blocks.map(block => ({
            id: block.id,
            title: block.title,
            content: block.content
        }))
    }));
    localStorage.setItem("heroesData", JSON.stringify(data));
    saveShopToLocalStorage();
}

function saveShopToLocalStorage() {
    localStorage.setItem("shopItems", JSON.stringify(shopItems));
}

function loadShopFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("shopItems"));
    if (data) shopItems = data;
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("heroesData"));

    if (data && data.length > 0) {
        heroes = data.map(heroData => new HeroCard(
            heroData.id,
            heroData.name,
            heroData.imageUrl,
            heroData.stats,
            heroData.inventory || Array(6).fill(null),
            heroData.blocks.map(b => new CustomBlock(b.id, b.title, b.content))
        ));
    } else {
        const dlanvasItem = {
            name: "Длань Васецкого",
            description: "Карает неугодных студентов в радиусе 5 метров. Снижает получаемые баллы на 15%",
            image: "./res/dlan.png"
        };
        const coffeItem = {
            name: "Бодрящий кофе",
            description: "Повышает бодрость на 100%, помогает быстрее проснуться.",
            image: "./res/coffe.png"
        };
        shopItems.push(dlanvasItem);
        shopItems.push(coffeItem);
        saveShopToLocalStorage();

        const vasecHero = new HeroCard(
            "hero-1",
            "Васецкий",
            "./res/Vasetski.jpg", 
            { Сила: 1, Ловкость: 1, Интеллект: 100, Урон: "100 - 118", Броня: "не пробиваемый", Скорость: 5 },
            [dlanvasItem, null, null, null, null, null],
            [
                new CustomBlock("block-1", "Описание", "Обожает partial class, особо опасен, может снизить до x2 баллов за удар."),
                new CustomBlock("block-2", "Как контрить?", "Никак, лучше смиритесь.")
            ]
        );
        const nikHero = new HeroCard(
            "hero-2",
            "Никита",
            "./res/nik.jpg", 
            { Сила: 27, Ловкость: 25, Интеллект: 120, Урон: "120 - 128", Броня: 30, Скорость: 50 },
            [null, null, null, null, null, null],
            [
                new CustomBlock("block-3", "Описание", "Очень любит ВЕБ. Ненавидит питонистов. Обладает уникальным навыком - 'Найти ошибку в коде' Имеет 49% шанс запустить событие 'проспать пару'."),
                new CustomBlock("block-4", "Подсказка", "На событие 'проспать пару' можно повлиять одним из предметов магазина.")
            ]
        );
        heroes.push(vasecHero);
        heroes.push(nikHero);
        saveToLocalStorage(); 
    }

    loadShopFromLocalStorage();
    renderHeroes();
}

loadFromLocalStorage();