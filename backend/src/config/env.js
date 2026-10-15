import 'dotenv/config';
import Joi from 'joi';
const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  DATA_SOURCE: Joi.string()
    .valid('demo', 'mysql')
    .default('mysql'),
  PORT: Joi.number().port().default(3001),
  CORS_ORIGINS: Joi.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  DB_HOST: Joi.string().default('127.0.0.1'),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().default('uniacademy_app'),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().default('uniacademy_db'),
  DB_SSL: Joi.boolean().default(false),
  WHATSAPP_NUMBER: Joi.string()
    .pattern(/^55\d{10,11}$/)
    .allow('')
    .default(''),
}).unknown(true);
const { value, error } = schema.validate(process.env);
if (error) throw new Error(`Configuração inválida: ${error.message}`);
if (value.NODE_ENV === 'production' && !value.DB_PASSWORD)
  throw new Error('DB_PASSWORD obrigatório em produção');
export const env = value;
if (value.NODE_ENV === 'production' && value.DATA_SOURCE === 'demo')
  throw new Error('Modo demonstrativo não permitido em produção');
