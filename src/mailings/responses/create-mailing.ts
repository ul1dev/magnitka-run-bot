import { cancelBackInlineBtn } from 'src/general';

export const createMailingMessage = () => `<b>Рассылка</b>

Отправьте сообщение рассылки, это может быть: <b>фото, файл (любой формат), голосовое сообщение, видео, GIF или текст</b>.

ℹ️ <i>Вы можете добавить описание к сообщению, а так же использовать <a href="https://core.telegram.org/api/entities">HTML форматирование</a> текста.</i>`;

export const createMailingMarkup = {
  inline_keyboard: [
    [{ text: '🗄 Шаблоны', callback_data: 'mailing_templates' }],
    cancelBackInlineBtn,
  ],
};

export const createQueueMailingMessage = (
  serNum: number,
) => `<b>Рассылка добавлена в очередь</b>

🔢 Ваш номер в очереди: <code>${serNum}</code>

ℹ️ <i>Кто-то уже делает рассылку, ваша рассылка начнется после того, как подойдет ваша очередь.</i>`;
