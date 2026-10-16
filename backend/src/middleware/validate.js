import Joi from 'joi';
import { AppError } from './errors.js';

// Validação existente: aula experimental.
export const trialSchema = Joi.object({
  client_name: Joi.string().trim().min(3).max(120).required(),

  phone: Joi.string()
    .trim()
    .pattern(/^(?:55)?\d{10,11}$/)
    .required(),

  email: Joi.string().trim().email().max(254).required(),

  preferred_modality: Joi.string().trim().max(80).required(),

  consent: Joi.boolean().valid(true).required(),
});

export function validateTrial(req, res, next) {
  const { value, error } = trialSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return next(
      new AppError(
        400,
        'VALIDATION_ERROR',
        'Revise os campos informados.',
        error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      ),
    );
  }

  req.body = value;
  next();
}

// Verifica se a data existe, não passou e não é domingo.
function validatePreferredDate(value, helpers) {
  const date = new Date(`${value}T12:00:00Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return helpers.error('any.invalid');
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Recife',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const getPart = (type) => parts.find((part) => part.type === type).value;

  const today = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;

  if (value < today || date.getUTCDay() === 0) {
    return helpers.error('any.invalid');
  }

  return value;
}

// Validação nova: interesse nos planos.
export const planInterestSchema = Joi.object({
  schema_version: Joi.string().valid('1.1').required(),

  plan_id: Joi.number().integer().positive().required(),

  client_name: Joi.string().trim().min(3).max(120).required(),

  phone: Joi.string()
    .trim()
    .pattern(/^(?:55)?\d{10,11}$/)
    .required(),

  email: Joi.string().trim().email().max(254).required(),

  preferred_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .custom(validatePreferredDate)
    .required(),

  experience_level: Joi.string()
    .valid('beginner', 'returning', 'regular')
    .allow(null, '')
    .optional(),

  consent: Joi.boolean().valid(true).required(),

  marketing_consent: Joi.boolean().default(false),

  idempotency_key: Joi.string().guid({ version: 'uuidv4' }).required(),
});

// Middleware da futura rota POST /api/plan-interest.
export function validatePlanInterest(req, res, next) {
  const { value, error } = planInterestSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return next(
      new AppError(
        400,
        'VALIDATION_ERROR',
        'Revise os dados do interesse no plano.',
        error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      ),
    );
  }

  req.body = value;
  next();
}
