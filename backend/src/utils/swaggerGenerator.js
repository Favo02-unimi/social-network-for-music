import swaggerAutogen from "swagger-autogen"

const doc = {
  info: {
    title: "Social Network for Music API",
    description: "Social Network for Music REST API"
  },
  host: "localhost:3003",
  schemes: ["http"]
}

const endpointsFiles = ["../app.js"]

const outputFile = "./swagger.json"

swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
  await import("../index.js")
})
