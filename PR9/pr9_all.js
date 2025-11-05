// ===== Утилиты =====
function out(id, ...parts){
    const el = document.getElementById(id); if (!el) return;
    el.textContent += parts.map(p => typeof p === 'string' ? p : JSON.stringify(p)).join(' ') + '\n';
}
function clearOut(id){ const el = document.getElementById(id); if (el) el.textContent = ''; }
function log(msg){
    const div = document.createElement('div');
    div.textContent = String(msg);
    document.getElementById('log').appendChild(div);
}

// ===== Имитация загрузки файла =====
// Задержка 500–1500мс, 80% успех / 20% ошибка
function loadFile(filename, callback){
    const delay = Math.random()*1000 + 500;
    setTimeout(() => {
        if (Math.random() < 0.2){
            callback(new Error(`Файл ${filename} не найден`), null);
        } else {
            callback(null, { name: filename, content: `Содержимое ${filename}` });
        }
    }, delay);
}

// 1.1: loadFile('config.json') через колбэк
function demo11(){
    loadFile('config.json', (err, file) => {
        if (err){ out('out11', 'Ошибка:', err.message); log(err.message); }
        else { out('out11', 'Успех:', file.name, '→', file.content); log(`OK: ${file.name}`); }
    });
}

// 1.2: «пирамида» — последовательная загрузка вложенными колбэками
function demo12(){
    out('out12', 'Старт…');
    loadFile('user.json', (e1, f1) => {
        if (e1) return out('out12', 'Ошибка user:', e1.message);
        out('out12', 'user:', f1.name);
        loadFile('settings.json', (e2, f2) => {
            if (e2) return out('out12', 'Ошибка settings:', e2.message);
            out('out12', 'settings:', f2.name);
            loadFile('data.json', (e3, f3) => {
                if (e3) return out('out12', 'Ошибка data:', e3.message);
                out('out12', 'data:', f3.name, '— Готово!');
            });
        });
    });
}

// 1.3: плоская последовательность — шаги вынесены в функции
function demo13(){
    function step1(err, file){
        if (err) return out('out13', 'Ошибка user:', err.message);
        out('out13', 'user:', file.name);
        loadFile('settings.json', step2);
    }
    function step2(err, file){
        if (err) return out('out13', 'Ошибка settings:', err.message);
        out('out13', 'settings:', file.name);
        loadFile('data.json', step3);
    }
    function step3(err, file){
        if (err) return out('out13', 'Ошибка data:', err.message);
        out('out13', 'data:', file.name, '— Готово!');
    }
    loadFile('user.json', step1);
}

// 1.4*: параллельная загрузка — собираем результаты/ошибки и даём один колбэк
function parallelLoad(files, callback){
    const results = new Array(files.length);
    const errors  = new Array(files.length);
    let done = 0;
    files.forEach((fn, i) => {
        loadFile(fn, (err, data) => {
            errors[i]  = err || null;
            results[i] = data || null;
            done++;
            if (done === files.length){
                const hasErr = errors.some(Boolean);
                callback(hasErr ? errors : null, results);
            }
        });
    });
}
function demo14(){
    parallelLoad(['a.json','b.json','c.json'], (errs, res) => {
        if (errs) out('out14', 'Ошибки:', errs.map(e => e && e.message));
        out('out14', 'Результаты:', res.map(x => x && x.name));
    });
}

// 2.1: промис с 50/50 и задержкой
function demo21(){
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.5 ? resolve('Готово') : reject(new Error('Ошибка'));
        }, 1500);
    });
    p.then(val => out('out21', 'resolve:', val))
        .catch(err => out('out21', 'reject:', err.message))
        .finally(() => out('out21', 'finally'));
}

// 2.2: «перевыполнение» промиса
function demo22(){
    let p = new Promise(resolve => {
        resolve(1);
        setTimeout(() => resolve(2), 1000); // будет проигнорировано
    });
    p.then(v => out('out22', 'Результат один раз:', String(v)));
    // Пояснение:
    out('out22', 'Пояснение: промис изменяет состояние один раз; повторные resolve игнорируются.');
}

// 2.3: delay(ms) -> Promise
function delay(ms){
    return new Promise(res => setTimeout(res, ms));
}
function demo23(){
    delay(2000).then(() => out('out23', '2 сек прошло!'));
}

// 2.4: loadFile -> Promise-версия
function loadFilePromise(filename){
    return new Promise((resolve, reject) => {
        loadFile(filename, (err, data) => err ? reject(err) : resolve(data));
    });
}
function demo24(){
    loadFilePromise('user.json')
        .then(file => out('out24', 'OK:', file.name))
        .catch(err => out('out24', 'ERR:', err.message));
}

