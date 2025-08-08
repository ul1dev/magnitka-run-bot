import { User } from 'src/users/models/user.model';
import { slicedContinText } from './slicedContinText';

export const getUserName = (user: User | any = {}) => {
  const userLink = user.userName ? `https://t.me/${user.userName}` : false;

  const name = slicedContinText(
    `${user.firstName ?? ''} ${user.lastName ?? ''}`,
    15,
  )?.trim();

  const linkName = name !== '' ? name : user.telegramId;

  const codeName =
    name !== '' ? `<code>${name}</code>` : `<code>${user.telegramId}</code>`;

  const userName = userLink
    ? `<a href="${userLink}">${linkName}</a>`
    : codeName;

  return userName;
};
