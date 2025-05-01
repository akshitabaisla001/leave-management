import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
   otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(), // OTP should be 6 digits
});



