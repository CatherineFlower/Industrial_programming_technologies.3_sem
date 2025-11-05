// ===== утилиты вывода =====
function outTo(id, ...parts) {
    const el = document.getElementById(id); if (!el) return;
    el.textContent += parts.map(p => typeof p === 'string' ? p : JSON.stringify(p)).join(' ') + '\n';
}
function clearOut(id){ const el = document.getElementById(id); if (el) el.textContent = ''; }

// ==================== 1.1 Прозрачное кэширование ====================
function cachingDecorator11(func){
    const cache = new Map();
    return function(x){
        if (cache.has(x)) return cache.get(x);
        const result = func.call(this, x);
        cache.set(x, result);
        return result;
    };
}
function demo_11(){
    function slow(x){ alert(`Called with ${x}`); return x*2; }
    let slowCached = cachingDecorator11(slow);
    outTo('out_11', 'slow(1)=', String(slowCached(1)));
    outTo('out_11', 'slow(1)=', String(slowCached(1)), '(из кэша)');
    outTo('out_11', 'slow(2)=', String(slowCached(2)));
}

// ============ 1.2 Кэширование с контекстом и несколькими аргументами ============
function cachingDecorator(func, hash){
    const cache = new Map();
    return function(...args){
        const key = hash(args);
        if (cache.has(key)) return cache.get(key);
        const res = func.call(this, ...args);
        cache.set(key, res);
        return res;
    };
}
function hashJoin(args){ return Array.prototype.join.call(args, ','); }

function demo_12(){
    const worker = {
        someMethod(){ return 1; },
        slow(min, max){ alert(`Called with ${min},${max}`); return min + max * this.someMethod(); }
    };
    worker.slow = cachingDecorator(worker.slow, hashJoin);

    outTo('out_12', 'worker.slow(3,5)=', String(worker.slow(3,5)));
    outTo('out_12', 'worker.slow(3,5)=', String(worker.slow(3,5)), '(из кэша)');
    outTo('out_12', 'worker.slow(4,5)=', String(worker.slow(4,5)));
}

// ==================== 1.3 Декоратор-шпион ====================
function spy(func){
    function wrapper(...args){
        wrapper.calls.push(args);
        return func.apply(this, args);
    }
    wrapper.calls = [];
    return wrapper;
}
function demo_13(){
    function work(a,b){ /* по методичке alert */ alert(a+b); return a+b; }
    let wrapped = spy(work);
    wrapped(1,2);
    wrapped(4,5);
    for (let args of wrapped.calls){
        outTo('out_13', 'call:', args.join(','));
    }
}

// ==================== 1.4* Задерживающий декоратор ====================
function delay(f, ms){
    return function(...args){
        const ctx = this;
        setTimeout(() => f.apply(ctx, args), ms);
    };
}
function demo_14(){
    function f(x){ alert(x); }
    const f1000 = delay(f, 1000);
    const f1500 = delay(f, 1500);
    outTo('out_14', 'Планируем вызовы: f1000("test"), f1500("test")');
    f1000('test');
    f1500('test');
}

// ==================== 2.1 Геттер для полного имени ====================
function demo_21(){
    let user = {
        name: 'John',
        surname: 'Smith',
        get fullName(){ return `${this.name} ${this.surname}`; }
    };
    outTo('out_21', 'fullName →', user.fullName);
}

// ==================== 2.2 Сеттер с валидацией ====================
function demo_22(){
    let user = {
        _name: 'John',
        get name(){ return this._name; },
        set name(value){
            if (!value || value.length < 4){ alert('Имя слишком короткое'); return; }
            this._name = value;
        }
    };
    outTo('out_22', 'init name →', user.name);
    user.name = 'Pete';
    outTo('out_22', 'after set "Pete" →', user.name);
    user.name = ''; // alert об ошибке, значение не меняется
    outTo('out_22', 'after set "" →', user.name);
}

