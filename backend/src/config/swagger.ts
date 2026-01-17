import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel-Hub API',
      version: '1.0.0',
      description: 'API para gestão hoteleira (Teste Técnico)',
      contact: {
        name: 'Daniele Santos',
      },
    },
    servers: [
      { url: '/', description: 'Servidor Atual (Mesma Origem)' }, 
      { url: 'http://localhost:3000', description: 'Servidor Local' },
    ],
  },
  apis: ['./src/docs/*.yaml'], 
};

export const swaggerSpec = swaggerJsdoc(options);