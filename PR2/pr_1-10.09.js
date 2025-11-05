// 1. Переменные
function task01() {
    const songName = "I'm a barbie girl 🎶";
    console.log("Now playing: " + songName);
}

// 2. Переменные
function task02() {
    const catMood = "angry 😾";
    console.log("Your cat is " + catMood);
}

// 3. Переменные
function task03() {
    const isImpostor = true;
    console.log("Red is impostor? " + isImpostor);
}

// 4. Переменные
function task04() {
    const wow = "wow";
    const soJS = "so JavaScript";
    const muchCode = "much code";
    console.log(wow + " " + soJS + " " + muchCode);
}

// 5. Типы данных
function task05() {
    const likes = 77;
    const verified = false;
    console.log(typeof likes, typeof verified);
}

// 6. Типы данных
function task06() {
    const isOnion = true;
    console.log(typeof isOnion);
}

// 7. Типы данных
function task07() {
    const year = 2077;
    const hero = "V";
    const isBuggy = true;
    console.log(typeof year, typeof hero, typeof isBuggy);
}

// 8. Типы данных
function task08() {
    const prize = 1000000;
    console.log(typeof prize);
}

// 9. Типы данных
function task09() {
    const situation = "fire";
    const reaction = "this is fine";
    console.log(typeof situation, typeof reaction);
}

// 10. Диалоговые окна
function task10() {
    const nickname = prompt("What’s your Minecraft nickname?");
    alert("Welcome to the server, " + nickname + " ⛏️");
}

// 11. Диалоговые окна
function task11() {
    const show = prompt("What’s your favorite TV show?");
    alert("Tonight we binge: " + show + " 🍿");
}

// 12. Диалоговые окна
function task12() {
    const ok = confirm("Do you want a link to cool JS docs?");
    if (ok) {
        alert("Never gonna give you up 🎵");
    }
}

// 13. Диалоговые окна
function task13() {
    const hours = prompt("How many hours did you scroll today?");
    alert("Bruh, that's " + hours + " hours... touch grass 🌱");
}

// 14. Преобразование типов
function task14() {
    const btcStr = prompt("Enter Bitcoin price:");
    const btc = Number(btcStr);
    alert(btc + 1000);
}

// 15. Преобразование типов
// Интерпретируем "Skibidi * n" как повторение слова n раз.
function task15() {
    const n = Number(prompt("Enter n:"));
    if (Number.isFinite(n) && n >= 0) {
        alert("Skibidi ".repeat(n).trim());
    } else {
        alert("n должно быть неотрицательным числом");
    }
}

// 16. Преобразование типов
function task16() {
    const c = Number(prompt("How many coffees today?"));
    alert(c + 1);
}

// 17. Преобразование типов
function task17() {
    const karma = Number(prompt("Enter karma:"));
    alert("Total karma: " + (karma + 10));
}

// 18. Преобразование типов
function task18() {
    const likes = Number(prompt("How many likes did your post get?"));
    alert(likes + 420);
}

// 19. Базовые мат. операции
function task19() {
    let money = 1000;
    money += 250;
    console.log(money);
}

// 20. Базовые мат. операции
function task20() {
    const coins = 350;
    const boosters = 5;
    console.log("Total score: " + (coins + boosters * 100));
}

// 21. Базовые мат. операции
function task21() {
    let pikachuHP = 100;
    const attack = 35;
    pikachuHP -= attack;
    console.log(pikachuHP);
}

// 22. Базовые мат. операции
function task22() {
    const players = 456;
    const eliminated = 100;
    const remaining = players - eliminated;
    console.log(remaining);
}

// 23. Базовые мат. операции
function task23() {
    const a = 10;
    const b = 3;
    console.log("a / b =", a / b);
    console.log("a % b =", a % b);
}
