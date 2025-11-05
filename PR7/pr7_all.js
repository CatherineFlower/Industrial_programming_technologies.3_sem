// ===== ПР-7. Все решения задач =====

// 1.1 — скрыть #text по клику на #hider
document.getElementById('hider').addEventListener('click', () => {
    const div = document.getElementById('text');
    if (div) div.style.display = 'none';
});

// 1.2 — спрятать себя
document.getElementById('selfHider').addEventListener('click', function () {
    // можно this.style.display='none' или this.remove()
    this.remove();
});

// 1.3 — три обработчика: alert → класс → alert
(() => {
    const btn = document.getElementById('btn3');
    if (!btn) return;
    btn.addEventListener('click', () => alert('Первый')); // 1
    btn.addEventListener('click', () => btn.classList.add('highlight')); // 2
    btn.addEventListener('click', () => alert('Третий')); // 3
})();

// 2.1 — раскрывающееся меню
(() => {
    const toggle = document.getElementById('menuToggle');
    const list = document.getElementById('menuList');
    if (!toggle || !list) return;

    // по умолчанию список скрыт
    list.classList.add('hidden');

    toggle.addEventListener('click', () => {
        list.classList.toggle('hidden');
        toggle.textContent = (list.classList.contains('hidden') ? '▶' : '▼') + ' Сладости (нажми меня)!';
    });
})();

// 2.2 — лог события, координаты и тег целевого
document.addEventListener('click', (event) => {
    // чтобы не мешали модальные алерты в 1.3 — просто логи в консоль
    console.log(`type=${event.type}; clientX=${event.clientX}, clientY=${event.clientY}; target=<${event.target.tagName}>`);
});

// 2.3 — существующая функция-обработчик
function handleClick(event) {
    alert(`type=${event.type}; target=<${event.target.tagName}>`);
}
document.getElementById('btn4').addEventListener('click', handleClick);

// 3 — кнопки закрытия для .pane (делегирование)
document.getElementById('t3').addEventListener('click', (e) => {
    const btn = e.target.closest('.close');
    if (!btn) return;
    const pane = btn.closest('.pane');
    if (pane) pane.remove();
});

// 4 — раскрывающееся дерево (одно делегирование на #tree)
(() => {
    const tree = document.getElementById('tree');
    if (!tree) return;
    tree.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li || !tree.contains(li)) return;
        // клики только по заголовку (самому li), а не по вложенным ul
        if (e.target.tagName !== 'LI') return;
        li.classList.toggle('open');
        e.stopPropagation();
    });
})();

// 4.2 — сортируемая таблица по data-type
(() => {
    const grid = document.getElementById('grid');
    if (!grid) return;
    const tbody = grid.querySelector('tbody');

    function getCellValue(tr, idx) {
        return tr.children[idx].textContent.trim();
    }

    grid.querySelector('thead').addEventListener('click', (e) => {
        const th = e.target.closest('th');
        if (!th) return;
        const type = th.dataset.type; // "number" | "string"
        const idx = Array.from(th.parentNode.children).indexOf(th);

        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
            const va = getCellValue(a, idx);
            const vb = getCellValue(b, idx);
            if (type === 'number') return Number(va) - Number(vb);
            return va.localeCompare(vb, 'ru');
        });

        // ререндер
        tbody.append(...rows);
    });
})();

// 4.3 — поведение «подсказка» (делегирование на document)
(() => {
    let tooltipEl = null;

    function showTooltip(target) {
        const html = target.dataset.tooltip;
        if (!html) return;

        tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.innerHTML = html;
        document.body.appendChild(tooltipEl);

        const gap = 5;
        const rect = target.getBoundingClientRect();
        // стартовая позиция — над элементом, по центру
        let top = rect.top - tooltipEl.offsetHeight - gap;
        let left = rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2;

        // коррекция по краям экрана
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        if (left < 5) left = 5;
        if (left + tooltipEl.offsetWidth > vw - 5) left = vw - tooltipEl.offsetWidth - 5;
        if (top < 5) top = rect.bottom + gap; // если не помещается сверху — показываем снизу

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
    }

    function hideTooltip() {
        if (tooltipEl) {
            tooltipEl.remove();
            tooltipEl = null;
        }
    }

    document.addEventListener('mouseover', (e) => {
        const t = e.target.closest('[data-tooltip]');
        if (!t) return;
        showTooltip(t);
    });
    document.addEventListener('mouseout', (e) => {
        // если уходим с элемента с подсказкой — скрываем
        const t = e.target.closest('[data-tooltip]');
        if (!t) return;
        hideTooltip();
    });
})();

// 5.1 — всплытие (сначала child, потом parent)
(() => {
    const parent = document.getElementById('parent');
    const child  = document.getElementById('child');
    if (!parent || !child) return;

    function parentHandler() { console.log('parent click'); }
    function childHandler()  { console.log('child click'); }

    parent.addEventListener('click', parentHandler);
    child .addEventListener('click', childHandler);

    // 5.2 — остановка всплытия: добавим второй обработчик на child
    child.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('child stopPropagation() — до parent не дойдёт');
    });
})();

// 6 — «поведение» для data-counter (делегирование на document)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-counter]');
    if (!btn) return;
    const val = Number(btn.value) || 0;
    btn.value = String(val + 1);
    btn.textContent = `Счётчик ${btn.value}`;
});

// 7 — меню по data-action (делегирование на контейнер #menu)
document.getElementById('menu').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action) alert(action);
});
