const Joi = require('joi');

exports.validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string(),

    });
    return schema.validate(user);
};

exports.validateSignIn = (user) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};