// 3.1: цепочка 1 -> 2 -> 4 с паузами
function demo31(){
    new Promise(res => setTimeout(() => res(1), 1000))
        .then(v => { out('out31', String(v)); return v * 2; })
        .then(v => new Promise(res => setTimeout(() => { out('out31', String(v)); res(v*2); }, 1000)))
        .then(v => out('out31', String(v)));
}

// 3.2: последовательная загрузка через промисы
function demo32(){
    loadFilePromise('user.json')
        .then(f => { out('out32', 'user:', f.name); return loadFilePromise('settings.json'); })
        .then(f => { out('out32', 'settings:', f.name); return loadFilePromise('data.json'); })
        .then(f => { out('out32', 'data:', f.name); out('out32', 'Все файлы загружены!'); })
        .catch(err => out('out32', 'Ошибка:', err.message));
}

// 3.3: showCircle(cx, cy, r) -> Promise<HTMLElement>
// Рисуем круг внутри переданного контейнера (по умолчанию #circleArea)
function showCircle(cx, cy, radius, host = document.getElementById('circleArea')){
    return new Promise(resolve => {
        const div = document.createElement('div');
        div.className = 'circle';            // есть transition на width/height
        div.style.left = cx + 'px';
        div.style.top  = cy + 'px';
        div.style.transform = 'translate(-50%, -50%)'; // центр по заданным координатам
        div.style.width  = '0px';
        div.style.height = '0px';

        host.appendChild(div);               // <-- рисуем в нашей секции

        // запускаем анимацию на следующий кадр
        requestAnimationFrame(() => {
            div.style.width  = (radius * 2) + 'px';
            div.style.height = (radius * 2) + 'px';

            const onEnd = (e) => {
                if (e.propertyName === 'width') {
                    div.removeEventListener('transitionend', onEnd);
                    resolve(div);
                }
            };
            div.addEventListener('transitionend', onEnd);
        });
    });
}

function demo33(){
    // координаты теперь относительно левого-верхнего угла #circleArea
    showCircle(130, 130, 100)              // рисуется в #circleArea по умолчанию
        .then(div => {
            div.classList.add('message-ball');
            div.textContent = 'Привет, мир!';
            out('out33', 'Анимация завершена, элемент получен.');
        });
}

// 4.1: askPassword -> промисы
function askPasswordP(){
    return new Promise((resolve, reject) => {
        const p = prompt('Пароль?');
        (p === '123') ? resolve() : reject(new Error('Неверный пароль'));
    });
}
function demo41(){
    askPasswordP()
        .then(() => { out('out41','OK: доступ разрешён'); alert('OK'); })
        .catch(err => { out('out41','ERR:', err.message); alert('FAIL'); });
}

// 4.2: promisify(f) — конвертер «колбэк (err, data)» -> Promise
function promisify(f){
    return function(...args){
        return new Promise((resolve, reject) => {
            f.call(this, ...args, (err, data) => err ? reject(err) : resolve(data));
        });
    };
}
function demo42(){
    const loadP = promisify(loadFile);
    loadP('demo.json')
        .then(f => out('out42','OK:', f.name))
        .catch(e => out('out42','ERR:', e.message));
}

// 4.3: 4 файла — пирамида vs цепочка
function demo43_pyramid(){
    clearOut('out43');
    out('out43','— Пирамида —');
    loadFile('1.json', (e1,f1)=> {
        if (e1) return out('out43','1:', e1.message);
        out('out43','1:', f1.name);
        loadFile('2.json', (e2,f2)=> {
            if (e2) return out('out43','2:', e2.message);
            out('out43','2:', f2.name);
            loadFile('3.json', (e3,f3)=> {
                if (e3) return out('out43','3:', e3.message);
                out('out43','3:', f3.name);
                loadFile('4.json', (e4,f4)=> {
                    if (e4) return out('out43','4:', e4.message);
                    out('out43','4:', f4.name, '— готово');
                });
            });
        });
    });
}
function demo43_promises(){
    clearOut('out43');
    out('out43','— Цепочка промисов —');
    loadFilePromise('1.json')
        .then(f => { out('out43','1:', f.name); return loadFilePromise('2.json'); })
        .then(f => { out('out43','2:', f.name); return loadFilePromise('3.json'); })
        .then(f => { out('out43','3:', f.name); return loadFilePromise('4.json'); })
        .then(f => { out('out43','4:', f.name, '— готово'); })
        .catch(e => out('out43','Ошибка:', e.message))
        .finally(() => out('out43','Комментарий: цепочка читабельнее, легче обрабатывать ошибки одним .catch() и масштабировать.'));
}
