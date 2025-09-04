import Joi from "joi";

export const systemValidation = {
  checkStatus: {
    body: Joi.object().keys({
      backendUrl: Joi.string().uri().required().label("Backend URL"),
      mongoUri: Joi.string()
        .pattern(/^mongodb(\+srv)?:\/\/.*/)
        .required()
        .label("Mongo URI"),
      frontendUrl: Joi.string().uri().required().label("Frontend URL"),
    }),
  },

  getLogs: {
    query: Joi.object().keys({
      limit: Joi.number().integer().min(1).max(100).default(20).label("Limit"),
      service: Joi.string()
        .valid("Backend", "MongoDB", "Frontend")
        .optional()
        .label("Service"),
      status: Joi.string().valid("UP", "DOWN").optional().label("Status"),
    }),
  },
};
