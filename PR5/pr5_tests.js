/*  pr5_tests.js — Автотесты для ПР-5 (DOM)
 * Запуск: нажми кнопку «Запустить все тесты» в блоке Автотестов.
 */

(function () {
    const logEl = () => document.getElementById('test-log');

    function log(msg = '') { logEl().textContent += msg + '\n'; }
    function clearLog() { logEl().textContent = ''; }

    function assert(condition, message) {
        if (!condition) throw new Error(message || 'Assertion failed');
    }

    function section(title) {
        log('\n=== ' + title + ' ===');
    }

    // Удобный захват ошибок, чтобы тесты продолжали выполняться.
    async function runTest(name, fn) {
        const start = performance.now();
        try {
            const r = fn();
            if (r && typeof r.then === 'function') await r;
            const ms = Math.round(performance.now() - start);
            log('✅ ' + name + `  (${ms} ms)`);
        } catch (e) {
            const ms = Math.round(performance.now() - start);
            log('❌ ' + name + `  (${ms} ms)`);
            log('   → ' + (e && e.message ? e.message : e));
        }
    }

    // Вспомогалки
    function text(el) { return el?.textContent?.trim() ?? ''; }
    function getCells(table) {
        return Array.from(table.rows).map(r => Array.from(r.cells));
    }
    function styleOf(el) {
        // Вернём и inline-стили, и вычисленные (для надёжности)
        const cs = window.getComputedStyle(el);
        return {
            border: el.style.border,
            borderWidth: cs.borderTopWidth,
            borderRadius: el.style.borderRadius || cs.borderTopLeftRadius,
            background: el.style.background,
            backgroundColor: cs.backgroundColor,
            color: cs.color
        };
    }

    // ------- Тест 1: Навигация по DOM -------
    function test1() {
        const root = document.getElementById('task1');
        assert(root, '#task1 не найден');

        const div = root.querySelector(':scope > div');
        assert(div, 'div в #task1 не найден');
        assert(/Пользователи/.test(text(div)), 'div в #task1 должен содержать текст "Пользователи"');

        const ul = div.nextElementSibling;
        assert(ul && ul.tagName.toLowerCase() === 'ul', 'После div должен идти <ul>');

        const li1 = ul.firstElementChild;
        const li2 = li1?.nextElementSibling;
        assert(text(li1) === 'Джон', 'Первый элемент списка должен быть "Джон"');
        assert(text(li2) === 'Пит', 'Второй элемент списка должен быть "Пит"');
    }

    // ------- Тест 2: Обратная диагональ + сброс -------
    function test2() {
        const table = document.getElementById('testTable');
        assert(table, '#testTable не найдена');
        // Сбросим сначала
        if (typeof task2_reset === 'function') task2_reset();

        const rows = table.rows;
        const n = rows.length;
        assert(n > 0, 'В таблице нет строк');

        // Подсветим
        assert(typeof task2_run === 'function', 'Функция task2_run не найдена');
        task2_run();

        // Проверка обратной диагонали
        for (let i = 0; i < n; i++) {
            const j = n - 1 - i;
            const td = rows[i].cells[j];
            assert(td, `Ячейка (${i},${j}) не найдена`);
            assert(td.style.backgroundColor === 'red' || window.getComputedStyle(td).backgroundColor === 'rgb(255, 0, 0)',
                `Ячейка (${i},${j}) должна быть подсвечена красным`);
        }

        // Сброс
        task2_reset();
        for (let i = 0; i < n; i++) {
            for (const td of rows[i].cells) {
                assert(td.style.backgroundColor === '' || window.getComputedStyle(td).backgroundColor !== 'rgb(255, 0, 0)',
                    `Ячейка (${i}) должна быть без красного после сброса`);
            }
        }
    }

    // ------- Тест 3: Поиск элементов -------
    function test3() {
        assert(typeof task3_run === 'function', 'Функция task3_run не найдена');

        const ageTable = document.getElementById('age-table');
        assert(ageTable, '#age-table не найден');

        const labels = ageTable.querySelectorAll('label');
        assert(labels.length === 3, 'В #age-table должно быть 3 label');

        const firstTd = ageTable.querySelector('td');
        assert(text(firstTd) === 'Age:', 'Первый <td> в #age-table должен содержать "Age:"');

        const formSearch = document.querySelector('form[name="search"]');
        assert(formSearch, 'Форма name="search" не найдена');

        const inputs = formSearch.querySelectorAll('input');
        assert(inputs.length >= 1, 'В форме search ожидаются input-ы');
        const firstInput = inputs[0];
        const lastInput = inputs[inputs.length - 1];
        assert(firstInput && lastInput, 'Не удалось определить первый/последний input формы search');
    }

    // ------- Тест 4: Создание элементов и добавление -------
    function test4() {
        assert(typeof task4_build === 'function', 'Функция task4_build не найдена');
        const container = document.getElementById('container4');
        assert(container, '#container4 не найден');

        // Перестроим заново, если уже есть
        container.innerHTML = '';
        window.task4_initialized = false;
        window.task4_ul = null;

        task4_build();

        // Проверим структуру
        const h1 = container.querySelector('h1');
        assert(h1 && text(h1) === 'Список пользователей', 'Должен быть заголовок "Список пользователей"');

        const ul = container.querySelector('ul');
        assert(ul, 'Список <ul> не найден');
        assert(ul.children.length === 3, 'В списке должно быть 3 пользователя');

        const btn = container.querySelector('button');
        assert(btn && /Добавить/.test(text(btn)), 'Кнопка "Добавить пользователя" не найдена');

        // Добавим нового пользователя
        assert(typeof task4_add === 'function', 'Функция task4_add не найдена');
        task4_add();
        assert(ul.children.length === 4, 'После добавления должно стать 4 элемента в списке');
        assert(text(ul.lastElementChild) === 'Новый пользователь', 'Добавленный элемент должен называться "Новый пользователь"');
    }

    // ------- Тест 5: Классы и стили -------
    function test5() {
        assert(typeof task5_run === 'function', 'Функция task5_run не найдена');
        assert(typeof task5_reset === 'function', 'Функция task5_reset не найдена');

        const container = document.getElementById('task5-container');
        assert(container, '#task5-container не найден');

        // Сброс перед тестом
        task5_reset();

        // Применяем стили
        task5_run();

        const paras = container.querySelectorAll('.text');
        assert(paras.length >= 3, 'Ожидается минимум 3 параграфа с классом .text');

        // special — красный текст
        const special = container.querySelector('.text.special');
        assert(special, '.text.special не найден');
        const sStyle = styleOf(special);
        // цвет может зависеть от темы браузера; проверим, что он не пустой после применения
        assert(special.style.color !== '', 'У .text.special должен быть задан цвет (красный) через inline-style');

        // каждый третий — с фоном
        paras.forEach((p, idx) => {
            const k = idx + 1;
            if (k % 3 === 0) {
                assert(p.style.background !== '' || styleOf(p).backgroundColor !== 'rgba(0, 0, 0, 0)',
                    `Параграф #${k} должен иметь зелёный фон`);
            }
        });

        // у контейнера рамка и скругление
        const cStyle = styleOf(container);
        assert((container.style.border || '').includes('2px') || cStyle.borderWidth === '2px',
            'У контейнера должна быть рамка толщиной 2px');
        assert((container.style.borderRadius || cStyle.borderRadius) !== '',
            'У контейнера должен быть border-radius');
    }

    // ------- Тест 6: data-атрибуты, активный и сумма/максимум -------
    function test6() {
        assert(typeof task6_run === 'function', 'Функция task6_run не найдена');

        // Снимем .highlight если он уже был
        document.querySelectorAll('#task6 .item').forEach(el => el.classList.remove('highlight'));

        // Запуск
        task6_run();

        const items = Array.from(document.querySelectorAll('#task6 .item'));
        assert(items.length >= 3, 'Ожидается минимум 3 элемента .item');

        const active = items.find(el => el.classList.contains('active'));
        assert(active, 'Не найден .item.active');
        assert(active.classList.contains('highlight'), 'После запуска у .active должен появиться класс .highlight');

        const prices = items.map(el => Number(el.dataset.price) || 0);
        const total = prices.reduce((a, b) => a + b, 0);
        assert(total === 450, 'Сумма цен должна быть 450 при разметке по умолчанию');

        const maxPrice = Math.max(...prices);
        const maxEl = items[prices.indexOf(maxPrice)];
        assert(maxPrice === 200 && text(maxEl).includes('Товар 2'),
            'Максимальная цена должна быть 200 у "Товар 2"');
    }

    // ------- Тест 7*: findDomPath / findElementByPath -------
    function test7() {
        assert(typeof findDomPath === 'function', 'findDomPath не найдена');
        assert(typeof findElementByPath === 'function', 'findElementByPath не найдена');

        const app = document.getElementById('app');
        const header = app.querySelector('header');
        const activeLink = document.getElementById('activeLink');
        const paragraph = document.getElementById('paragraph');
        const externalElement = document.getElementById('externalElement');

        const p1 = findDomPath(app, activeLink);
        const p2 = findDomPath(app, paragraph);
        const p3 = findDomPath(header, activeLink);
        const p4 = findDomPath(app, app);

        assert(p1 === 'header > nav > ul.menu > li:nth-child(2) > a.active',
            'Неверный путь p1 для activeLink');
        assert(p2 === 'main > section.content > div.card > p.text',
            'Неверный путь p2 для paragraph');
        assert(p3 === 'nav > ul.menu > li:nth-child(2) > a.active',
            'Неверный путь p3 для activeLink внутри header');
        assert(p4 === ':scope', 'Путь к самому себе должен быть ":scope"');

        let threw = false;
        try { findDomPath(app, externalElement); }
        catch { threw = true; }
        assert(threw, 'Ожидалось исключение для элемента вне app');

        // Обратный поиск
        assert(findElementByPath(app, p1) === activeLink, 'findElementByPath(app, p1) должен вернуть activeLink');
        assert(findElementByPath(app, p2) === paragraph, 'findElementByPath(app, p2) должен вернуть paragraph');
    }

    // Публичные функции
    window.PR5_RUN_ALL_TESTS = async function () {
        clearLog();
        section('ПР5 — запуск автотестов');

        const tests = [
            ['Задание 1 — навигация по DOM', test1],
            ['Задание 2 — обратная диагональ таблицы', test2],
            ['Задание 3 — поиск элементов', test3],
            ['Задание 4 — динамическое создание', test4],
            ['Задание 5 — классы и стили', test5],
            ['Задание 6 — data-атрибуты', test6],
            ['Задание 7* — пути DOM', test7],
        ];

        for (const [name, fn] of tests) {
            await runTest(name, fn);
        }

        log('\nГотово. Если есть ❌ — смотри сообщение об ошибке над ним.');
    };

    window.PR5_CLEAR_TEST_LOG = clearLog;

    // Автозапуск по желанию:
    // document.addEventListener('DOMContentLoaded', () => PR5_RUN_ALL_TESTS());
})();
