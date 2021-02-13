const {celebrate, Joi} = require('celebrate');

module.exports.PUT_USER = celebrate(
  {
    body: Joi.object().keys(
      {
        name:Joi.string(),
        description: Joi.string(),
      }
    ),
  },
    {
      abortEarly: false,
    }
);

module.exports.POST_POST = celebrate(
  {
    body: Joi.object().keys(
      {legend: Joi.string()}
    ),
  },
  {
    abortEarly: false
  }
)