// ==================== 2.3 Геттер возраста от birthday ====================
function demo_23(){
    function User(name, birthday){
        this.name = name;
        this.birthday = birthday;
        Object.defineProperty(this, 'age', {
            enumerable: true,
            get(){
                const now = new Date();
                let age = now.getFullYear() - this.birthday.getFullYear();
                const m = now.getMonth() - this.birthday.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < this.birthday.getDate())) age--;
                return age;
            }
        });
    }
    let john = new User('John', new Date(1992, 6, 1));
    outTo('out_23', 'Возраст John →', String(john.age));
}

// ==================== 2.4* Умный аксессор с кэшированием ====================
function demo_24(){
    function User(name, birthday){
        this.name = name;
        let _birthday = birthday;
        let _ageCache = null; // {value:number, stamp:number}

        Object.defineProperty(this, 'birthday', {
            get(){ return _birthday; },
            set(v){ _birthday = v; _ageCache = null; } // изменение — сброс кэша
        });

        Object.defineProperty(this, 'age', {
            get(){
                if (_ageCache) return _ageCache.value;
                const now = new Date();
                let age = now.getFullYear() - _birthday.getFullYear();
                const m = now.getMonth() - _birthday.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < _birthday.getDate())) age--;
                _ageCache = { value: age, stamp: now.getTime() };
                return age;
            }
        });
    }

    let john = new User('John', new Date(1992, 6, 1));
    outTo('out_24', 'age #1 →', String(john.age));
    outTo('out_24', 'age #2 (из кэша) →', String(john.age));
    john.birthday = new Date(1993, 6, 1); // сброс кэша
    outTo('out_24', 'age после смены birthday →', String(john.age));
}

// ==================== 3.1 Прототипы: jumps ====================
function demo_31(){
    let animal = { jumps: null };
    let rabbit = { __proto__: animal, jumps: true };

    outTo('out_31', '1) rabbit.jumps →', String(rabbit.jumps)); // true (собственное)
    delete rabbit.jumps;
    outTo('out_31', '2) после delete rabbit.jumps →', String(rabbit.jumps)); // из прототипа: null
    delete animal.jumps;
    outTo('out_31', '3) после delete animal.jumps →', String(rabbit.jumps)); // undefined
}

// ==================== 3.2 Куда пишется свойство? ====================
function demo_32(){
    let animal = { eat(){ this.full = true; } };
    let rabbit = { __proto__: animal };
    rabbit.eat();
    outTo('out_32', 'rabbit.full →', String(rabbit.full)); // true
    outTo('out_32', 'animal.full →', String(animal.full)); // undefined
}

// ==================== 3.3 Цепочка поиска pockets → bed → table → head ====================
function demo_33(){
    let head = { glasses: 1 };
    let table = { pen: 3, __proto__: head };
    let bed = { sheet: 1, pillow: 2, __proto__: table };
    let pockets = { money: 2000, __proto__: bed };

    outTo('out_33', 'pockets.pen →', String(pockets.pen));
    outTo('out_33', 'bed.glasses →', String(bed.glasses));
}

// ==================== 3.4* Два хомяка и общий живот ===========
function demo_34(){
    // Проблемная версия (общий stomach на прототипе):
    let hamsterBad = {
        stomach: [],
        eat(food){ this.stomach.push(food); }
    };
    let speedyBad = { __proto__: hamsterBad };
    let lazyBad   = { __proto__: hamsterBad };
    speedyBad.eat('apple');
    outTo('out_34', '[плохо] speedy.stomach →', JSON.stringify(speedyBad.stomach));
    outTo('out_34', '[плохо]  lazy.stomach →', JSON.stringify(lazyBad.stomach)); // тоже яблоко

    // Исправление: у каждого — свой stomach
    let hamster = {
        eat(food){
            if (!this.stomach) this.stomach = [];
            this.stomach.push(food);
        }
    };
    let speedy = { __proto__: hamster, stomach: [] };
    let lazy   = { __proto__: hamster, stomach: [] };
    speedy.eat('apple');
    outTo('out_34', '[хорошо] speedy.stomach →', JSON.stringify(speedy.stomach));
    outTo('out_34', '[хорошо]  lazy.stomach →', JSON.stringify(lazy.stomach));
}
