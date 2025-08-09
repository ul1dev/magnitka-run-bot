export const menuMessage = () => `<b>Меню админ-бота МБ</b>

Выберите раздел который хотите редактировать:`;

export const menuMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'Забеги',
        callback_data: 'races',
      },
      {
        text: 'Магазин',
        callback_data: 'shop',
      },
    ],
    [
      {
        text: 'Тренеры',
        callback_data: 'trainers',
      },
      {
        text: 'Пейсеры',
        callback_data: 'pacemakers',
      },
    ],
  ],
});
