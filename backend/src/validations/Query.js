/* eslint-disable camelcase */
import { z } from "zod"
import validate from "./validate.js"
import regex from "../utils/regex.js"

const QuerySchema =  z.string().regex(regex.query, { message: regex.queryDesc })
const validateQuery = (input) => validate(QuerySchema, input)

export default validateQuery
