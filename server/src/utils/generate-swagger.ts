import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My Express API",
    version: "1.0.0",
    description: "Documentation for my Express API",
  },
  servers: [
    {
      url: "http://localhost:3000",
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