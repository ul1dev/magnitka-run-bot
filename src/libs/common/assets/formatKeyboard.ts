import { InlineBtnType } from 'src/general';
import { getEmptyBtns } from './getEmptyBtns';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

export const formatKeyboard = (
  arr: InlineBtnType[],
  rowLen = 2,
  isEmptyFill = false,
) => {
  const keyboardItems: InlineKeyboardButton[][] = [];
  let prepeadedItems: InlineKeyboardButton[] = [];
  let index = 0;

  for (let item of arr) {
    prepeadedItems.push(item);

    if (prepeadedItems.length >= rowLen || index === arr.length - 1) {
      if (isEmptyFill && index === arr.length - 1) {
        prepeadedItems.push(...getEmptyBtns(rowLen - prepeadedItems.length));
      }

      keyboardItems.push(prepeadedItems);
      prepeadedItems = [];
    }
    index++;
  }

  return keyboardItems;
};
