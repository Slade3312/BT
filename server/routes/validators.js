const Joi = require('@hapi/joi');

const selectionSchema = Joi.object().keys({
  data: Joi.object().required(),
  description: Joi.string(),
  type: Joi.any().valid(['segmentation', 'trigger']).required(),
});

module.exports.isValidSelection = data => selectionSchema.validate(data);
