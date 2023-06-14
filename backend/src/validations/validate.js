import { z } from "zod"

const validate = (schema, input) => {

  try {
    schema.parse(input)
  }
  catch(e) {
    const message = e instanceof z.ZodError
      ? `: ${formatZodError(e)}`
      : ""

    return { valid: false, message }
  }

  return { valid: true }
}

const formatZodError = (zodError) => (

  // print each error with formatting --> "PATH: error"
  zodError.errors.map(err => {

    // if has path --> "PATH: error"
    if (err.path.length > 0) {
      return ` ${err.path.pop().toUpperCase()}: ${err.message.toLocaleLowerCase()}`
    }

    // no path --> "error"
    return err.message.toLocaleLowerCase()
  })
)

export default validate
