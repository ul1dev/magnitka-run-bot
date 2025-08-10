export const paidOrderMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'Статус: оплачен',
        callback_data: 'order_status',
      },
    ],
  ],
});
