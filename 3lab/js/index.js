document.addEventListener("DOMContentLoaded", function () {
    // Логика для всплывающей рекламы
    function createAdP() {
        const ad = document.createElement("div");
        ad.style.position = "fixed";
        ad.style.width = "200px";
        ad.style.height = "150px";
        ad.style.background = "url('res/advert.png') center center / cover no-repeat";
        ad.style.backgroundSize = "cover";
        ad.style.color = "white";
        ad.style.display = "flex";
        ad.style.justifyContent = "center";
        ad.style.alignItems = "center";
        ad.style.fontSize = "16px";
        ad.style.zIndex = "9999";
        ad.style.border = "2px solid white";
        ad.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        ad.style.cursor = "pointer";
        
        ad.style.top = Math.random() * (window.innerHeight - 150) + "px";
        ad.style.left = Math.random() * (window.innerWidth - 200) + "px";
        
        ad.innerHTML = `
            <a href="https://steamcommunity.com/profiles/76561198992885494/" target="_blank"></a>
            <button style="
                position: absolute;
                top: 5px;
                right: 5px;
            ">X</button>
        `;

        ad.addEventListener("click", function () {
            window.open("https://steamcommunity.com/profiles/76561198992885494/", "_blank");
        });
        ad.querySelector("button").addEventListener("click", function (event) {
            event.stopPropagation();
            ad.remove();
            createAdP();
            createAdP();
        });
        
        document.body.appendChild(ad);
    }
    
    createAdP();

    // Логика для переключения темы
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Функция для установки темы
    function setTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            themeToggle.textContent = "Светлая тема";
        } else {
            body.classList.remove("dark-theme");
            themeToggle.textContent = "Темная тема";
        }
        document.cookie = `theme=${theme}; path=/; max-age=31536000`; // Сохраняем на год
    }

    // Проверка сохраненной темы в cookies
    const savedTheme = document.cookie.split("; ").find(row => row.startsWith("theme="))?.split("=")[1];
    setTheme(savedTheme || "light");

    // Переключение темы по клику
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.classList.contains("dark-theme") ? "dark" : "light";
        setTheme(currentTheme === "light" ? "dark" : "light");
    });

    // Логика для отзывов
    const reviewForm = document.getElementById("review-form");
    const reviewText = document.getElementById("review-text");
    const reviewsList = document.getElementById("reviews-list");

    // Функция для загрузки отзывов из cookies
    function loadReviews() {
        const reviews = document.cookie.split("; ").find(row => row.startsWith("reviews="))?.split("=")[1];
        if (reviews) {
            const reviewArray = JSON.parse(decodeURIComponent(reviews));
            reviewArray.forEach(review => addReviewToList(review));
        }
    }

    // Функция для добавления отзыва в список
    function addReviewToList(review) {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.textContent = review;
        reviewsList.appendChild(reviewItem);
    }

    // Загрузка отзывов при старте
    loadReviews();

    // Обработка отправки формы
    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const review = reviewText.value.trim();
        if (review) {
            addReviewToList(review);

            // Сохранение отзыва в cookies
            const existingReviews = document.cookie.split("; ").find(row => row.startsWith("reviews="))?.split("=")[1];
            const reviewArray = existingReviews ? JSON.parse(decodeURIComponent(existingReviews)) : [];
            reviewArray.push(review);
            document.cookie = `reviews=${encodeURIComponent(JSON.stringify(reviewArray))}; path=/; max-age=31536000`; // Сохраняем на год

            reviewText.value = ""; // Очистка поля ввода
        }
    });
});