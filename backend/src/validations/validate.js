import { z } from "zod"
import { generateErrorMessage } from "zod-error"

const validate = (schema, input) => {

  const formatterOptions = {
    delimiter: { component: " - " },
    code: { enabled: false },
    maxErrors: 1,
    message: { label: null },
    path: {
      enabled: true,
      label: null,
      type: "breadcrumbs",
      arraySquareBrackets: false,
      delimeter: ", "
    }
  }

  try {
    schema.parse(input)
  }
  catch(e) {
    const message = e instanceof z.ZodError
      ? `: ${generateErrorMessage(e.errors, formatterOptions)}`
      : ""

    return { valid: false, message }
  }

  return { valid: true }
}

export default validate
