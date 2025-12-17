// Петренко Екатерина Анатольевна ЭФБО-04-24

// Задание 3 (Вариант 3): Проверка возраста
// Реализуйте функцию checkAge(age), возвращающую промис.
// Если age >= 18, промис выполняется успешно (resolve("Доступ разрешён")),
// иначе отклоняется (reject("Доступ запрещён")).

/**
 * Проверка возраста
 * @param {number} age
 * @returns {Promise<string>}
 */
function checkAge(age) {
  return new Promise((resolve, reject) => {
    const n = Number(age);
    if (!Number.isFinite(n)) {
      reject("Некорректное число возраста");
      return;
    }
    if (n >= 18) {
      resolve("Доступ разрешён");
    } else {
      reject("Доступ запрещён");
    }
  });
}

// Демонстрация
if (require.main === module) {
  console.log("=== Демонстрация checkAge ===");
  checkAge(21).then(console.log).catch(console.error);
  checkAge(16).then(console.log).catch(console.error);
  checkAge("не число").then(console.log).catch(console.error);
}

module.exports = { checkAge };
