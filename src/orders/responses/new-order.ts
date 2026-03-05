import { Order } from '../models/order.model';

export const newOrderMessage = (order: Order) => {
  let initMessage = `🛍 <b>Новый заказ</b>

<b>Получатель</b>
ФИО: <code>${order.name}</code>
Телефон: <code>${order.phone}</code>
Почта: ${order.email}

Способ доставки: ${order.deliveryMethod === 'self-pickup' ? 'Самовывоз' : 'СДЕК'}

<b>Товары</b>`;

  const products = order.products;
  if (Array.isArray(products) && products.length) {
    for (const { product, count, size } of products) {
      initMessage += `\n\nАртикул: <code>${product.article}</code>
Название: <code>${product.title}</code>
Кол-во: <code>${count}</code>${
        size
          ? `\n${product?.sizesTitle?.slice(0, 1).toUpperCase()}${product?.sizesTitle
              ?.slice(1)
              .toLowerCase()}: <code>${size.toUpperCase()}</code>`
          : ''
      }`;
    }
  }

  return initMessage;
};

export const newOrderMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'Статус: создан',
        callback_data: 'order_status',
      },
    ],
  ],
});
