/* ===== ПР5 — все задания в одном файле + локальные выводы ===== */

/* ---------- Мини-логгер ---------- */
function pr5Describe(el) {
    if (!el) return '—';
    try {
        const t = (el.tagName || '').toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.classList && el.classList.length ? '.' + Array.from(el.classList).join('.') : '';
        const txt = el.textContent ? ` "${el.textContent.trim()}"` : '';
        return `<${t}${id}${cls}>${txt}`;
    } catch (e) {
        return String(el);
    }
}
function clearOut(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
}
function describeInput(el) {
    if (!el || el.tagName?.toLowerCase() !== 'input') return pr5Describe(el);
    const type = el.getAttribute('type') || 'text';
    const name = el.getAttribute('name');
    const value = el.getAttribute('value');
    const bits = [`type=${type}`];
    if (name) bits.push(`name=${name}`);
    if (value) bits.push(`value=${value}`);
    return `<input ${bits.join(' ')}>`;
}
function pr5Write(outId, ...parts) {
    const box = document.getElementById(outId);
    if (!box) { console.warn('Нет контейнера вывода:', outId); return; }
    let line = '';
    for (const p of parts) {
        if (p instanceof Element) line += pr5Describe(p);
        else if (typeof p === 'string') line += p;
        else {
            try { line += JSON.stringify(p); }
            catch { line += String(p); }
        }
        line += ' ';
    }
    box.textContent += line.trimEnd() + '\n';
}

/* ---------- Задание 1 ---------- */
function task1_run() {
    const out = 'out-1';
    const root = document.getElementById('task1');
    const div = root.querySelector(':scope > div');
    const ul = div?.nextElementSibling;
    const li2 = ul?.firstElementChild?.nextElementSibling;
    pr5Write(out, 'div:', div);
    pr5Write(out, 'ul :', ul);
    pr5Write(out, '2-й li:', li2, '→', li2?.textContent?.trim());
}

/* ---------- Задание 2 ---------- */
function task2_run() {
    const out = 'out-2';
    const table = document.getElementById('testTable');
    if (!table) return;
    const n = table.rows.length;
    for (let i = 0; i < n; i++) {
        const j = n - 1 - i;
        const td = table.rows[i].cells[j];
        if (td) td.style.backgroundColor = 'red';
    }
    pr5Write(out, 'Подсветили обратную диагональ, n =', String(n));
}
function task2_reset() {
    const out = 'out-2';
    const table = document.getElementById('testTable');
    if (!table) return;
    for (const row of table.rows) for (const td of row.cells) td.style.backgroundColor = '';
    pr5Write(out, 'Сброс выделения.');
}

/* ---------- Задание 3 ---------- */
function task3_run() {
    const out = 'out-3';
    const ageTable = document.getElementById('age-table');
    const labels = ageTable ? ageTable.querySelectorAll('label') : [];
    const firstTd = ageTable ? ageTable.querySelector('td') : null;

    const formSearch = document.querySelector('form[name="search"]');
    const inputs = formSearch ? formSearch.querySelectorAll('input') : [];
    const firstInput = inputs[0] || null;
    const lastInput  = inputs[inputs.length - 1] || null;

    pr5Write(out, 'Таблица:', ageTable);
    pr5Write(out, 'Label-ов внутри:', String(labels.length));
    pr5Write(out, 'Первый td:', firstTd, '→', firstTd?.textContent?.trim());
    pr5Write(out, 'Форма search:', formSearch);
    pr5Write(out, 'Первый input формы search:', describeInput(firstInput));
    pr5Write(out, 'Последний input формы search:', describeInput(lastInput));
}

/* ---------- Задание 4 ---------- */
let task4_initialized = false;
let task4_ul = null;
function task4_build() {
    const out = 'out-4';
    if (task4_initialized) { pr5Write(out, 'Уже создано.'); return; }
    const container = document.getElementById('container4');

    const h1 = document.createElement('h1');
    h1.textContent = 'Список пользователей';

    task4_ul = document.createElement('ul');
    ['Анна', 'Борис', 'Виктор'].forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        task4_ul.appendChild(li);
    });

    const btn = document.createElement('button');
    btn.textContent = 'Добавить пользователя';
    btn.type = 'button';
    btn.addEventListener('click', task4_add);

    container.append(h1, task4_ul, btn);
    task4_initialized = true;
    pr5Write(out, 'Создали: h1, ul(3), button.');
}
function task4_add() {
    const out = 'out-4';
    if (!task4_ul) { pr5Write(out, 'Сначала «Построить список…»'); return; }
    const li = document.createElement('li');
    li.textContent = 'Новый пользователь';
    task4_ul.appendChild(li);
    pr5Write(out, 'Добавлен:', li);
}

