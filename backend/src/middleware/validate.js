import Joi from 'joi';
import { AppError } from './errors.js';
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
  const { value, error } = trialSchema.validate(req.body, { abortEarly: false, convert: true });
  if (error)
    return next(
      new AppError(
        400,
        'VALIDATION_ERROR',
        'Revise os campos informados.',
        error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
      ),
    );
  req.body = value;
  next();
}
