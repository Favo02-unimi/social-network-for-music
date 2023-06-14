/* eslint-disable camelcase */
import { z } from "zod"
import validate from "./validate.js"
import regex from "../utils/regex.js"

const LoginUserSchema = z.object({
  username: z.string().regex(regex.username),
  password: z.string().regex(regex.password)
})
const validateLoginUser = (input) => validate(LoginUserSchema, input)

const CreateUserSchema = z.object({
  username: z.string().regex(regex.username, { message: regex.usernameDesc }),
  password: z.string().regex(regex.password, { message: regex.passwordDesc }),
  email: z.string().regex(regex.email, { message: regex.emailDesc })
})
const validateCreateUser = (input) => validate(CreateUserSchema, input)

const EditUserSchema = z.object({
  oldPassword: z.string().regex(regex.password, { message: regex.passwordDesc }),
  username: z.string().regex(regex.username, { message: regex.usernameDesc }).optional(),
  newPassword: z.string().regex(regex.password, { message: regex.passwordDesc }).optional(),
  email: z.string().regex(regex.email, { message: regex.emailDesc }).optional()
})
const validateEditUser = (input) => validate(EditUserSchema, input)

const DeleteUserSchema = z.object({
  oldPassword: z.string().regex(regex.password, { message: regex.passwordDesc })
})
const validateDeleteUser = (input) => validate(DeleteUserSchema, input)

export {
  validateLoginUser,
  validateCreateUser,
  validateEditUser,
  validateDeleteUser
}
