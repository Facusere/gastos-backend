const Joi = require('joi');

const expenseSchema = Joi.object({
  monto: Joi.number().positive().required(),
  fecha: Joi.date().iso().required(),
  categoria: Joi.string().min(2).max(50).required(),
  descripcion: Joi.string().allow('').max(255),
});

module.exports = expenseSchema;