/* ---------- Задание 5 ---------- */
function task5_run() {
    const out = 'out-5';
    const container = document.getElementById('task5-container');
    const texts = container.querySelectorAll('.text');
    const special = container.querySelector('.text.special');
    if (special) special.style.color = 'red';
    texts.forEach((p, i) => ((i + 1) % 3 === 0) && (p.style.background = '#d1fae5'));
    container.style.border = '2px solid #9ca3af';
    container.style.borderRadius = '8px';
    pr5Write(out, 'Применено: .special красный, каждый 3-й с фоном, рамка контейнера.');
}
function task5_reset() {
    const out = 'out-5';
    const container = document.getElementById('task5-container');
    container.querySelectorAll('.text').forEach(p => { p.style.color = ''; p.style.background = ''; });
    container.style.border = '';
    container.style.borderRadius = '';
    pr5Write(out, 'Стили сброшены.');
}

/* ---------- Задание 6 ---------- */
function task6_run() {
    const out = 'out-6';
    const items = Array.from(document.querySelectorAll('#task6 .item'));
    const active = items.find(el => el.classList.contains('active'));
    if (active) active.classList.add('highlight');

    const prices = items.map(el => Number(el.dataset.price) || 0);
    const total = prices.reduce((a, b) => a + b, 0);
    let maxEl = null, maxPrice = -Infinity;
    items.forEach(el => {
        const p = Number(el.dataset.price) || 0;
        if (p > maxPrice) { maxPrice = p; maxEl = el; }
    });

    pr5Write(out, 'Сумма цен =', String(total));
    pr5Write(out, 'Максимум:', maxEl, '→', String(maxPrice));
}

/* ---------- Задание 7* ---------- */
function findDomPath(startElement, targetElement) {
    if (!(startElement instanceof Element) || !(targetElement instanceof Element)) {
        throw new Error('Нужны DOM-элементы');
    }
    if (startElement === targetElement) return ':scope';
    if (!startElement.contains(targetElement)) {
        throw new Error('Целевой элемент не является потомком стартового');
    }
    const chain = [];
    let cur = targetElement;
    while (cur && cur !== startElement) {
        const tag = cur.tagName.toLowerCase();
        const cls = Array.from(cur.classList);
        let sel = tag;
        if (cls.length) sel += '.' + cls.join('.');
        else if (tag === 'li') {
            const idx = Array.from(cur.parentElement.children).indexOf(cur) + 1;
            sel += `:nth-child(${idx})`;
        }
        chain.push(sel);
        cur = cur.parentElement;
    }
    return chain.reverse().join(' > ');
}
function findElementByPath(startElement, path) {
    if (path === ':scope') return startElement;
    return startElement.querySelector(path);
}
function task7_demo() {
    const out = 'out-7';
    const app = document.getElementById('app');
    const header = app.querySelector('header');
    const activeLink = document.getElementById('activeLink');
    const paragraph = document.getElementById('paragraph');
    const external = document.getElementById('externalElement');

    const p1 = findDomPath(app, activeLink);
    const p2 = findDomPath(app, paragraph);
    const p3 = findDomPath(header, activeLink);
    const p4 = findDomPath(app, app);
    pr5Write(out, 'p1:', p1);
    pr5Write(out, 'p2:', p2);
    pr5Write(out, 'p3:', p3);
    pr5Write(out, 'p4:', p4);
    try { findDomPath(app, external); }
    catch (e) { pr5Write(out, 'Ошибка внешнего элемента:', e.message); }
    pr5Write(out, 'Проверка p1:', String(findElementByPath(app, p1) === activeLink));
}

/* ---------- Глобально экспортируем функции для onclick ---------- */
Object.assign(window, {
    task1_run, task2_run, task2_reset,
    task3_run, task4_build, task4_add,
    task5_run, task5_reset, task6_run,
    findDomPath, findElementByPath, task7_demo,
    clearOut
});


/* ---------- Блокируем submit у форм и делаем все кнопки безопасными ---------- */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(f => {
        f.addEventListener('submit', e => e.preventDefault());
    });
    document.querySelectorAll('button:not([type])').forEach(b => b.type = 'button');
    console.log('PR5: скрипт загружен и инициализирован');
});
