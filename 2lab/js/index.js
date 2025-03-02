document.addEventListener("DOMContentLoaded", function () {
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
            <a href="https://steamcommunity.com/profiles/76561198992885494/" target="_blank"></a></a>
            <button style="
                position: absolute;
                top: 5px;
                right: 5px;
            ">X</button>
        `;

        ad.addEventListener("click", function () {
            window.open("https://steamcommunity.com/profiles/76561198992885494/", "_blank");
        });
        ad.querySelector("button").addEventListener("click", function () {
            event.stopPropagation();
            ad.remove();
            createAdP();
            createAdP();
        });
        
        document.body.appendChild(ad);
    }
    
    createAdP();
});
