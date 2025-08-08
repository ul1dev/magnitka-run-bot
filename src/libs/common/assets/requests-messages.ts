export const requestMessages = {
  isNotEmpty: (field: string) =>
    `Поле ${field} не должно быть пустым | Field ${field} should not be empty`,
  isString: (field: string) =>
    `Поле ${field} должно быть строкой | Field ${field} must be a string`,
  isNumber: (field: string) =>
    `Поле ${field} должно быть числом | Field ${field} must be a number`,
  isEnum: (field: string, enumObject: object) =>
    `Поле ${field} должно быть одним из: ${Object.values(enumObject).join(', ')} | ` +
    `Field ${field} must be one of: ${Object.values(enumObject).join(', ')}`,
  isPositive: (field: string) =>
    `Поле ${field} должно быть положительным числом | Field ${field} must be a positive number`,
  isBoolean: (field: string) =>
    `Поле ${field} должно быть boolean | Field ${field} must be a boolean`,
};
