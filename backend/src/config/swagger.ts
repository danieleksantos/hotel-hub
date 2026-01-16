import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel-Hub API',
      version: '1.0.0',
      description: 'API Hotel-Hub',
      contact: {
        name: 'Daniele Santos',
        url: 'https://github.com/danieleksantos',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/server.ts'], 
};

export const swaggerSpec = swaggerJsdoc(options);