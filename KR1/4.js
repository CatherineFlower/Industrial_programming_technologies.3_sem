// Петренко Екатерина Анатольевна ЭФБО-04-24
// Задание №4, вариант 17: функция возвращает квадрат x, если x принадлежит [-5; 5], иначе сообщает,
// что вне диапазона.

function squareIfInRange(x) {
    return (x >= -5 && x <= 5) ? x * x : null;
}

function run4() {
    const sx = prompt('Задание 4-17: введите число x');
    if (sx === null) return;
    const x = Number(sx);
    if (!Number.isFinite(x)) { alert('Нужно ввести ЧИСЛО'); return; }

    const y = squareIfInRange(x);
    if (y === null) {
        alert('Число вне диапазона [-5; 5]');
        console.log(`4-17 ▶ x=${x} → вне диапазона`);
    } else {
        alert(`Квадрат числа: ${y}`);
        console.log(`4-17 ▶ x=${x} → x^2 = ${y}`);
    }
}
