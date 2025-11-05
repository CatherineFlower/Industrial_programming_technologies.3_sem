// ===== PR6 =====

// ---------- утилиты ----------
function outTo(id, ...parts) {
    const el = document.getElementById(id);
    if (!el) return;
    const line = parts.map(p => (typeof p === 'string' ? p : JSON.stringify(p))).join(' ');
    el.textContent += line + '\n';
}
function clearOut(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
}

// ---------- 1.1 ----------
function updateMessage(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = message;
    outTo('out_11', 'innerHTML ->', message);
}

// ---------- 1.2 ----------
function highlightSibling(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const sib = el.nextElementSibling;
    if (sib) {
        sib.innerHTML = sib.innerHTML + ' <strong>Выделено</strong>';
        outTo('out_12', 'Сосед отмечен:', sib.innerHTML.trim());
    } else {
        outTo('out_12', 'Следующего элемента нет');
    }
}

// ---------- 1.3 ----------
function listChildren(selector) {
    const el = document.querySelector(selector);
    if (!el) return outTo('out_13', 'Элемент по селектору не найден');
    const names = Array.from(el.children).map(ch => ch.innerHTML.trim());
    outTo('out_13', 'children:', names.join(' | '));
}

// ---------- 2.1 ----------
function clearElem(elem) {
    if (!elem) return;
    elem.innerHTML = '';
    outTo('out_21', 'Очищено через innerHTML=""');
}

// ---------- 2.2 ----------
function addInput(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Поле ${form.querySelectorAll('input').length + 1}`;
    form.append(input);
    outTo('out_22', 'Добавлен input. Всего:', String(form.querySelectorAll('input').length));
}

// ---------- 2.3 ----------
function cloneAndReplace(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.textContent = 'Клон (замена)';
    // clone.removeAttribute('id');
    el.replaceWith(clone);
    outTo('out_23', 'Заменили элемент. У клона id =', String(clone.id || '(нет)'));
}

// ---------- 3.1 ----------
function highlightError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('error');
    outTo('out_31', '.error добавлен');
}

// ---------- 3.2 ----------
function toggleValid(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const on = el.classList.toggle('valid');
    el.style.backgroundColor = on ? 'green' : '';
    outTo('out_32', 'toggle .valid →', String(on), '| background =', on ? 'green' : 'none');
}

// ---------- 3.3 ----------
function adjustWidth(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const w = parseFloat(getComputedStyle(el).width) || 0;
    const next = w + 50;
    el.style.width = next + 'px';
    outTo('out_33', 'width:', w + 'px', '→', next + 'px');
}

// ---------- 4.1 ----------
function isHidden(id) {
    const el = document.getElementById(id);
    if (!el) return true;
    return el.offsetWidth === 0 && el.offsetHeight === 0;
}

// ---------- 4.2 ----------
function expandElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.height = el.scrollHeight + 'px';
    outTo('out_42', 'height = scrollHeight =', String(el.scrollHeight) + 'px');
}

// ---------- 4.3 ----------
function scrollToBottom(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollTop = el.scrollHeight - el.clientHeight;
    outTo('out_43', 'scrollTop →', String(el.scrollTop));
}

// ---------- 5.1 ----------
function showWindowSize() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    outTo('out_51', `clientWidth=${w}, clientHeight=${h}`);
}

// ---------- 5.2 ----------
function smoothScrollDown() {
    window.scrollBy({ top: 500, behavior: 'smooth' });
}

// ---------- 5.3 ----------
function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- 6* ----------
function addField(){
    // Буду искать и по твоей разметке (myForm), и по моей (form6)
    const form = document.getElementById('myForm') || document.getElementById('form6');
    if (!form) return;

    // берём ПОСЛЕДНИЙ текстовый инпут (куда вводили)
    const last = form.querySelector('input[type="text"]:last-of-type') || form.querySelector('input[type="text"]');
    const val  = (last?.value || '').trim();

    if (!val) {
        // пусто — НЕ добавляем новое поле, просто подсветим текущий .error
        if (last) {
            last.classList.remove('valid');
            last.classList.add('error');
            last.focus();
        }
        // прокрутка формы по условию ширины
        form.style.overflow = form.scrollWidth > 500 ? 'auto' : '';
        return;
    }

    // непусто — помечаем текущее как valid
    last.classList.remove('error');
    last.classList.add('valid');

    // добавляем новое поле
    const input = document.createElement('input');
    input.type = 'text';
    form.appendChild(input);

    // правило overflow для ширины формы
    form.style.overflow = form.scrollWidth > 500 ? 'auto' : '';
}

// ---------- 7* ----------
(function setupList7(){
    const ul = document.getElementById('list7');
    if (!ul) return;

    ul.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li || !ul.contains(li)) return;

        const turnedOn = li.classList.toggle('highlight');
        if (turnedOn) {
            li.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
})();

// ---------- 8* ----------
function adaptWidth(){
    const form  = document.getElementById('myForm8') || document.getElementById('myForm') || document.getElementById('form8');
    const input = document.getElementById('input8') || (form ? form.querySelector('input[type="text"]') : null);
    if (!form || !input) return;

    const txt = input.value;
    if (!txt.trim()) {
        // Пусто — не адаптируем, возвращаем стандартную ширину
        input.style.width = '';
        form.style.overflow = form.scrollWidth > 500 ? 'auto' : '';
        return;
    }

    // Измеряем ширину текста с тем же шрифтом, что у input
    const cs = getComputedStyle(input);
    const probe = document.createElement('span');
    probe.style.position   = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.whiteSpace = 'pre';
    probe.style.font       = cs.font;
    probe.textContent      = txt;
    document.body.appendChild(probe);
    const textW = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);

    const padL = parseFloat(cs.paddingLeft)  || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const target = textW + padL + padR + 16;        // небольшой запас
    const max    = form.clientWidth * 0.95;         // не шире формы

    input.style.width = Math.min(target, max) + 'px';

    // Если содержимое формы стало шире 500px — делаем её прокручиваемой
    form.style.overflow = form.scrollWidth > 500 ? 'auto' : '';
}

// ---------- общая инициализация ----------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(f =>
        f.addEventListener('submit', e => e.preventDefault())
    );
    console.log('PR6 ready');
});

// экспорт в window для onclick в HTML
Object.assign(window, {
    outTo, clearOut,
    updateMessage, highlightSibling, listChildren,
    clearElem, addInput, cloneAndReplace,
    highlightError, toggleValid, adjustWidth,
    isHidden, expandElement, scrollToBottom,
    showWindowSize, smoothScrollDown, scrollToElement,
    addField, adaptWidth
});
