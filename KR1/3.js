// Петренко Екатерина Анатольевна ЭФБО-04-24
// Задание №3, вариант 31: найти минимальный элемент среди ЧЁТНЫХ чисел массива.

function run3() {
    const sN = prompt('Задание 3-31: введите размер массива N (целое ≥ 1)');
    if (sN === null) return;
    const N = Number(sN);
    if (!Number.isInteger(N) || N < 1) { alert('N должно быть целым числом ≥ 1'); return; }

    const a = [];
    for (let i = 0; i < N; i++) {
        const si = prompt(`Введите целое число a[${i}]`);
        if (si === null) { alert('Ввод прерван'); return; }
        const v = Number(si);
        if (!Number.isInteger(v)) { alert('Нужно целое число'); i--; continue; }
        a.push(v);
    }

    let minEven = Infinity;
    for (const x of a) if (x % 2 === 0 && x < minEven) minEven = x;

    if (minEven === Infinity) {
        alert('В массиве НЕТ чётных элементов');
        console.log(`3-31 ▶ a=[${a.join(', ')}] → чётных нет`);
    } else {
        alert(`Минимальный чётный элемент: ${minEven}`);
        console.log(`3-31 ▶ a=[${a.join(', ')}] → min чётный = ${minEven}`);
    }
}
