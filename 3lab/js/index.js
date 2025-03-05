let balans = 100;

function getRandoSymb() {
    const SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '🍉', '7️⃣'];
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updBalansDisp() {
    let balansDisp = document.getElementById("balansDisp");
    if (!balansDisp) {
        balansDisp = document.createElement("div");
        balansDisp.id = "balansDisp";
        balansDisp.style.fontSize = "20px";
        balansDisp.style.marginTop = "10px";
        balansDisp.style.fontWeight = "bold";
        balansDisp.style.color = "#008000";
        balansDisp.style.textAlign = "center";
        
        const headr = document.querySelector("header");
        if (headr) {
            headr.insertAdjacentElement("afterend", balansDisp);
        } else {
            document.body.insertBefore(balansDisp, document.body.firstChild);
        }
    }
    balansDisp.textContent = `💰 Баланс: ${balans} монет`;
}

function dodep() {
    let sumka = prompt("Введите сумму для пополнения (число):");
    if (!sumka) {
        alert("Вы отменили пополнение!");
        return;
    }
    
    sumka = parseInt(sumka);
    if (isNaN(sumka) || sumka <= 0) {
        alert("Введите корректное положительное число!");
        return;
    }
    
    balans += sumka;
    updBalansDisp();
    alert(`Баланс успешно пополнен на ${sumka} монет!`);
}

function kazinych() {
    if (balans <= 0) {
        if (confirm("Ваш баланс равен 0. Хотите пополнить счет?")) {
            dodep();
        }
        return;
    }
    
    if (!confirm("Занести котлету в казиныч?")) {
        return;
    }
    
    let stavka = prompt("Введите вашу ставку (число):", "10");
    if (!stavka) {
        alert("Вы отменили ставку!");
        return;
    }
    
    stavka = parseInt(stavka);
    if (isNaN(stavka) || stavka <= 0) {
        alert("Некорректная ставка! Введите положительное число.");
        return;
    }
    
    if (stavka > balans) {
        alert("Недостаточно средств! Пополните баланс.");
        return;
    }
    
    balans -= stavka;
    
    let slotik1 = getRandoSymb();
    let slotik2 = getRandoSymb();
    let slotik3 = getRandoSymb();
    
    alert(`Результат: ${slotik1} | ${slotik2} | ${slotik3}`);
    
    if (slotik1 === slotik2 && slotik2 === slotik3) {
        let vin = stavka * 10;
        balans += vin;
        alert(`Поздравляем! Вы выиграли ${vin} монет!`);
    } else {
        alert("Ай яй яй, какая жалость, повезет в другой раз!");
    }
    
    updBalansDisp();
}

document.addEventListener("DOMContentLoaded", function() {
    updBalansDisp();
    
    const btnBox = document.createElement("div");
    btnBox.style.textAlign = "center";
    btnBox.style.margin = "20px 0";

    let playBtn = document.createElement("button");
    playBtn.textContent = "🎰 Играть в казиныч 🎰";
    playBtn.style.padding = "15px 30px";
    playBtn.style.fontSize = "20px";
    playBtn.style.margin = "0 10px";
    playBtn.style.border = "none";
    playBtn.style.borderRadius = "12px";
    playBtn.style.backgroundColor = "#ff4500";
    playBtn.style.color = "#ffffff";
    playBtn.style.fontWeight = "bold";
    playBtn.style.cursor = "pointer";
    playBtn.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
    playBtn.onmouseover = function() { playBtn.style.backgroundColor = "#ff6347"; };
    playBtn.onmouseout = function() { playBtn.style.backgroundColor = "#ff4500"; };
    playBtn.onclick = kazinych;
    
    let dropBtn = document.createElement("button");
    dropBtn.textContent = "💰 Пополнить баланс";
    dropBtn.style.padding = "15px 30px";
    dropBtn.style.fontSize = "20px";
    dropBtn.style.margin = "0 10px";
    dropBtn.style.border = "none";
    dropBtn.style.borderRadius = "12px";
    dropBtn.style.backgroundColor = "#008000";
    dropBtn.style.color = "#ffffff";
    dropBtn.style.fontWeight = "bold";
    dropBtn.style.cursor = "pointer";
    dropBtn.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
    dropBtn.onmouseover = function() { dropBtn.style.backgroundColor = "#00a000"; };
    dropBtn.onmouseout = function() { dropBtn.style.backgroundColor = "#008000"; };
    dropBtn.onclick = dodep;
    
    btnBox.appendChild(playBtn);
    btnBox.appendChild(dropBtn);
    
    let footr = document.querySelector("footer");
    if (footr) {
        footr.parentNode.insert17.insertBefore(btnBox, footr);
    } else {
        document.body.appendChild(btnBox);
    }
});