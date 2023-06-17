/* eslint-disable camelcase */
import { z } from "zod"
import validate from "./validate.js"
import regex from "../utils/regex.js"

const LoginUserSchema = z.object({
  username: z.string().regex(regex.username, { message: regex.usernameDesc }),
  password: z.string().regex(regex.password, { message: regex.passwordDesc })
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
  newPassword: z.union([z.string().regex(regex.password, { message: regex.passwordDesc }).optional(), z.string().length(0)]),
  email: z.string().regex(regex.email, { message: regex.emailDesc }).optional()
})
const validateEditUser = (input) => validate(EditUserSchema, input)

const DeleteUserSchema = z.object({
  oldPassword: z.string().regex(regex.password, { message: regex.passwordDesc })
})
const validateDeleteUser = (input) => validate(DeleteUserSchema, input)

const UserArtistsSchema = z.array(z.object({
  id: z.string(),
  name: z.string()
}))
const validateUserArtists = (input) => validate(UserArtistsSchema, input)

const UserGenresSchema = z.array(z.string())
const validateUserGenres = (input) => validate(UserGenresSchema, input)

export {
  validateLoginUser,
  validateCreateUser,
  validateEditUser,
  validateDeleteUser,
  validateUserArtists,
  validateUserGenres
}
