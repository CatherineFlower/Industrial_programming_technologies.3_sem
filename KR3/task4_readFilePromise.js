// Петренко Екатерина Анатольевна ЭФБО-04-24

// Задание 4 (Вариант 3):
// Есть функция readFile(path, callback) (имитация чтения через setTimeout).
// Создайте readFilePromise(path), возвращающую промис, который reject’ится при
// ошибке и resolve’ится с данными файла.

/**
 * Имитация "файловой системы"
 */
const FAKE_FS = {
  "/docs/hello.txt": "Привет, это содержимое файла hello.txt",
  "/data/user.json": JSON.stringify({ id: 1, name: "Alice" }, null, 2),
};

/**
 * Имитация readFile(path, callback)
 * @param {string} path
 * @param {(err: Error|null, data?: string) => void} callback
 */
function readFile(path, callback) {
  setTimeout(() => {
    if (typeof path !== "string" || path.length === 0) {
      return callback(new Error("Некорректный путь"));
    }
    if (!(path in FAKE_FS)) {
      return callback(new Error("Файл не найден: " + path));
    }
    callback(null, FAKE_FS[path]);
  }, 500); // быстрая имитация
}

/**
 * Возвращает промис на основе readFile
 * @param {string} path
 * @returns {Promise<string>}
 */
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

// Демонстрация
if (require.main === module) {
  console.log("=== Демонстрация readFilePromise ===");
  readFilePromise("/docs/hello.txt")
    .then((txt) => console.log("OK:", txt))
    .catch((e) => console.log("ERR:", e.message))
    .finally(() => {
      return readFilePromise("/no/such/file")
        .then((txt) => console.log("OK:", txt))
        .catch((e) => console.log("ERR:", e.message));
    });
}

module.exports = { readFile, readFilePromise };
