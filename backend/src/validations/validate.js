import { z } from "zod"

const validate = (schema, input) => {

  try {
    schema.parse(input)
  }
  catch(e) {
    const message = e instanceof z.ZodError
      ? `: ${e.errors.map(e => ` ${e.path.pop().toUpperCase()}: ${e.message.toLocaleLowerCase()}`)}`
      : ""

    return { valid: false, message }
  }

  return { valid: true }
}

export default validate
