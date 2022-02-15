const Joi = require('joi');

exports.validateGroup = (group) => {
    const schema = Joi.object({
        groupName: Joi.string().required(),
        members: Joi.array().items(Joi.string()),
        private: Joi.boolean(),
    });
    return schema.validate(group);
};