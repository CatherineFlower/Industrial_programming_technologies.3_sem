// Петренко Екатерина Анатольевна ЭФБО-04-24

// Задание 2 (Вариант 3): Имитатор загрузки данных
// Напишите функцию loadData(callback), которая с помощью setTimeout (3 секунды)
// имитирует загрузку данных с сервера и передаёт в колбэк сообщение
// "Данные успешно получены!".

/**
 * Имитация асинхронной загрузки через колбэк.
 * @param {(message: string) => void} callback
 */
function loadData(callback) {
  setTimeout(() => {
    callback("Данные успешно получены!");
  }, 3000);
}

// Дополнительно: обёртка в промис, чтобы удобно было ждать через await/then
function loadDataAsync() {
  return new Promise((resolve) => {
    loadData(resolve);
  });
}

// Демонстрация
if (require.main === module) {
  console.log("=== Демонстрация loadData ===");
  console.log("Ждём 3 секунды...");
  loadData((msg) => {
    console.log("Колбэк:", msg);

    // Покажем вариант с Promise
    loadDataAsync().then((msg2) => {
      console.log("Promise:", msg2);
    });
  });
}

module.exports = { loadData, loadDataAsync };
