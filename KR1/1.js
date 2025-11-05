// Петренко Екатерина Анатольевна ЭФБО-04-24
// Задание №1, вариант 6: запросить целое число и вывести сумму его цифр.

function sumDigits(n) {
    n = Math.abs(n);
    let s = 0;
    for (const ch of String(n)) s += ch.charCodeAt(0) - 48;
    return s;
}

function run1() {
    const s = prompt('Задание 1-6: введите целое число');
    if (s === null) return;
    const n = Number(s);
    if (!Number.isInteger(n)) { alert('Нужно ввести ЦЕЛОЕ число'); return; }
    const res = sumDigits(n);
    alert(`Сумма цифр числа ${n} = ${res}`);
    console.log(`1-6: n=${n} - сумма цифр = ${res}`);
}
