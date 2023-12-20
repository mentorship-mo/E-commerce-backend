import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs For E-commerce",
      version: "1.0.0",
    },
    server: [{ url: "http://localhost:4000/" }],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/utils/swagger/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
