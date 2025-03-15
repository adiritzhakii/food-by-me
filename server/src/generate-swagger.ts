import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;


// Swagger definition
console.log(port)
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My Express API",
    version: "1.0.0",
    description: "Documentation for my Express API",
  },
  servers: [
    {
      url: `http://0.0.0.0:${port}`,
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ["src/**/*.ts"], // Adjust this path to match your file structure
};

// Generate Swagger spec
const swaggerSpec = swaggerJSDoc(options);

// Write to swagger.json
fs.writeFileSync("swagger.json", JSON.stringify(swaggerSpec, null, 2), "utf-8");

console.log("swagger.json generated successfully!");