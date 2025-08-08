export const menuMessage = () => `<b>Добро пожаловать 👋</b>

<b>FiltyShop</b> — магазин софтов для любых целей. Используйте наши решения, экономьте время и извлекайте максимум пользы.`;

export const menuMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'ℹ️ Инфо',
        callback_data: 'info',
      },
      {
        text: '👤 Профиль',
        callback_data: 'profile',
      },
    ],
    [
      {
        text: '🗂️ Товары',
        callback_data: 'products',
      },
    ],
  ],
});
