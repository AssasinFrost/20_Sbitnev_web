document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("myButton").addEventListener("click", function() {
        document.getElementById("myImage").style.visibility = "visible";
        
        setTimeout(function() {
            document.body.innerHTML = "";
            document.body.style.backgroundImage = "url('image/bool-site.png')";
        }, 4000); // 10 секунд
    });
});
