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

  // Timeweb S3 (hot for static, cold for backups)
  TWC_S3_ENDPOINT: Joi.string().uri().required(),
  TWC_S3_REGION: Joi.string().required(),
  TWC_S3_ACCESS_KEY: Joi.string().required(),
  TWC_S3_SECRET_KEY: Joi.string().required(),
  TWC_S3_HOT_BUCKET: Joi.string().required(),
  TWC_S3_COLD_BUCKET: Joi.string().required(),
});
