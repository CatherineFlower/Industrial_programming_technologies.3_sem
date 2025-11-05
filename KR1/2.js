// Петренко Екатерина Анатольевна ЭФБО-04-24
// Задание №2, вариант 44: процедура вывода всех делителей заданного числа.

function getDivisors(n) {
    n = Math.abs(n);
    if (n === 0) return null; // у 0 бесконечно много делителей
    const res = [];
    const r = Math.floor(Math.sqrt(n));
    for (let i = 1; i <= r; i++) {
        if (n % i === 0) {
            res.push(i);
            const j = n / i;
            if (j !== i) res.push(j);
        }
    }
    return res.sort((a, b) => a - b);
}

function run2() {
    const s = prompt('Задание 2-44: введите целое число (не 0)');
    if (s === null) return;
    const n = Number(s);
    if (!Number.isInteger(n)) { alert('Нужно ввести ЦЕЛОЕ число'); return; }
    if (n === 0) { alert('У 0 бесконечно много делителей'); console.log('2-44: n=0 - беск. делителей'); return; }

    const d = getDivisors(n);
    alert(`Делители ${n}: ${d.join(', ')}`);
    console.log(`2-44: n=${n} - делители: [${d.join(', ')}]`);
}
