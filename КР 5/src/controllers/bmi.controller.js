function computeBMI(weight, height) {
  const w = Number(weight);
  let h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    throw Object.assign(new Error('Некорректные параметры: вес и рост должны быть положительными числами'), { status: 400 });
  }
  if (h > 3) h = h / 100;
  const bmi = +(w / (h * h)).toFixed(2);
  let category = '', advice = '';
  if (bmi < 18.5) { category = 'Недостаточный вес'; advice = 'Добавьте калорийность, включите силовые тренировки и наблюдайтесь у врача.'; }
  else if (bmi < 25) { category = 'Норма'; advice = 'Поддерживайте баланс питания и активности.'; }
  else if (bmi < 30) { category = 'Избыточная масса'; advice = 'Сократите калорийность и увеличьте активность, обсудите план с врачом.'; }
  else { category = 'Ожирение'; advice = 'Обратитесь к специалисту, составьте программу снижения массы и наблюдайтесь.'; }
  return { bmi, category, advice };
}
export function getBmiByParams(req, res, next) {
  try {
    const { weight, height } = req.query;
    const result = computeBMI(weight, height);
    res.json({ ok: true, ...result, params: { weight, height } });
  } catch (err) { next(err); }
}
export function calcBmi(req, res, next) {
  try {
    const { weight, height } = req.body;
    const result = computeBMI(weight, height);
    res.status(201).json({ ok: true, ...result });
  } catch (err) { next(err); }
}
export function getBmiInfo(req, res) {
  res.json({
    formula: 'BMI = вес(кг) / рост(м)^2',
    note: 'Рост можно передавать в сантиметрах или метрах. При значении > 3 считаем, что это сантиметры.',
    ranges: [
      { min: 0, max: 18.5, label: 'Недостаточный вес' },
      { min: 18.5, max: 25, label: 'Норма' },
      { min: 25, max: 30, label: 'Избыточная масса' },
      { min: 30, max: 100, label: 'Ожирение' }
    ],
    examples: ['/api/bmi/calc?weight=70&height=170', '/api/bmi/calc?weight=70&height=1.70']
  });
}