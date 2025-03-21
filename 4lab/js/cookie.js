/**
 * Устанавливает куки с сжатием данных.
 * 
 * @param {string} name - Имя куки.
 * @param {any} value - Данные для сохранения.
 * @param {number} days - Количество дней, на которое куки будут сохранены.
 */
function setCompressedCookie(name, value, days) {
    const compressedValue = LZString.compressToEncodedURIComponent(JSON.stringify(value));
    setCookie(name, compressedValue, days);
}

/**
 * Получает разжатые данные из куки.
 * 
 * @param {string} name - Имя куки.
 * @returns {any} - Разжатое значение куки.
 */
function getDecompressedCookie(name) {
    const compressedValue = getCookie(name);
    return compressedValue ? JSON.parse(LZString.decompressFromEncodedURIComponent(compressedValue)) : null;
}

/**
 * Устанавливает куки.
 * 
 * @param {string} name - Имя куки.
 * @param {string} value - Значение куки.
 * @param {number} days - Количество дней, на которое куки будут сохранены.
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

/**
 * Получает значение куки по имени.
 * 
 * @param {string} name - Имя куки.
 * @returns {string|null} - Значение куки, если она существует, иначе null.
 */
function getCookie(name) {
    const cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

/**
 * Удаляет куки по имени.
 * 
 * @param {string} name - Имя куки.
 */
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

/**
 * Получает все куки в виде объекта (имя-значение).
 * 
 * @returns {Object} - Объект с именами и значениями всех куки.
 */
function getAllCookies() {
    const cookies = document.cookie.split("; ");
    const cookieObject = {};
    cookies.forEach(cookie => {
        const [name, value] = cookie.split("=");
        cookieObject[name] = decodeURIComponent(value);
    });
    return cookieObject;
}

/**
 * Получает отзывы из куки (разжатые).
 * 
 * @returns {Array} - Массив с отзывами.
 */
function getReviewsFromCookies() {
    const reviews = getDecompressedCookie("reviews");
    return reviews ? reviews : [];
}

/**
 * Сохраняет отзывы в куки (с сжатием).
 * 
 * @param {Array} reviews - Массив с отзывами.
 */
function saveReviewsToCookies(reviews) {
    setCompressedCookie("reviews", reviews, 7); // Срок хранения 7 дней
}
