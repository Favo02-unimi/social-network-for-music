// handler to unknown api endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

export default unknownEndpoint
