document.addEventListener("DOMContentLoaded", function () {

    // Функция для создания рекламы
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
            <button style="position: absolute; top: 5px; right: 5px;">X</button>
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

    // Переключение темы
    function toggleTheme() {
        const themeToggleButton = document.createElement("button");
        themeToggleButton.id = "theme-toggle";

        const isDarkMode = localStorage.getItem("theme") === "dark";

        if (isDarkMode) {
            document.body.classList.add("dark_theme");
            themeToggleButton.textContent = "Светлая тема";
        } else {
            document.body.classList.remove("dark_theme");
            themeToggleButton.textContent = "Темная тема";
        }

        themeToggleButton.style.position = "fixed";
        themeToggleButton.style.top = "20px";
        themeToggleButton.style.right = "20px";
        themeToggleButton.style.padding = "12px 24px";
        themeToggleButton.style.fontSize = "16px";
        themeToggleButton.style.fontFamily = "Ubuntu, sans-serif";
        themeToggleButton.style.fontWeight = "700";
        themeToggleButton.style.color = "white";
        themeToggleButton.style.background = "#333";
        themeToggleButton.style.border = "none";
        themeToggleButton.style.borderRadius = "8px";
        themeToggleButton.style.cursor = "pointer";
        themeToggleButton.style.zIndex = "10000";
        themeToggleButton.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
        themeToggleButton.style.transition = "background 0.3s, color 0.3s, transform 0.2s";

        themeToggleButton.onmouseover = () => {
            themeToggleButton.style.background = "#555";
            themeToggleButton.style.transform = "scale(1.05)";
        };

        themeToggleButton.onmouseout = () => {
            themeToggleButton.style.background = "#333";
            themeToggleButton.style.transform = "scale(1)";
        };

        document.body.appendChild(themeToggleButton);

        themeToggleButton.addEventListener("click", () => {
            if (document.body.classList.contains("dark_theme")) {
                document.body.classList.remove("dark_theme");
                localStorage.setItem("theme", "light");
                themeToggleButton.textContent = "Темная тема";
            } else {
                document.body.classList.add("dark_theme");
                localStorage.setItem("theme", "dark");
                themeToggleButton.textContent = "Светлая тема";
            }
        });
    }

    toggleTheme();

    function handleReviews() {
        const reviewForm = document.getElementById("review-form");
        const filterRating = document.getElementById("filter-rating");
        const sortRating = document.getElementById("sort-rating");

        function loadReviews() {
            let reviews = getReviewsFromCookies();
            if (!reviews || reviews.length === 0) {
                const defaultReviews = [
                    { name: "Васецкий Алексей Питонович", text: "Неплохая работа, НО! Я бы добавил паршл класс внутри паршл класса внутри паршл класса внутри паршл класса внутри паршл класса внутри паршл класса, поэтому ставлю вам 4/5. Но седня я выиграл катку в танках, поэтому доп балл", rating: 4, image: null, avatar: "res/vaseckiy.jpg" },
                    { name: "AxenvioЛюбительВеба22813371488", text: "Лучше получить голова-глаза, чем учить веб", rating: 5, image: null, avatar: "res/axenvio.png" },
                    { name: "BlesstazinDota2", text: "****** Шейкер сынище *****, как же он ****** ****. Только залетаю в файт как эта ***** прыгает мне на лицо и ****** ультимейт. Да я его мать **** **** *****", rating: 1, image: null, avatar: "res/kirill.png" },
                    { name: "EatherShaker", text: "Да да я. ??????????????????????????", rating: 5, image: null, avatar: "res/shaker_cool.png" },
                    { name: "Андрей Женса", text: "Да, вижу, работали... работали.... Нуссс, думаю вам 99 баллов пойдет, несите зачетку", rating: 5, image: null, avatar: "res/jensa.jpg" },
                    { name: "Мухар Аллах Ибн Фасат Чокра Абдулиль Асахад Чочнок", text: "كل من ترجم هذا النص ملزم بإعطاء إيفجيني 2 نقاط إضافية ، وإلا سيكون هناك انفجار لشاه شابوكلياك.", rating: 5, image: null, avatar: "res/shapaklak.jpg" },
                ];
                saveReviewsToCookies(defaultReviews);
                reviews = defaultReviews;
            }
            displayReviews(reviews);
        }

        function displayReviews(reviews) {
            const reviewsContainer = document.getElementById("reviews-list");
            reviewsContainer.innerHTML = '';
            reviews.forEach(review => {
                const reviewItem = document.createElement("div");
                reviewItem.classList.add("review-item");

                const image = review.image ? `<img src="${review.image}" alt="Review Image">` : "";
                const avatar = review.avatar ? `<img class="avatar" src="${review.avatar}" alt="Avatar">` : "";
                reviewItem.innerHTML = `
                    ${avatar}
                    <h3>${review.name}</h3>
                    <p>${review.text}</p>
                    <p>Оценка: ${review.rating}</p>
                    ${image}
                `;
                reviewsContainer.appendChild(reviewItem);
            });
        }

        reviewForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const text = document.getElementById("text").value;
            const rating = Number(document.getElementById("rating").value);
            const image = document.getElementById("image").files[0] ? URL.createObjectURL(document.getElementById("image").files[0]) : null;
            const avatar = document.getElementById("avatar").files[0] ? URL.createObjectURL(document.getElementById("avatar").files[0]) : null;

            if (!name || !text || isNaN(rating)) {
                alert("Пожалуйста, заполните все поля.");
                return;
            }

            const newReview = { name, text, rating, image, avatar };

            let reviews = getReviewsFromCookies();
            reviews.push(newReview);

            saveReviewsToCookies(reviews);
            displayReviews(reviews);

            reviewForm.reset();
        });

        filterRating.addEventListener("change", function () {
            let reviews = getReviewsFromCookies();
            const selectedRating = filterRating.value;

            if (selectedRating !== "all") {
                reviews = reviews.filter(review => review.rating == selectedRating);
            }

            displayReviews(reviews);
        });

        sortRating.addEventListener("change", function () {
            let reviews = getReviewsFromCookies();
            const sortOrder = sortRating.value;

            reviews.sort((a, b) => {
                return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
            });

            displayReviews(reviews);
        });

        loadReviews();
    }

    handleReviews();
});
