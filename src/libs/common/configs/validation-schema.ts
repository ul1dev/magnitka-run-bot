import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  BOT_TOKEN: Joi.string().required(),
  // BANNER_URL: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_DBNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});
