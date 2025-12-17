// Петренко Екатерина Анатольевна ЭФБО-04-24

// Задание 1 (Вариант 3): Класс Square (Квадрат)
// Создайте класс Square с приватным свойством _side.
// • Сеттер side запрещает отрицательные значения.
// • Геттер area возвращает площадь квадрата: side².
// • Геттер perimeter возвращает периметр: 4 * side.

class Square {
  #side = 0; // приватное свойство

  constructor(side = 0) {
    this.side = side; // используем сеттер, чтобы сработала валидация
  }

  get side() {
    return this.#side;
  }

  set side(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) {
      throw new Error("Сторона квадрата должна быть неотрицательным числом");
    }
    this.#side = num;
  }

  // Площадь: s^2
  get area() {
    return this.#side ** 2;
  }

  // Периметр: 4 * s
  get perimeter() {
    return 4 * this.#side;
  }
}

// Демонстрация
if (require.main === module) {
  console.log("=== Демонстрация Square ===");
  const sq = new Square(5);
  console.log("Сторона:", sq.side);
  console.log("Площадь:", sq.area);
  console.log("Периметр:", sq.perimeter);

  try {
    console.log("\nПробуем установить отрицательную сторону...");
    sq.side = -2;
  } catch (e) {
    console.log("Ошибка (как и должно быть):", e.message);
  }
}

module.exports = { Square };
