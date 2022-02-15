const Joi = require('joi');

exports.validateContribution = (contribution) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        group: Joi.string().required(),
        amount: Joi.number().required(),
    });
    return schema.validate(contribution);
}